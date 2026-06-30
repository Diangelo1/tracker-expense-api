const { Category, Expense } = require('../models');
const { renderCategory, renderCategoryList } = require('../views/categoryView');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const index = asyncHandler(async (req, res) => {
  const categories = await Category.findAll({ order: [['nome', 'ASC']] });
  return res.json(renderCategoryList(categories));
});

const show = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) {
    throw new AppError('Categoria não encontrada.', 404);
  }
  return res.json(renderCategory(category));
});

const create = asyncHandler(async (req, res) => {
  const { nome, descricao } = req.body;
  const category = await Category.create({ nome, descricao });
  return res.status(201).json(renderCategory(category));
});

const update = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) {
    throw new AppError('Categoria não encontrada.', 404);
  }

  const { nome, descricao } = req.body;
  await category.update({ nome, descricao });

  return res.json(renderCategory(category));
});

const destroy = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) {
    throw new AppError('Categoria não encontrada.', 404);
  }

  const despesasVinculadas = await Expense.count({ where: { categoriaId: category.id } });
  if (despesasVinculadas > 0) {
    throw new AppError('Não é possível excluir: existem despesas vinculadas a esta categoria.', 409);
  }

  await category.destroy();
  return res.status(204).send();
});

module.exports = { index, show, create, update, destroy };
