const sequelize = require('../config/database');

const User = require('./User');
const Category = require('./Category');
const Expense = require('./Expense');

// Associações
// Um usuário possui várias despesas
User.hasMany(Expense, { foreignKey: 'usuarioId', as: 'despesas', onDelete: 'CASCADE' });
Expense.belongsTo(User, { foreignKey: 'usuarioId', as: 'usuario' });

// Uma categoria possui várias despesas
Category.hasMany(Expense, { foreignKey: 'categoriaId', as: 'despesas', onDelete: 'RESTRICT' });
Expense.belongsTo(Category, { foreignKey: 'categoriaId', as: 'categoria' });

module.exports = {
  sequelize,
  User,
  Category,
  Expense,
};
