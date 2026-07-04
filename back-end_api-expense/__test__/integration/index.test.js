const { describe, test, expect } = require('@jest/globals')
const { create } = require("../../src/controllers/UserController.js")

describe ("Teste de integração  de usuários", () => {

    test("Buscar um usuário", async () => {
        const nome = "joao"
        const email ="batata@teste.com"
        const senha = "12345678"
        const ativo = true
        
        const user = await create({req: {body: { nome, email, senha, ativo }}})
        console.log(user)
    })
})