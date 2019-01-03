import axios from 'axios';

export function create(data) {
    return axios.put('http://apigreen.jkapp.com.br/api/pedido/cadastrar', {
        id: data.id,
        nome: data.nome,
        descricao: data.descricao,
        valor: data.valor,
        quantidade: data.quantidade,
    })
}

export function getAll() {
    return axios.get('http://apigreen.jkapp.com.br/api/pedido/listar')
}

export function remover(id) {
    return axios.delete('http://apigreen.jkapp.com.br/api/pedido/remover/' + id)
}