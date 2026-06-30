const { Router } = require('express');
const { body } = require('express-validator');
const ExpenseController = require('../controllers/ExpenseController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');

const router = Router();

router.use(authMiddleware);

const expenseValidation = [
  body('descricao').notEmpty().withMessage('A descrição é obrigatória.'),
  body('valor').isFloat({ gt: 0 }).withMessage('O valor deve ser maior que zero.'),
  body('data').isISO8601().withMessage('Informe uma data válida (YYYY-MM-DD).'),
  body('status').optional().isIn(['PENDENTE', 'PAGA']).withMessage('O status deve ser PENDENTE ou PAGA.'),
  body('categoriaId').isInt().withMessage('Informe o id de uma categoria válida.'),
];

// GET /expenses?status=PAGA&categoria=1&dataInicio=2026-01-01&dataFim=2026-06-30&valorMin=10&valorMax=500
router.get('/', ExpenseController.index);
router.get('/:id', ExpenseController.show);
router.post('/', expenseValidation, validate, ExpenseController.create);
router.put('/:id', expenseValidation, validate, ExpenseController.update);
router.delete('/:id', ExpenseController.destroy);

module.exports = router;
