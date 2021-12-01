const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },
        desc: { type: DataTypes.STRING, allowNull: false },
        imgs: {
            type: DataTypes.STRING, allowNull: false,
            get() {
                return this.getDataValue('imgs').split(';')
            },
            set(val) {
                this.setDataValue('imgs', val.join(';'));
            },
        },
    };

    const options = {
        defaultScope: {
            // exclude hash by default
            // attributes: { exclude: ['hash'] }
        },
        scopes: {
            // include hash with this scope
            // withHash: { attributes: {}, }
        }
    };

    return sequelize.define('Tags', attributes, options);
}