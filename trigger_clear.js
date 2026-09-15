const https = require('https');

const req = https.request(
  'https://api.render.com/v1/services/srv-dakfmnrm8hqs73eeoqhg/deploys',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer rnd_i21PH9wzvYQVTy8GwvWhvDgu0KsE',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },
  (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => console.log('Deploy response:', res.statusCode, data));
  }
);

req.write(JSON.stringify({ clearCache: 'clear' }));
req.end();
