function renderCategory(category) {
  return {
    id: category.id,
    nome: category.nome,
    descricao: category.descricao,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

function renderCategoryList(categories) {
  return categories.map(renderCategory);
}

module.exports = { renderCategory, renderCategoryList };
