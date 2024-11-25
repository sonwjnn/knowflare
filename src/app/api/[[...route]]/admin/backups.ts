import { db } from '@/db/drizzle'
import { backups, insertBackupsSchema } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { exec } from 'child_process'
import { desc, eq, inArray } from 'drizzle-orm'
import fs from 'fs'
import { promises as fsp } from 'fs'
import { readFile, unlink } from 'fs/promises'
import { Hono } from 'hono'
import mysql, { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import os from 'os'
import path from 'path'
import { promisify } from 'util'
import { z } from 'zod'

const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)

interface TableRow extends RowDataPacket {
  [key: string]: any
}

interface CreateTableResult extends RowDataPacket {
  'Create Table': string
}

const app = new Hono()
  .get('/', async c => {
    const data = await db.select().from(backups).orderBy(desc(backups.date))

    if (!data) {
      return c.json({ error: 'Not found' }, 404)
    }

    return c.json({
      data,
    })
  })
  .get(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.string(),
      })
    ),
    async c => {
      const { id } = c.req.valid('param')

      const [data] = await db
        .select({
          id: backups.id,
          fileUrl: backups.fileUrl,
        })
        .from(backups)
        .where(eq(backups.id, id))

      if (!data) {
        return c.json({ error: 'data not found' }, 404)
      }

      return c.json({ data })
    }
  )
  .post('/', verifyAuth(), async c => {
    const auth = c.get('authUser')
    if (!auth.token?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    })

    let sqlContent = ''

    // Add SQL version and dump info
    const [versionResult] =
      await connection.query<TableRow[]>('SELECT VERSION()')
    sqlContent += `-- MySQL dump\n`
    sqlContent += `-- Server version: ${versionResult[0]['VERSION()']}\n`
    sqlContent += `-- Date: ${new Date().toISOString()}\n\n`

    sqlContent += 'SET FOREIGN_KEY_CHECKS=0;\n'
    sqlContent += 'SET UNIQUE_CHECKS=0;\n'
    sqlContent += "SET sql_mode='NO_AUTO_VALUE_ON_ZERO';\n\n"

    // Lấy danh sách tables
    const [tables] = await connection.query<TableRow[]>('SHOW TABLES')

    // Backup từng table
    for (const tableRow of tables) {
      const tableName = Object.values(tableRow)[0]

      if (tableName === 'backup') {
        continue
      }

      // 1. Tạo CREATE TABLE statement
      const [createTableResults] = await connection.query<CreateTableResult[]>(
        `SHOW CREATE TABLE \`${tableName}\``
      )

      sqlContent += `--\n-- Table structure for table \`${tableName}\`\n--\n\n`
      sqlContent += `DROP TABLE IF EXISTS \`${tableName}\`;\n`
      sqlContent += createTableResults[0]['Create Table'] + ';\n\n'

      // 2. Lấy data từ table
      const [rows] = await connection.query<TableRow[]>(
        `SELECT * FROM \`${tableName}\``
      )

      if (rows.length > 0) {
        sqlContent += `--\n-- Dumping data for table \`${tableName}\`\n--\n\n`

        // Tạo INSERT statement cho mỗi 1000 rows
        const chunkSize = 1000
        for (let i = 0; i < rows.length; i += chunkSize) {
          const chunk = rows.slice(i, i + chunkSize)

          sqlContent += `INSERT INTO \`${tableName}\` VALUES\n`
          const values = chunk
            .map(row => {
              return `(${Object.values(row)
                .map(value => {
                  if (value === null) return 'NULL'
                  if (typeof value === 'string')
                    return `'${value.replace(/'/g, "''").replace(/\\/g, '\\\\')}'`
                  if (value instanceof Date)
                    return `'${value.toISOString().slice(0, 19).replace('T', ' ')}'`
                  if (typeof value === 'boolean') return value ? '1' : '0'
                  if (Buffer.isBuffer(value))
                    return `0x${value.toString('hex')}`
                  return value
                })
                .join(',')})`
            })
            .join(',\n')

          sqlContent += values + ';\n'
        }
        sqlContent += '\n'
      }
    }

    sqlContent += 'SET FOREIGN_KEY_CHECKS=1;\n'
    sqlContent += 'SET UNIQUE_CHECKS=1;\n'

    await connection.end()

    const tmpDir = path.resolve('./tmp')
    if (!fs.existsSync(tmpDir)) {
      await mkdir(tmpDir)
    }

    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_')
    const fileName = `backup_${timestamp}.sql`
    const filePath = path.join(tmpDir, fileName)

    await writeFile(filePath, sqlContent)

    const data = await db.insert(backups).values({
      fileUrl: filePath,
    })

    return c.json({ data })
  })
  .post(
    '/restore',
    verifyAuth(),
    zValidator(
      'json',
      insertBackupsSchema.pick({
        fileUrl: true,
      })
    ),
    async c => {
      const auth = c.get('authUser')
      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      if (auth.token?.role !== 'admin') {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      // Lấy fileUrl từ body
      const { fileUrl } = c.req.valid('json')

      if (!fileUrl) {
        return c.json({ error: 'Missing fileUrl' }, 400)
      }

      // Kiểm tra file có tồn tại
      const filePath = path.resolve(fileUrl)
      if (!fs.existsSync(filePath)) {
        return c.json({ error: 'File not found' }, 404)
      }

      // Đọc nội dung file SQL
      let sqlContent: string
      try {
        sqlContent = await readFile(filePath, 'utf-8')
      } catch (err) {
        console.error(`Failed to read file: ${filePath}`, err)
        return c.json({ error: 'Failed to read SQL file' }, 500)
      }

      // Kết nối đến database
      const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        multipleStatements: true, // Cho phép chạy nhiều câu lệnh SQL cùng lúc
      })

      try {
        // Chạy lệnh SQL từ file
        await connection.query(sqlContent)

        console.log(`Database restored successfully from ${filePath}`)
        await connection.end()

        return c.json({
          message: 'Database restored successfully',
          file: filePath,
        })
      } catch (err) {
        console.error('Failed to restore database', err)
        await connection.end()

        return c.json({ error: 'Failed to restore database' }, 500)
      }
    }
  )

  .delete(
    '/:id',
    verifyAuth(),
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      if (auth.token?.role !== 'admin') {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { id } = c.req.valid('param')

      if (!id) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const [backup] = await db.select().from(backups).where(eq(backups.id, id))

      if (!backup) {
        return c.json({ error: 'Not found' }, 404)
      }

      const filePath = path.resolve(backup.fileUrl)
      if (fs.existsSync(filePath)) {
        try {
          await fsp.unlink(filePath)
        } catch (err) {
          console.error(`Failed to delete file: ${filePath}`, err)
        }
      }

      const [deletedBackup] = await db.delete(backups).where(eq(backups.id, id))

      return c.json({ data: deletedBackup })
    }
  )
  .post(
    '/bulk-delete',
    verifyAuth(),
    zValidator(
      'json',
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      if (auth.token?.role !== 'admin') {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const values = c.req.valid('json')

      if (!values) {
        return c.json({ error: 'Missing values' }, 400)
      }

      const backupsToDelete = await db
        .select()
        .from(backups)
        .where(inArray(backups.id, values.ids))

      for (const backup of backupsToDelete) {
        const filePath = path.resolve(backup.fileUrl)
        if (fs.existsSync(filePath)) {
          try {
            await fsp.unlink(filePath)
          } catch (err) {
            console.error(`Failed to delete file: ${filePath}`, err)
          }
        }
      }

      const data = await db
        .delete(backups)
        .where(inArray(backups.id, values.ids))

      return c.json({ data })
    }
  )

export default app
