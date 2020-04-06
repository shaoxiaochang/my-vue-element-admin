import axios from 'axios'

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    timeout: 5000 // request timeout
})

// request interceptor


// response interceptor
service.interceptors.response.use(
    response => {
        const res = response.data

        return res
    }
)

export default service
