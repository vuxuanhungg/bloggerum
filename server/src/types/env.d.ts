declare namespace NodeJS {
    export interface ProcessEnv {
        PORT: string
        MONGO_URI: string
        REDIS_URL: string
        SESSION_SECRET: string
        TEBI_KEY: string
        TEBI_SECRET: string
        NODEMAILER_HOST: string
        NODEMAILER_EMAIL: string
        NODEMAILER_PASSWORD: string
        CORS_ORIGIN: string
    }
}
