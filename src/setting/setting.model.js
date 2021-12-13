const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        trelloKeyApi: { type: DataTypes.STRING, allowNull: false },
        trelloToken: { type: DataTypes.STRING, allowNull: false },
        dropboxToken: { type: DataTypes.STRING, allowNull: false },
        slackToken: { type: DataTypes.STRING, allowNull: false },
        nameAppDropbox: { type: DataTypes.STRING, allowNull: false },
    };

    const options = {
        defaultScope: {
        },
        scopes: {
        }
    };

    return sequelize.define('Setting', attributes, options);
}