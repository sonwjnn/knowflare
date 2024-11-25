import { exec } from 'child_process'
import path from 'path'
import { promisify } from 'util'

const BACKUP_DIR = path.resolve(__dirname, 'backups')

const execPromise = promisify(exec)

export async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.-]/g, '_')
  const backupFileName = `backup_${timestamp}.sql`
  const backupFilePath = path.join(BACKUP_DIR, backupFileName)

  const mysqldumpCommand = `mysqldump -h ${process.env.DATABASE_HOST} -u ${process.env.DATABASE_USER} -p${process.env.DATABASE_PASSWORD} ${process.env.DATABASE_NAME} > ${backupFilePath}`

  try {
    await execPromise(mysqldumpCommand)
    console.log(`Backup created successfully: ${backupFilePath}`)
  } catch (error) {
    console.error('Error creating backup:', error)
  }
}

export async function restoreBackup(backupFileName: string) {
  const backupFilePath = path.join(BACKUP_DIR, backupFileName)

  const mysqlCommand = `mysql -h ${process.env.DATABASE_HOST} -u ${process.env.DATABASE_USER} -p${process.env.DATABASE_PASSWORD} ${process.env.DATABASE_NAME} < ${backupFilePath}`

  try {
    await execPromise(mysqlCommand)
    console.log(`Database restored successfully from: ${backupFilePath}`)
  } catch (error) {
    console.error('Error restoring backup:', error)
  }
}
