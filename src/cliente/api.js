import axios from './../app/api'

export function getAll() {
    return axios.get('/cliente/listar')
}

export function get(id) {
    return axios.get('/cliente/listar/detalhes/' + id)
}

export function getPedido(id) {
    return axios.get('/cliente/listar/pedidos/' + id)
}

export function create(data) {
    return axios.put('/cliente/cadastrar', {
        distribuidorId: data.distribuidorId,
        nome: data.nome,
        cpf: data.cpf,
        rg: data.rg,
        email: data.email,
        telefone: data.telefone,
        celular: data.celular,
        nomeEndereco: data.endereco.nomeEndereco,
        numero: data.endereco.numero,
        complemento: data.endereco.complemento,
        bairro: data.endereco.bairro,
        cep: data.endereco.cep,
        cidade: data.endereco.cidade,
        estado: data.endereco.estado,
    })
}

export function update(data) {
    return axios.post('/cliente/editar/' + data.id, {
        distribuidorId: data.distribuidorId,
        nome: data.nome,
        cpf: data.cpf,
        rg: data.rg,
        email: data.email,
        telefone: data.telefone,
        celular: data.celular,
        nomeEndereco: data.endereco.nomeEndereco,
        numero: data.endereco.numero,
        complemento: data.endereco.complemento,
        bairro: data.endereco.bairro,
        cep: data.endereco.cep,
        cidade: data.endereco.cidade,
        estado: data.endereco.estado,
    })
}

export function remove(id) {
    return axios.delete('/cliente/remover/' + id)
}

export function upload(data, id) {
    return axios.post('/cliente/upload/' + id, data)
}