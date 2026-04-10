// Request/response header name for the refresh token when it is not only carried in HttpOnly cookies.
// Used by the session retry flow: after the session or X-Auth expires, clients can send this header
// (and read an updated token from the same header on the response) to obtain a new session without a full re-login.
const REFRESH_TOKEN_HEADER = 'refresh'

module.exports = { REFRESH_TOKEN_HEADER }
