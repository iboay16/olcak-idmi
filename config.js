const sql = require('mssql');
const util = require("util")
const config = {
    server: 'localhost', // Veritabanı sunucusu adı veya IP adresi
    database: 'blogapp', // Veritabanı adı
    user: "sa", // Veritabanı kullanıcı adı
    password: "123456", // Veritabanı kullanıcı şifresi
    options: {
      encrypt: false, // Verilerin şifrelenmesi (true/false)
      trustedConnection: false, // Güvenli bağlantı kullanımı (true/false)
    }
};

let connection = new sql.ConnectionPool(config).connect()
.then(query => { return query } )
.catch(e => console.error("Database Trouble!  ", e))



module.exports = connection;