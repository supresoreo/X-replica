const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { createUser, authenticateUser, getUserById, searchUsers } = require('./utils/userStore');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'midterm-exam-local-secret';

app.use(cors());
app.use(express.json());

const signToken = (user) => {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Missing authentication token.' });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await getUserById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'x-replica-auth', port: PORT });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const fullName = req.body.fullName || req.body.name || req.body.displayName;
    const username = req.body.username || req.body.handle || req.body.userName;
    const email = req.body.email;
    const birthday = req.body.birthday || req.body.birthDate || req.body.dateOfBirth;
    const password = req.body.password;

    if (!fullName || !username || !email || !birthday || !password) {
      return res.status(400).json({
        message: 'fullName, username, email, birthday, and password are required.',
      });
    }

    const user = await createUser({ fullName, username, email, birthday, password });
    const token = signToken(user);

    return res.status(201).json({ token, user });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Unable to create account.',
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required.' });
    }

    const user = await authenticateUser({ email, password });
    const token = signToken(user);

    return res.json({ token, user });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Unable to log in.',
    });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  return res.json({ user: req.user });
});

app.get('/api/users', authMiddleware, async (req, res) => {
  try {
    const query = typeof req.query.q === 'string' ? req.query.q : '';
    const users = await searchUsers(query);
    return res.json({ users: users.filter((user) => user.id !== req.user.id) });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load users.' });
  }
});

app.listen(PORT, () => {
  console.log(`Auth API listening on http://localhost:${PORT}/api`);
});
