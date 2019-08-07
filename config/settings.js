
module.exports = {
	port     : process.env.PORT || 3000,
	database : {
        client: process.env.DB_CLIENT,
        connection: {
            host     : process.env.DB_HOST,
            port     : process.env.DB_PORT,
            database : process.env.DB_NAME,
            user     : process.env.DB_USER,
            password : process.env.DB_PASSWORD
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },
    session: {
        secret: 'm4t78eryhty54h3qT5E54hsdlkjt7',
        resave: false,
        saveUninitialized: false,
        cookie: { 
            // If HTTPS set this to true
            secure: false,
            maxAge: 30 * 24 * 60 * 60 * 1000 // 1 month
        }
    }
};