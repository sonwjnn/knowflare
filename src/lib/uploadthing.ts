import type { OurFileRouter } from '@/app/api/uploadthing/core'
import {
  generateUploadButton,
  generateUploadDropzone,
} from '@uploadthing/react'
// import axios from 'axios'
// import * as fs from 'fs'
// import * as path from 'path'

// const FormData = require('form-data')

export const UploadButton = generateUploadButton<OurFileRouter>()
export const UploadDropzone = generateUploadDropzone<OurFileRouter>()

// export const uploadToUploadThing = async (
//   filePath: string
// ): Promise<string> => {
//   const fileData = fs.createReadStream(filePath) // Luồng đọc file
//   const formData = new FormData()
//   formData.append('file', fileData, path.basename(filePath)) // Đính kèm file vào form

//   const response = await axios.post(
//     'https://api.uploadthing.com/upload',
//     formData,
//     {
//       headers: {
//         ...formData.getHeaders(),
//         Authorization: `Bearer ${process.env.UPLOADTHING_API_KEY}`,
//       },
//     }
//   )

//   if (response.status !== 200) {
//     throw new Error('Failed to upload file to UploadThing')
//   }

//   return response.data.fileUrl
// }
