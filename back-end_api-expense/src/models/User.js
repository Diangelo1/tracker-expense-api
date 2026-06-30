const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

const SALT_ROUNDS = 10;

class User extends Model {
  async checkPassword(plainPassword) {
    return bcrypt.compare(plainPassword, this.senha);
  }

  toSafeObject() {
    const { id, nome, email, createdAt, updatedAt } = this;
    return { id, nome, email, createdAt, updatedAt };
  }
}

User.init(
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'O nome é obrigatório.' },
        len: { args: [2, 100], msg: 'O nome deve ter entre 2 e 100 caracteres.' },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'Este email já está cadastrado.' },
      validate: {
        notEmpty: { msg: 'O email é obrigatório.' },
        isEmail: { msg: 'Informe um email válido.' },
      },
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'A senha é obrigatória.' },
        len: { args: [6, 100], msg: 'A senha deve ter pelo menos 6 caracteres.' },
      },
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('senha')) {
          user.senha = await bcrypt.hash(user.senha, SALT_ROUNDS);
        }
      },
    },
  }
);

module.exports = User;
