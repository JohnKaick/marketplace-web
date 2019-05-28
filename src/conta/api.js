import axios from '../app/api'

export function loginDistribuidor(data) {
    return axios.post('/conta/login', {
        nome: data.nome,
        senha: data.senha,
        categoria: data.categoria
    })
}
