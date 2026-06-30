const { Router } = require('express');

const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const categoryRoutes = require('./category.routes');
const expenseRoutes = require('./expense.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = Router();

router.get('/', (req, res) => {
  res.json({ mensagem: 'Expense Tracker API está no ar.' });
});

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/expenses', expenseRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
