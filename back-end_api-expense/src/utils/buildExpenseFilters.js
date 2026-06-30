const { Op } = require('sequelize');

/**
 * Monta a cláusula `where` do Sequelize a partir dos filtros de query string.
 * Suporta: categoria, status, período (dataInicio/dataFim) e faixa de valor (valorMin/valorMax).
 * Sempre restringe ao usuário autenticado.
 */
function buildExpenseFilters(query, usuarioId) {
  const where = { usuarioId };

  const categoria = query.categoria || query.categoriaId;
  if (categoria) {
    where.categoriaId = categoria;
  }

  if (query.status) {
    where.status = query.status;
  }

  const dataInicio = query.dataInicio || query.dataInicial;
  const dataFim = query.dataFim || query.dataFinal;
  if (dataInicio || dataFim) {
    where.data = {};
    if (dataInicio) where.data[Op.gte] = dataInicio;
    if (dataFim) where.data[Op.lte] = dataFim;
  }

  const valorMin = query.valorMin || query.valorMinimo;
  const valorMax = query.valorMax || query.valorMaximo;
  if (valorMin || valorMax) {
    where.valor = {};
    if (valorMin) where.valor[Op.gte] = valorMin;
    if (valorMax) where.valor[Op.lte] = valorMax;
  }

  return where;
}

module.exports = buildExpenseFilters;
