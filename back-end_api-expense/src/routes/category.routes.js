const { Router } = require('express');
const { body } = require('express-validator');
const CategoryController = require('../controllers/CategoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');

const router = Router();

router.use(authMiddleware);

const categoryValidation = [
  body('nome').notEmpty().withMessage('O nome da categoria é obrigatório.'),
  body('descricao').optional({ nullable: true }).isString(),
];

router.get('/', CategoryController.index);
router.get('/:id', CategoryController.show);
router.post('/', categoryValidation, validate, CategoryController.create);
router.put('/:id', categoryValidation, validate, CategoryController.update);
router.delete('/:id', CategoryController.destroy);

module.exports = router;
