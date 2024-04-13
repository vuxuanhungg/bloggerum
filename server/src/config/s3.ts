import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { TEBI_BUCKET_NAME } from '../constants'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const credentials = {
    accessKeyId: process.env.TEBI_KEY,
    secretAccessKey: process.env.TEBI_SECRET,
}

export const s3Client = new S3Client({
    endpoint: 'https://s3.tebi.io',
    credentials,
    region: 'global',
})

export const getFileUrl = async (fileName: string) => {
    const getCommand = new GetObjectCommand({
        Bucket: TEBI_BUCKET_NAME,
        Key: fileName,
    })
    const url = await getSignedUrl(s3Client, getCommand)
    return url
}
