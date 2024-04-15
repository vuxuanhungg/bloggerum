import crypto from 'crypto'

const uuid = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

export default uuid
