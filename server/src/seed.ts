import { fakerVI as faker } from '@faker-js/faker'
import Post from './models/postModel'

export const seedDB = async () => {
    for (let i = 0; i < 50; i++) {
        const title = faker.lorem.lines()
        const body = faker.lorem.paragraphs()

        const post = {
            title,
            body,
            userId: '6603fbfb00f99b90580ef461',
        }

        await Post.create(post)
    }

    console.log('Database seeded!')
}
