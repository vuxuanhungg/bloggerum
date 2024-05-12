import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import isUrl from 'is-url'
import sharp from 'sharp'
import { s3Client } from '../config/s3'
import { TEBI_BUCKET_NAME, TEBI_ENDPOINT } from '../constants'
import uuid from '../utils/uuid'

const imageUrlPrefix = `${TEBI_ENDPOINT}/${TEBI_BUCKET_NAME}`

export const uploadImage = async (
    image: {
        buffer: Buffer
        mimetype: string
    },
    resize: Boolean = true
) => {
    const imageName = uuid()

    const imageBuffer = await sharp(image.buffer)
        .resize({
            width: 1200,
            height: !resize ? undefined : 800,
            withoutEnlargement: true,
        })
        .webp()
        .toBuffer()

    const uploadCommand = new PutObjectCommand({
        Bucket: TEBI_BUCKET_NAME,
        Key: imageName,
        Body: imageBuffer,
        ContentType: image.mimetype,
    })
    await s3Client.send(uploadCommand)

    const imageUrl = `${imageUrlPrefix}/${imageName}`

    return { imageUrl }
}

export const deleteImage = async (imageUrlOrName: string) => {
    let key = imageUrlOrName
    if (isUrl(imageUrlOrName)) {
        key = imageUrlOrName.replace(`${imageUrlPrefix}/`, '')
    }

    const deleteCommand = new DeleteObjectCommand({
        Bucket: TEBI_BUCKET_NAME,
        Key: key,
    })
    await s3Client.send(deleteCommand)
}
