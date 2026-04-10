const corsLib = require('cors')
const { REFRESH_TOKEN_HEADER } = require('../common/constant')

class Cors {
  /**
   * Middleware to check for whitelist and allow API methods.
   * Plus headers used for longer-session tenants (refresh token not only as HttpOnly cookie).
   */
  static cors ({ url: urlList, domain }) {
    const corsOptions = {
      origin: function (origin, callback) {
        if (!origin) {
          callback(null)
        } else if (urlList.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          for (const d of domain) {
            if (origin.endsWith(d)) {
              return callback(null, true)
            }
          }
          callback(null)
        }
      },
      credentials: true,
      allowedHeaders: [
        'X-Request-Id',
        'Accept',
        'Authorization',
        'Content-Type',
        'X-CSRF-Token',
        'sentry-trace',
        'baggage',
        REFRESH_TOKEN_HEADER,
        'x-refresh-token'
      ],
      exposedHeaders: ['link', REFRESH_TOKEN_HEADER]
    }
    return corsLib(corsOptions)
  }
}

module.exports = Cors
