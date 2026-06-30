const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Category extends Model {}

Category.init(
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'Já existe uma categoria com este nome.' },
      validate: {
        notEmpty: { msg: 'O nome da categoria é obrigatório.' },
        len: { args: [2, 50], msg: 'O nome deve ter entre 2 e 50 caracteres.' },
      },
    },
    descricao: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
  }
);

module.exports = Category;
