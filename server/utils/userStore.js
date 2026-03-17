const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

const readUsers = async () => {
  try {
    const content = await fs.readFile(USERS_FILE, 'utf8');
    const users = JSON.parse(content);
    return Array.isArray(users) ? users : [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
};

const writeUsers = async (users) => {
  await fs.writeFile(USERS_FILE, `${JSON.stringify(users, null, 2)}\n`, 'utf8');
};

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

const sanitizeUser = (user) => {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

const normalizeUsername = (value) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/^@+/, '')
    .replace(/[^a-z0-9_]+/g, '')
    .slice(0, 15);
};

const createUser = async ({ fullName, username, email, birthday, password }) => {
  const users = await readUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = normalizeUsername(username);

  const existingUser = users.find((user) => user.email === normalizedEmail);
  if (existingUser) {
    const error = new Error('An account with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  if (!normalizedUsername || normalizedUsername.length < 4) {
    const error = new Error('Username must be 4-15 characters and can only contain letters, numbers, and underscores.');
    error.statusCode = 400;
    throw error;
  }

  const usernameTaken = users.find(
    (user) => normalizeUsername(user.username || '') === normalizedUsername
  );

  if (usernameTaken) {
    const error = new Error('That username is already taken.');
    error.statusCode = 409;
    throw error;
  }

  const user = {
    id: crypto.randomUUID(),
    fullName,
    displayName: fullName,
    email: normalizedEmail,
    birthday,
    username: normalizedUsername,
    bio: '',
    avatar: (fullName || 'U').trim().charAt(0).toUpperCase(),
    avatarImage: '',
    averageColor: '#000000',
    followers: 0,
    following: 0,
    followerIds: [],
    followingIds: [],
    tweets: 0,
    banner: '#cfd9de',
    bannerImage: '',
    location: '',
    website: '',
    createdAt: new Date().toISOString(),
    passwordHash: hashPassword(password),
  };

  users.push(user);
  await writeUsers(users);

  return sanitizeUser(user);
};

const authenticateUser = async ({ email, password }) => {
  const users = await readUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((entry) => entry.email === normalizedEmail);

  if (!user || user.passwordHash !== hashPassword(password)) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  return sanitizeUser(user);
};

const getUserById = async (id) => {
  const users = await readUsers();
  const user = users.find((entry) => entry.id === id);
  return user ? sanitizeUser(user) : null;
};

const searchUsers = async (query = '') => {
  const users = await readUsers();
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return users.map(sanitizeUser);
  }

  return users
    .filter((user) => {
      const normalizedUsername = normalizeUsername(user.username || '');
      return (
        user.fullName?.toLowerCase().includes(normalizedQuery) ||
        user.displayName?.toLowerCase().includes(normalizedQuery) ||
        normalizedUsername.includes(normalizedQuery.replace(/^@+/, '')) ||
        user.bio?.toLowerCase().includes(normalizedQuery)
      );
    })
    .map(sanitizeUser);
};

module.exports = {
  createUser,
  authenticateUser,
  getUserById,
  searchUsers,
};
