import axios from './../app/api'

export function getAll() {
    return axios.get('/distribuidor/listar')
}

export function get(id) {
    return axios.get('/distribuidor/listar/detalhe/' + id)
}

export function create(data) {
    return axios.put('/distribuidor/cadastrar', {
        nome: data.nome,
        razaoSocial: data.razaoSocial,
        cnpj: data.cnpj,
        telefone: data.telefone,
        nomeCompleto: data.nomeCompleto,
        cpf: data.cpf,
        rg: data.rg,
        email: data.email,
        celular: data.celular,
        nomeEndereco: data.nomeEndereco,
        numero: data.numero,
        complemento: data.complemento,
        cep: data.cep,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
        pagamentoId: data.pagamentoId,
        categoriaId: data.categoriaId,
        pgDados: data.pgDados,
        valor: data.valor,
        login: data.login,
        senha: data.senha,
    })
}

export function update(data) {
    return axios.post('/distribuidor/editar/' + data.id, {
        nome: data.nome,
        razaoSocial: data.razaoSocial,
        cnpj: data.cnpj,
        telefone: data.telefone,
        nomeCompleto: data.nomeCompleto,
        cpf: data.cpf,
        rg: data.rg,
        email: data.email,
        celular: data.celular,
        nomeEndereco: data.nomeEndereco,
        numero: data.numero,
        complemento: data.complemento,
        cep: data.cep,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
        pagamentoId: data.pagamentoId,
        categoriaId: data.categoriaId,
        pgDados: data.pgDados,
        valor: data.valor,
        login: data.login,
        senha: data.senha,
        contaId: data.contaId
    })
}

export function remove(id) {
    return axios.delete('/distribuidor/remover/' + id)
}

export function active(id) {
    return axios.post('/distribuidor/ativar/' + id)
}

export function upload(data, id) {
    return axios.post('/distribuidor/upload/' + id, data)
}

export function createProduto(data) {
    return axios.post('/distribuidor/cadastrar/produto/' + data.id, {
        produtoId: data.produtoId
    })
}

export function updateProduto(data) {
    return axios.post('/distribuidor/editar/produto/' + data.id, {
        nome: data.nome,
        descricao: data.descricao,
        valor: data.valor,
        categoriaId: data.categoriaId,
        produtoId: data.produtoId
    })
}

export function selectProduto(data) {
    return axios.post('/distribuidor/selecionar/produto/' + data.id, {
        produtoId: data.produtoId,
        valor: data.valor,
        descricao: data.descricao,
    })
}

export function removeProduto(data) {
    return axios.post('/distribuidor/remover/produto/' + data.id, {
        produtoId: data.produtoId,
    })
}

export function uploadProduto(data, id, produtoId) {
    return axios.post('/distribuidor/upload/produto/' + id + '/' + produtoId, data)
}

export function getPedido(id) {
    return axios.get('/distribuidor/listar/pedido/' + id)
}

export function getCliente(id) {
    return axios.get('/distribuidor/listar/cliente/' + id)
}

export function getConta(id) {
    return axios.get('/distribuidor/listar/conta/' + id)
}

export function getOneCodId(id) {
    return axios.get('/distribuidor/listar/codId/' + id)
}