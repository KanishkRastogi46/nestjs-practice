export default () => ({
    environment: process.env.NODE_ENV,
    db: {
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
    }
})