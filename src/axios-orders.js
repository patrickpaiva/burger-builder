import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://burger-builder-97aaf-default-rtdb.firebaseio.com/'
})

export default instance