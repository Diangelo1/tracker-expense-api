const { User } = require('../models');
const { renderUser } = require('../views/userView');
const { generateToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const login = asyncHandler(async (req, res) => {
  const { email, senha } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError('Email ou senha inválidos.', 401);
  }

  const senhaValida = await user.checkPassword(senha);
  if (!senhaValida) {
    throw new AppError('Email ou senha inválidos.', 401);
  }

  const token = generateToken({ id: user.id });

  return res.status(200).json({
    usuario: renderUser(user),
    token,
  });
});

module.exports = { login };
