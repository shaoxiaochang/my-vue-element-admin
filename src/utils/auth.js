import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}
