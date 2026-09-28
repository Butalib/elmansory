import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { App } from '@tinyhttp/app';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { createApp } from 'json-server/lib/app.js';
import { NormalizedAdapter } from 'json-server/lib/adapters/normalized-adapter.js';

const port = Number(process.env.PORT ?? 3000);
const databasePath = process.env.MOCK_DB_PATH
  ? resolve(process.env.MOCK_DB_PATH)
  : fileURLToPath(new URL('./db.json', import.meta.url));
const db = new Low(new NormalizedAdapter(new JSONFile(databasePath)), {});

await db.read();

const app = new App();

app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }

  next();
});

app.post('/auth/login', async (request, response) => {
  const body = await readJsonBody(request, response);
  if (!body) {
    return;
  }

  const email = readRequiredString(body, 'email');
  const password = readRequiredString(body, 'password');
  const user = db.data.users?.find(
    (candidate) => candidate.email === email && candidate.password === password,
  );

  if (!user) {
    response.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  response.status(200).json(createSession(user));
});

app.post('/auth/register', async (request, response) => {
  const body = await readJsonBody(request, response);
  if (!body) {
    return;
  }

  const name = readRequiredString(body, 'name');
  const email = readRequiredString(body, 'email');
  const password = readRequiredString(body, 'password');
  const username = readOptionalString(body, 'username') ?? email.split('@')[0];

  if (!name || !email || !password || !username) {
    response.status(400).json({ error: 'name, email, password, and username are required' });
    return;
  }

  const users = db.data.users ?? (db.data.users = []);
  const duplicate = users.some((user) => user.email === email || user.username === username);
  if (duplicate) {
    response.status(409).json({ error: 'An account with this email or username already exists' });
    return;
  }

  const user = {
    id: randomUUID(),
    username,
    email,
    password,
    name,
    role: 'admin',
  };

  users.push(user);
  await db.write();
  response.status(201).json(createSession(user));
});

app.use(createApp(db));

app.listen(port, () => {
  console.log(`Mock API started on http://localhost:${port}`);
  console.log('Auth endpoints: POST /auth/login, POST /auth/register');
});

function createSession(user) {
  return {
    accessToken: `mock-${randomUUID()}`,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

function readRequiredString(body, field) {
  const value = readOptionalString(body, field);
  return value ?? '';
}

function readOptionalString(body, field) {
  const value = body[field];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

async function readJsonBody(request, response) {
  try {
    const chunks = [];
    for await (const chunk of request) {
      chunks.push(chunk);
    }

    const rawBody = Buffer.concat(chunks).toString();
    const body = JSON.parse(rawBody);
    if (!body || Array.isArray(body) || typeof body !== 'object') {
      throw new Error('Request body must be a JSON object');
    }

    return body;
  } catch {
    response.status(400).json({ error: 'Request body must be a JSON object' });
    return null;
  }
}
