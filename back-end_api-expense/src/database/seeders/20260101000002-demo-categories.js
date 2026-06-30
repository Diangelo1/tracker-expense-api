'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('categories', [
      {
        nome: 'Alimentação',
        descricao: 'Gastos com mercado, restaurantes e delivery',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'Transporte',
        descricao: 'Combustível, aplicativos de transporte e transporte público',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'Lazer',
        descricao: 'Cinema, streaming e entretenimento',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'Saúde',
        descricao: 'Consultas, exames e farmácia',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'Moradia',
        descricao: 'Aluguel, contas e manutenção da casa',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
