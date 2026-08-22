const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../app');

const listen = () => {
  return new Promise((resolve) => {
    const server = app.listen(0, '127.0.0.1', () => {
      resolve(server);
    });
  });
};

const request = (server, method, path, body) => {
  const address = server.address();
  const payload = body ? JSON.stringify(body) : null;

  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: address.port,
        path,
        method,
        headers: {
          ...(payload ? { 'Content-Type': 'application/json' } : {}),
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
        }
      },
      (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            body: data ? JSON.parse(data) : null
          });
        });
      }
    );

    req.on('error', reject);

    if (payload) {
      req.write(payload);
    }

    req.end();
  });
};

test('GET /api/health returns service status', async () => {
  const server = await listen();

  try {
    const response = await request(server, 'GET', '/api/health');

    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.body, {
      success: true,
      service: 'portfolio-api'
    });
  } finally {
    server.close();
  }
});

test('POST /api/auth/login rejects missing credentials', async () => {
  const server = await listen();

  try {
    const response = await request(server, 'POST', '/api/auth/login', {
      username: ''
    });

    assert.equal(response.statusCode, 400);
    assert.equal(response.body.error, 'Username and password are required');
  } finally {
    server.close();
  }
});

test('admin portfolio writes require a token', async () => {
  const server = await listen();

  try {
    const response = await request(server, 'PUT', '/api/portfolio/personal', {
      name: 'Test'
    });

    assert.equal(response.statusCode, 401);
    assert.equal(response.body.error, 'No token provided');
  } finally {
    server.close();
  }
});
