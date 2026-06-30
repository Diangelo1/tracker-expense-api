function renderExpense(expense) {
  return {
    id: expense.id,
    descricao: expense.descricao,
    valor: Number(expense.valor),
    data: expense.data,
    status: expense.status,
    categoriaId: expense.categoriaId,
    usuarioId: expense.usuarioId,
    categoria: expense.categoria
      ? { id: expense.categoria.id, nome: expense.categoria.nome }
      : undefined,
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
  };
}

function renderExpenseList(expenses) {
  return expenses.map(renderExpense);
}

module.exports = { renderExpense, renderExpenseList };
