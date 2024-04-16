import { S3Client } from '@aws-sdk/client-s3'
import { TEBI_ENDPOINT } from '../constants'

const credentials = {
    accessKeyId: process.env.TEBI_KEY,
    secretAccessKey: process.env.TEBI_SECRET,
}

export const s3Client = new S3Client({
    endpoint: TEBI_ENDPOINT,
    credentials,
    region: 'global',
})
