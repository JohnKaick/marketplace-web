import axios from '../app/api'

export function addPedido(distribuidorId, clienteId) {
    return axios.put('/pedido/cadastrar', {
        distribuidorId, 
        clienteId 
    })
}


export function getPedido(distribuidorId) {
    return axios.get('/pedido/listar/' + distribuidorId)
}

export function getPedidoDetalhe(id) {
    return axios.get('/pedido/listar/detalhe/' + id)
}

export function delPedido(id) {
    return axios.delete('/pedido/remover/' + id)
}