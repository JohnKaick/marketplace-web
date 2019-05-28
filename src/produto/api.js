import axios from './../app/api'

export function getAll() {
    return axios.get('/produto/listar')
}

export function create(data) {
    return axios.put('/produto/cadastrar', {
        nome: data.nome,
        descricao: data.descricao,
        valor: data.valor,
        categoriaId: data.categoriaId,
    })
}

export function update(data) {
    return axios.post('/produto/editar/' + data.id, {
        nome: data.nome,
        descricao: data.descricao,
        valor: data.valor,
        categoriaId: data.categoriaId,
    })
}

export function remove(id) {
    return axios.delete('/produto/remover/' + id)
}

export function upload(data, id) {
    return axios.post('/produto/upload/' + id, data)
}

export function getDistribuidor(id) {
    return axios.get('/produto/listar/distribuidor/' + id)
}