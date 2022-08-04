const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas','root','root7898*',{
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = connection;