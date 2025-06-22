const options = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'postgres',
    entities: [
        'dist/**/*.entity.js'
    ],
    migrations: [
        'dist/migrations/*.js'
    ],
    // cli: {
    //     migrationsDir: 'src/migrations'
    // } 
}

export default options