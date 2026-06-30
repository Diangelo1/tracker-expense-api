module.exports = function errorMiddleware(err, req, res, next) {
  console.error(err);

  // Erros de validação do Sequelize
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      erro: 'Dados inválidos.',
      detalhes: err.errors.map((e) => ({ campo: e.path, mensagem: e.message })),
    });
  }

  // Violação de foreign key (ex: categoriaId/usuarioId inexistente)
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ erro: 'Referência inválida (usuário ou categoria não encontrada).' });
  }

  // Erros de JWT
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }

  // Erro de negócio lançado manualmente com statusCode
  if (err.statusCode) {
    return res.status(err.statusCode).json({ erro: err.message });
  }

  return res.status(500).json({ erro: 'Erro interno do servidor.' });
};
