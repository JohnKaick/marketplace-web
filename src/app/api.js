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

export function getAll() {
    return axios.get('http://apigreen.jkapp.com.br/api/carrinho/listar')
}

export function remover(id) {
    return axios.delete('http://apigreen.jkapp.com.br/api/carrinho/remover/' + id)
}