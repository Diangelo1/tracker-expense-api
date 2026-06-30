const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const STATUS_VALUES = ['PENDENTE', 'PAGA'];

class Expense extends Model {}

Expense.init(
  {
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'A descrição é obrigatória.' },
        len: { args: [2, 150], msg: 'A descrição deve ter entre 2 e 150 caracteres.' },
      },
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: 'O valor deve ser numérico.' },
        min: { args: [0.01], msg: 'O valor deve ser maior que zero.' },
      },
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: { msg: 'Informe uma data válida.' },
      },
    },
    status: {
      type: DataTypes.ENUM(...STATUS_VALUES),
      allowNull: false,
      defaultValue: 'PENDENTE',
      validate: {
        isIn: { args: [STATUS_VALUES], msg: 'O status deve ser PENDENTE ou PAGA.' },
      },
    },
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'categoriaId',
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'usuarioId',
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Expense',
    tableName: 'expenses',
  }
);

Expense.STATUS_VALUES = STATUS_VALUES;

module.exports = Expense;
