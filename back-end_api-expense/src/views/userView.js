function renderUser(user) {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

module.exports = { renderUser };
