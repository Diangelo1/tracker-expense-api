const { User } = require('../models');
const { renderUser } = require('../views/userView');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const create = asyncHandler(async (req, res) => {
  const { nome, email, senha } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError('Este email já está cadastrado.', 409);
  }

  const user = await User.create({ nome, email, senha });

  return res.status(201).json(renderUser(user));
});

module.exports = { create };
