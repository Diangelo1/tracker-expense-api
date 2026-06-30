'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    const senhaHash = await bcrypt.hash('123456', 10);

    await queryInterface.bulkInsert('users', [
      {
        nome: 'Maria Silva',
        email: 'maria@example.com',
        senha: senhaHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'João Souza',
        email: 'joao@example.com',
        senha: senhaHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
