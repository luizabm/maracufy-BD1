const pg = require('pg')

const client = new pg.Client(
    {
        user: '',
        host: '',
        database: '',
        password: '',
        port: '',
        ssl: {
            sslmode: 'require',
            rejectUnauthorized: false
        }
    }
)

module.exports = client