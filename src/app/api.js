import axios from 'axios';

export function addCarrinho(data, distribuidorId, clienteId) {
    return axios.put('http://apigreen.jkapp.com.br/api/carrinho/cadastrar', {
        id: data.id,
        nome: data.nome,
        descricao: data.descricao,
        valor: data.valor,
        quantidade: data.quantidade,
        distribuidorId: distribuidorId,
        clienteId: clienteId
    })
}

export function getCarrinho(distribuidorId, clienteId) {
    return axios.get('http://apigreen.jkapp.com.br/api/carrinho/listar/' + distribuidorId + '/' + clienteId)
}

export function delCarrinho(id, distribuidorId, clienteId) {
    return axios.post('http://apigreen.jkapp.com.br/api/carrinho/remover', {
        id, distribuidorId, clienteId
    })
}

export function addPedido(distribuidorId, clienteId) {
    return axios.put('http://apigreen.jkapp.com.br/api/pedido/cadastrar', {
        distribuidorId, 
        clienteId 
    })
}

export function getPedido(distribuidorId) {
    return axios.get('http://apigreen.jkapp.com.br/api/pedido/listar/' + distribuidorId)
}

export function getPedidoDetalhe(id) {
    return axios.get('http://apigreen.jkapp.com.br/api/pedido/listar/detalhe/' + id)
}

export function delPedido(id) {
    return axios.delete('http://apigreen.jkapp.com.br/api/pedido/remover/' + id)
}