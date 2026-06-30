const { Router } = require('express');
const DashboardController = require('../controllers/DashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.get('/total-expenses', DashboardController.totalExpenses);
router.get('/expenses-count', DashboardController.expensesCount);
router.get('/expenses-by-category', DashboardController.expensesByCategory);

module.exports = router;
