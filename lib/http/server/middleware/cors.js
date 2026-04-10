const corsLib = require('cors')
const { REFRESH_TOKEN_HEADER } = require('../common/constant')

class Cors {
  /**
   * Returns Express CORS middleware: origin allowlist (exact URLs + domain suffixes), credentials,
   * and headers needed for auth and observability.
   *
   * Includes the refresh-token header so browsers may send it on credentialed cross-origin requests
   * during session retry (when session / X-Auth has expired and the client retries with a refresh token).
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
        // Session retry: preflight must allow clients to send the refresh token after session / X-Auth expiry.
        REFRESH_TOKEN_HEADER,
        'x-refresh-token' // alternate casing/name some clients use
      ],
      // Let frontend JS read a new refresh token from the response when the server issues one on retry.
      exposedHeaders: ['link', REFRESH_TOKEN_HEADER]
    }
    return corsLib(corsOptions)
  }
}

module.exports = Cors
