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

const request = (server, method, path, body, headers = {}) => {
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
          , ...headers
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
            headers: res.headers,
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
    assert.equal(response.body.error, 'Authentication required');
    assert.equal(response.body.code, 'AUTH_REQUIRED');
  } finally {
    server.close();
  }
});

test('anonymous users cannot register admin or editor accounts', async () => {
  const server = await listen();
  try {
    for (const role of ['admin', 'editor']) {
      const response = await request(server, 'POST', '/api/auth/register', {
        username: `anonymous-${role}`,
        email: `${role}@example.com`,
        password: 'not-a-real-password',
        role
      });
      assert.equal(response.statusCode, 403);
      assert.equal(response.body.code, 'REGISTRATION_DISABLED');
    }
  } finally {
    server.close();
  }
});

test('new user documents use the least-privilege editor role', () => {
  const User = require('../models/User');
  const user = new User({ username: 'least-privilege', email: 'least@example.com', password: 'long-enough-password' });
  assert.equal(user.role, 'editor');
});

test('portfolio DTO drops unsupported mass-assignment fields', () => {
  const { sanitizePortfolio } = require('../src/modules/portfolio/portfolio.validation');
  const result = sanitizePortfolio({
    _id: 'attacker-controlled',
    role: 'admin',
    heroStats: [{ value: '1+', label: 'Year' }]
  });
  assert.deepEqual(Object.keys(result), ['heroStats']);
});

test('GET portfolio fallback is read-only when the database is empty', async () => {
  const repository = require('../src/modules/portfolio/portfolio.repository');
  const service = require('../src/modules/portfolio/portfolio.service');
  const originalFindOne = repository.findOne;
  const originalCreate = repository.create;
  let created = false;
  repository.findOne = async () => null;
  repository.create = async () => { created = true; };
  try {
    const portfolio = await service.getPortfolio();
    assert.equal(portfolio.personal.name, 'Mahmoud Mostafa Abozahra');
    assert.equal(created, false);
  } finally {
    repository.findOne = originalFindOne;
    repository.create = originalCreate;
  }
});

test('portfolio service preserves document identity and ignores unsupported fields', async () => {
  const repository = require('../src/modules/portfolio/portfolio.repository');
  const service = require('../src/modules/portfolio/portfolio.service');
  const originalFindOne = repository.findOne;
  const document = {
    _id: 'stable-portfolio-id',
    set(value) { Object.assign(this, value); },
    async save() { return this; }
  };
  repository.findOne = async () => document;
  try {
    const result = await service.updatePortfolio({ _id: 'attacker-id', role: 'admin', heroStats: [{ value: '3', label: 'Projects' }] });
    assert.equal(result._id, 'stable-portfolio-id');
    assert.equal(result.role, undefined);
    assert.deepEqual(result.heroStats, [{ value: '3', label: 'Projects' }]);
  } finally { repository.findOne = originalFindOne; }
});

test('security headers are enabled', async () => {
  const server = await listen();
  try {
    const address = server.address();
    const response = await new Promise((resolve, reject) => {
      const req = http.get({ hostname: '127.0.0.1', port: address.port, path: '/api/health' }, resolve);
      req.on('error', reject);
    });
    assert.equal(response.headers['x-content-type-options'], 'nosniff');
    response.resume();
  } finally {
    server.close();
  }
});

test('credentialed local CORS applies to success, auth errors and preflight responses', async () => {
  const server = await listen();
  const origin = 'http://localhost:5173';
  try {
    const success = await request(server, 'GET', '/api/health', null, { Origin: origin });
    const unauthorized = await request(server, 'GET', '/api/auth/me', null, { Origin: origin });
    const preflight = await request(server, 'OPTIONS', '/api/auth/login', null, {
      Origin: origin,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type,x-csrf-token'
    });

    for (const response of [success, unauthorized, preflight]) {
      assert.equal(response.headers['access-control-allow-origin'], origin);
      assert.equal(response.headers['access-control-allow-credentials'], 'true');
    }
    assert.equal(unauthorized.statusCode, 401);
    assert.equal(unauthorized.headers['cache-control'], 'no-store');
    assert.equal(preflight.statusCode, 204);
  } finally {
    server.close();
  }
});

test('unsupported upload content is deleted and rejected', () => {
  const fs = require('node:fs');
  const os = require('node:os');
  const path = require('node:path');
  const { validateFile } = require('../src/modules/media/upload.middleware');
  const filePath = path.join(os.tmpdir(), `portfolio-invalid-${process.pid}-${Date.now()}.png`);
  fs.writeFileSync(filePath, 'not an image');
  assert.throws(() => validateFile({ path: filePath, filename: path.basename(filePath) }), /supported, safe image/);
  assert.equal(fs.existsSync(filePath), false);
});
