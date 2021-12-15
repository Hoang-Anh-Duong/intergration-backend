const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, user, password, database } = config.database;
    console.log("host",host);
    console.log("user",user)
    console.log("password",password)
    console.log("database",database)
    const connection = await mysql.createConnection(
        {  
            host: 'us-cdbr-east-05.cleardb.net',
            user: 'b5197dec20d17e',
            password: '9a93496b' 
        });
    // await connection.query(`CREATE DATABASE IF NOT EXISTS \`heroku_f4a13dc33299292\`;`);

    // connect to db
    const sequelize = new Sequelize("heroku_f4a13dc33299292", 'b5197dec20d17e', '9a93496b', { dialect: 'mysql' });
    
    // init models and add them to the exported db object
    db.User = require('../src/users/user.model')(sequelize);
    db.Setting = require('../src/setting/setting.model')(sequelize);

    db.Setting.belongsTo(db.User, {foreignKey: 'user_id', targetKey: 'id'});

    // sync all models with database
    await sequelize.sync();
}