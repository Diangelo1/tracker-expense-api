const { Router } = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/AuthController');
const validate = require('../middlewares/validate');

const router = Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Informe um email válido.'),
    body('senha').notEmpty().withMessage('A senha é obrigatória.'),
  ],
  validate,
  AuthController.login
);

module.exports = router;
