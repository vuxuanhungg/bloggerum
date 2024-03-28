import { Model, Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

interface IUser {
    name: string
    email: string
    password: string
}

interface IUserMethods {
    matchPassword: (password: string) => Promise<boolean>
}

type UserModel = Model<IUser, {}, IUserMethods>

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    {
        timestamps: true,
    }
)

// Prehook to hash password before save
userSchema.pre('save', async function (next) {
    // Only hash password if created/modified
    if (!this.isModified('password')) {
        return next()
    }

    console.log('password modified...')
    const hashedPassword = await bcrypt.hash(this.password, 10)
    this.password = hashedPassword
})

// Custom method to check if password is correct
userSchema.method('matchPassword', async function (password: string) {
    return await bcrypt.compare(password, this.password)
})

const User = model<IUser, UserModel>('User', userSchema)

export default User
