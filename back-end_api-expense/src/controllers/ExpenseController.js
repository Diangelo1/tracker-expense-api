const { Expense, Category } = require('../models');
const { renderExpense, renderExpenseList } = require('../views/expenseView');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const buildExpenseFilters = require('../utils/buildExpenseFilters');

const index = asyncHandler(async (req, res) => {
  const where = buildExpenseFilters(req.query, req.userId);

  const expenses = await Expense.findAll({
    where,
    include: [{ model: Category, as: 'categoria', attributes: ['id', 'nome'] }],
    order: [['data', 'DESC']],
  });

  return res.json(renderExpenseList(expenses));
});

const show = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({
    where: { id: req.params.id, usuarioId: req.userId },
    include: [{ model: Category, as: 'categoria', attributes: ['id', 'nome'] }],
  });

  if (!expense) {
    throw new AppError('Despesa não encontrada.', 404);
  }

  return res.json(renderExpense(expense));
});

const create = asyncHandler(async (req, res) => {
  const { descricao, valor, data, status, categoriaId } = req.body;

  const category = await Category.findByPk(categoriaId);
  if (!category) {
    throw new AppError('Categoria informada não existe.', 400);
  }

  const expense = await Expense.create({
    descricao,
    valor,
    data,
    status,
    categoriaId,
    usuarioId: req.userId,
  });

  const created = await Expense.findByPk(expense.id, {
    include: [{ model: Category, as: 'categoria', attributes: ['id', 'nome'] }],
  });

  return res.status(201).json(renderExpense(created));
});

const update = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ where: { id: req.params.id, usuarioId: req.userId } });
  if (!expense) {
    throw new AppError('Despesa não encontrada.', 404);
  }

  const { descricao, valor, data, status, categoriaId } = req.body;

  if (categoriaId) {
    const category = await Category.findByPk(categoriaId);
    if (!category) {
      throw new AppError('Categoria informada não existe.', 400);
    }
  }

  await expense.update({ descricao, valor, data, status, categoriaId });

  const updated = await Expense.findByPk(expense.id, {
    include: [{ model: Category, as: 'categoria', attributes: ['id', 'nome'] }],
  });

  return res.json(renderExpense(updated));
});

const destroy = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ where: { id: req.params.id, usuarioId: req.userId } });
  if (!expense) {
    throw new AppError('Despesa não encontrada.', 404);
  }

  await expense.destroy();
  return res.status(204).send();
});

module.exports = { index, show, create, update, destroy };
