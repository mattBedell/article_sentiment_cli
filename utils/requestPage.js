const http = require('http');

const { get } = http;

module.exports = (endpoint) => {
  return new Promise((resolve, reject) => {
    get(endpoint, response => {
      const { statusCode } = response;

      if (parseInt(statusCode, 10) >= 300) {
        response.resume();
        reject(new Error(`Bad Request: ${statusCode}`))
      }

      response.setEncoding('utf8');

      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(data);
      });
    });

  }).catch(err => {
    console.error(err.message);
  })
}
