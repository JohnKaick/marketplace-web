import axios from '../app/api'

export function addCarrinho(data, distribuidorId, clienteId, observacao) {
    return axios.put('/carrinho/cadastrar', {
        distribuidorId: distribuidorId,
        clienteId: clienteId,
        produtoId: data._id,
        nome: data.nome,
        descricao: data.descricao,
        valor: data.valor,
        imagemPath: data.imagemPath,
        quantidade: data.quantidade,
        observacao
    })
}

export function getCarrinho(distribuidorId, clienteId) {
    return axios.get('/carrinho/listar/' + distribuidorId + '/' + clienteId)
}

export function delCarrinho(produtoId, distribuidorId, clienteId) {
    return axios.post('/carrinho/remover', {
        produtoId, 
        distribuidorId, 
        clienteId
    })
}
