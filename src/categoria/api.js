import axios from './../app/api'

export function getAllProduto() {
    return axios.get('/categoria-produto/listar')
}

export function getProduto(id) {
    return axios.get('/categoria-produto/listar/detalhes/' + id)
}

export function addProduto(data) {
    return axios.put('/categoria-produto/cadastrar', {
        nome: data.nome
    })
}

export function editProduto(data) {
    return axios.post('/categoria-produto/editar/' + data.id, {
        nome: data.nome
    })
}

export function delProduto(id) {
    return axios.delete('/categoria-produto/remover/' + id)
}

export function getAllDistribuidor() {
    return axios.get('/categoria-distribuidor/listar')
}

export function getDistribuidor(id) {
    return axios.get('/categoria-distribuidor/listar/detalhes/' + id)
}

export function addDistribuidor(data) {
    return axios.put('/categoria-distribuidor/cadastrar', {
        nome: data.nome
    })
}

export function editDistribuidor(data) {
    return axios.post('/categoria-distribuidor/editar/' + data.id, {
        nome: data.nome
    })
}

export function delDistribuidor(id) {
    return axios.delete('/categoria-distribuidor/remover/' + id)
}

export function getAllPagamento() {
    return axios.get('/categoria-pagamento/listar')
}

export function getPagamento(id) {
    return axios.get('/categoria-pagamento/listar/detalhes/' + id)
}

export function addPagamento(data) {
    return axios.put('/categoria-pagamento/cadastrar', {
        nome: data.nome
    })
}

export function editPagamento(data) {
    return axios.post('/categoria-pagamento/editar/' + data.id, {
        nome: data.nome
    })
}

export function delPagamento(id) {
    return axios.delete('/categoria-pagamento/remover/' + id)
}