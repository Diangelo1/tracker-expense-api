const { fn, col, literal } = require('sequelize');
const { Expense, Category } = require('../models');
const buildExpenseFilters = require('../utils/buildExpenseFilters');
const asyncHandler = require('../utils/asyncHandler');

// GET /dashboard/total-expenses -> { "total": 3500.50 }
const totalExpenses = asyncHandler(async (req, res) => {
  const where = buildExpenseFilters(req.query, req.userId);

  const result = await Expense.findOne({
    where,
    attributes: [[fn('COALESCE', fn('SUM', col('valor')), 0), 'total']],
    raw: true,
  });

  return res.json({ total: Number(result.total) });
});

// GET /dashboard/expenses-count -> { "quantidade": 45 }
const expensesCount = asyncHandler(async (req, res) => {
  const where = buildExpenseFilters(req.query, req.userId);

  const quantidade = await Expense.count({ where });

  return res.json({ quantidade });
});

// GET /dashboard/expenses-by-category -> [{ "categoria": "Alimentação", "total": 1200 }, ...]
const expensesByCategory = asyncHandler(async (req, res) => {
  const where = buildExpenseFilters(req.query, req.userId);

  const rows = await Expense.findAll({
    where,
    include: [{ model: Category, as: 'categoria', attributes: [] }],
    attributes: [
      [col('categoria.nome'), 'categoria'],
      [fn('COALESCE', fn('SUM', col('Expense.valor')), 0), 'total'],
    ],
    group: ['categoria.id', 'categoria.nome'],
    order: [[literal('total'), 'DESC']],
    raw: true,
  });

  const data = rows.map((row) => ({
    categoria: row.categoria,
    total: Number(row.total),
  }));

  return res.json(data);
});

module.exports = { totalExpenses, expensesCount, expensesByCategory };
