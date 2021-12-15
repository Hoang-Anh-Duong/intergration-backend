const config = require('config.json');
const mysql = require('mysql2');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection(
        {  
            host: 'heroku_f4a13dc33299292',
            user: 'b5197dec20d17e',
            database: '9a93496b' 
        });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });
    
    // init models and add them to the exported db object
    db.User = require('../src/users/user.model')(sequelize);
    db.Setting = require('../src/setting/setting.model')(sequelize);

    db.Setting.belongsTo(db.User, {foreignKey: 'user_id', targetKey: 'id'});

    // sync all models with database
    await sequelize.sync();
}