import axios from 'axios'

export default axios.create({
    baseURL: 'http://localhost:7000/api',
});
export const urlStorage = 'http://localhost:7000'

export function getKeep(distribuidorId) {
    return axios.get('/keepalive/keepalive/' + distribuidorId)
}