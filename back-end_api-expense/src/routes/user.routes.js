const { Router } = require('express');
const { body } = require('express-validator');
const UserController = require('../controllers/UserController');
const validate = require('../middlewares/validate');

const router = Router();

router.post(
  '/',
  [
    body('nome').notEmpty().withMessage('O nome é obrigatório.'),
    body('email').isEmail().withMessage('Informe um email válido.'),
    body('senha').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.'),
  ],
  validate,
  UserController.create
);

module.exports = router;
