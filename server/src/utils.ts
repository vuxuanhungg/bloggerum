import crypto from 'crypto'

export const uuid = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')
