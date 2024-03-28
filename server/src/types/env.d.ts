declare namespace NodeJS {
    export interface ProcessEnv {
        PORT: string
        MONGO_URI: string
        SESSION_SECRET: string
    }
}
