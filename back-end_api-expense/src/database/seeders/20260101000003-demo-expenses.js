'use strict';

module.exports = {
  up: async (queryInterface) => {
    const [users] = await queryInterface.sequelize.query('SELECT id FROM users ORDER BY id ASC;');
    const [categories] = await queryInterface.sequelize.query('SELECT id, nome FROM categories ORDER BY id ASC;');

    const findCategoriaId = (nome) => categories.find((c) => c.nome === nome).id;
    const usuarioId = users[0].id;
    const usuarioId2 = users[1] ? users[1].id : users[0].id;

    await queryInterface.bulkInsert('expenses', [
      {
        descricao: 'Supermercado do mês',
        valor: 650.9,
        data: '2026-06-02',
        status: 'PAGA',
        categoriaId: findCategoriaId('Alimentação'),
        usuarioId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        descricao: 'Combustível',
        valor: 280.0,
        data: '2026-06-05',
        status: 'PAGA',
        categoriaId: findCategoriaId('Transporte'),
        usuarioId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        descricao: 'Assinatura streaming',
        valor: 39.9,
        data: '2026-06-10',
        status: 'PENDENTE',
        categoriaId: findCategoriaId('Lazer'),
        usuarioId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        descricao: 'Consulta médica',
        valor: 200.0,
        data: '2026-06-12',
        status: 'PENDENTE',
        categoriaId: findCategoriaId('Saúde'),
        usuarioId: usuarioId2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        descricao: 'Conta de energia',
        valor: 310.5,
        data: '2026-06-15',
        status: 'PAGA',
        categoriaId: findCategoriaId('Moradia'),
        usuarioId: usuarioId2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('expenses', null, {});
  },
};
