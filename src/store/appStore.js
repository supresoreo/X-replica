import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';
import { normalizeApiError, setApiAuthToken } from '../services/apiClient';

const AUTH_TOKEN_KEY = '@xclone_auth_token';
const LOCAL_STATE_KEY = '@xclone_local_state';

const SEED_USERS = [
  {
    id: 'seed-ava-stone',
    username: '@avastone',
    displayName: 'Ava Stone',
    avatar: 'A',
    avatarImage: '',
    averageColor: '#1d9bf0',
    bio: 'Product designer sharing interface studies and mobile experiments.',
    location: 'New York, USA',
    website: 'avastone.design',
    followers: 0,
    following: 0,
    followerIds: [],
    followingIds: [],
    tweets: 24,
    banner: '#95e1d3',
    bannerImage: '',
    email: 'ava@example.com',
    birthday: '1998-04-20',
  },
  {
    id: 'seed-liam-park',
    username: '@liampark',
    displayName: 'Liam Park',
    avatar: 'L',
    avatarImage: '',
    averageColor: '#ff6b6b',
    bio: 'Frontend developer. Shipping React Native apps and documenting the rough edges.',
    location: 'Seoul, South Korea',
    website: 'liam.dev',
    followers: 0,
    following: 0,
    followerIds: [],
    followingIds: [],
    tweets: 48,
    banner: '#c9ada7',
    bannerImage: '',
    email: 'liam@example.com',
    birthday: '1997-11-02',
  },
  {
    id: 'seed-maya-lane',
    username: '@mayalane',
    displayName: 'Maya Lane',
    avatar: 'M',
    avatarImage: '',
    averageColor: '#8b5cf6',
    bio: 'Writer, traveler, and coffee shop reviewer. Mostly here for the threads.',
    location: 'Cebu, Philippines',
    website: 'mayalane.blog',
    followers: 0,
    following: 0,
    followerIds: [],
    followingIds: [],
    tweets: 31,
    banner: '#ffe66d',
    bannerImage: '',
    email: 'maya@example.com',
    birthday: '1996-08-12',
  },
  {
    id: 'seed-noah-reyes',
    username: '@noahreyes',
    displayName: 'Noah Reyes',
    avatar: 'N',
    avatarImage: '',
    averageColor: '#00ba7c',
    bio: 'Building in public. Notes on startups, metrics, and staying sane.',
    location: 'Manila, Philippines',
    website: 'noahreyes.co',
    followers: 0,
    following: 0,
    followerIds: [],
    followingIds: [],
    tweets: 17,
    banner: '#4ecdc4',
    bannerImage: '',
    email: 'noah@example.com',
    birthday: '1995-01-30',
  },
];

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const uniqueStrings = (values = []) => {
  return Array.from(new Set(values.filter(Boolean)));
};

const normalizeUsername = (value, email = '') => {
  const fallbackFromEmail = email ? email.split('@')[0] : 'user';

  if (!value) {
    return `@${fallbackFromEmail}`;
  }

  return value.startsWith('@') ? value : `@${value}`;
};

const normalizeUser = (user, existingUser = null) => {
  if (!user) {
    return null;
  }

  const displayName = user.displayName || user.fullName || user.name || existingUser?.displayName || 'User';
  const username = normalizeUsername(
    user.username || user.handle || user.userName || existingUser?.username,
    user.email || existingUser?.email || ''
  );
  const followerIds = uniqueStrings(user.followerIds || existingUser?.followerIds || []);
  const followingIds = uniqueStrings(user.followingIds || existingUser?.followingIds || []);

  return {
    id: user.id || user._id || user.userId || existingUser?.id || Date.now().toString(),
    username,
    displayName,
    avatar: user.avatar || existingUser?.avatar || displayName.charAt(0).toUpperCase(),
    avatarImage: user.avatarImage || existingUser?.avatarImage || '',
    averageColor: user.averageColor || existingUser?.averageColor || '#000000',
    bio: user.bio || existingUser?.bio || '',
    location: user.location || existingUser?.location || '',
    website: user.website || existingUser?.website || '',
    followers: followerIds.length || toNumber(user.followers || existingUser?.followers),
    following: followingIds.length || toNumber(user.following || existingUser?.following),
    followerIds,
    followingIds,
    tweets: toNumber(user.tweets || existingUser?.tweets),
    banner: user.banner || existingUser?.banner || '#cfd9de',
    bannerImage: user.bannerImage || existingUser?.bannerImage || '',
    email: user.email || existingUser?.email || '',
    birthday: user.birthday || existingUser?.birthday || '',
    createdAt: user.createdAt || existingUser?.createdAt || new Date().toISOString(),
  };
};

const mergeUsers = (...collections) => {
  const usersById = new Map();

  collections.flat().forEach((user) => {
    if (!user?.id) {
      return;
    }

    const existingUser = usersById.get(user.id) || null;
    usersById.set(user.id, normalizeUser(user, existingUser));
  });

  return Array.from(usersById.values());
};

const upsertUser = (users, nextUser) => {
  if (!nextUser) {
    return users;
  }

  const hasUser = users.some((user) => user.id === nextUser.id);
  if (!hasUser) {
    return [nextUser, ...users];
  }

  return users.map((user) => (user.id === nextUser.id ? normalizeUser(nextUser, user) : user));
};

const updateUsers = (users, replacements) => {
  const replacementMap = new Map(replacements.map((user) => [user.id, user]));
  return users.map((user) => replacementMap.get(user.id) || user);
};

const upsertDeviceAccount = (accounts, nextAccount) => {
  const nextAccounts = accounts.filter((account) => account.userId !== nextAccount.userId);
  return [{ ...nextAccount, lastUsedAt: new Date().toISOString() }, ...nextAccounts];
};

const resolveCurrentUser = (knownUsers, currentUserId) => {
  return knownUsers.find((user) => user.id === currentUserId) || null;
};

const mergeUniqueUsers = (primaryUsers, secondaryUsers) => {
  const seenIds = new Set();
  return [...primaryUsers, ...secondaryUsers].filter((user) => {
    if (!user?.id || seenIds.has(user.id)) {
      return false;
    }
    seenIds.add(user.id);
    return true;
  });
};

const buildPersistedState = (state) => {
  return JSON.stringify({
    knownUsers: state.knownUsers,
    deviceAccounts: state.deviceAccounts,
    currentUserId: state.currentUserId,
    tweets: state.tweets,
    bookmarks: state.bookmarks,
    conversations: state.conversations,
    messages: state.messages,
  });
};

const persistLocalState = async (state) => {
  await AsyncStorage.setItem(LOCAL_STATE_KEY, buildPersistedState(state));
};

const loadPersistedState = async () => {
  const rawState = await AsyncStorage.getItem(LOCAL_STATE_KEY);

  if (!rawState) {
    return null;
  }

  try {
    return JSON.parse(rawState);
  } catch {
    return null;
  }
};

const updateTweetAuthor = (tweet, user) => {
  return {
    ...tweet,
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar,
    avatarImage: user.avatarImage,
    averageColor: user.averageColor,
  };
};

export const useAppStore = create((set, get) => ({
  currentUser: null,
  currentUserId: null,
  knownUsers: [...SEED_USERS],
  deviceAccounts: [],
  authToken: null,
  isAuthenticated: false,
  authLoading: false,
  authError: '',

  tweets: [],
  bookmarks: [],
  conversations: [],
  messages: {},
  searchQuery: '',
  searchResults: {
    users: [],
    tweets: [],
  },

  hydrateAuth: async () => {
    try {
      const [persistedToken, persistedState] = await Promise.all([
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        loadPersistedState(),
      ]);

      const knownUsers = mergeUsers(SEED_USERS, persistedState?.knownUsers || []);
      const deviceAccounts = persistedState?.deviceAccounts || [];
      const currentUserId = persistedState?.currentUserId || deviceAccounts[0]?.userId || null;
      const fallbackUser = resolveCurrentUser(knownUsers, currentUserId);
      const currentAccount = deviceAccounts.find((account) => account.userId === currentUserId);
      const authToken = persistedToken || currentAccount?.token || null;

      if (!authToken || !fallbackUser) {
        set({
          knownUsers,
          deviceAccounts,
          currentUserId,
          currentUser: fallbackUser,
          tweets: persistedState?.tweets || [],
          bookmarks: persistedState?.bookmarks || [],
          conversations: persistedState?.conversations || [],
          messages: persistedState?.messages || {},
        });
        return;
      }

      setApiAuthToken(authToken);

      let nextKnownUsers = knownUsers;
      let nextCurrentUser = fallbackUser;

      try {
        const meResponse = await authService.me();
        const remoteUser = normalizeUser(meResponse?.user || meResponse, fallbackUser);
        nextKnownUsers = upsertUser(knownUsers, remoteUser);
        nextCurrentUser = resolveCurrentUser(nextKnownUsers, remoteUser.id);
      } catch {
        nextCurrentUser = fallbackUser;
      }

      const nextState = {
        authToken,
        currentUserId: nextCurrentUser.id,
        currentUser: nextCurrentUser,
        knownUsers: nextKnownUsers,
        deviceAccounts,
        isAuthenticated: true,
        authError: '',
        tweets: persistedState?.tweets || [],
        bookmarks: persistedState?.bookmarks || [],
        conversations: persistedState?.conversations || [],
        messages: persistedState?.messages || {},
      };

      set(nextState);
      await persistLocalState({ ...get(), ...nextState });
    } catch {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      setApiAuthToken(null);
      set({
        currentUser: null,
        currentUserId: null,
        authToken: null,
        isAuthenticated: false,
      });
    }
  },

  clearAuthError: () => set({ authError: '' }),

  login: async ({ email, password }) => {
    set({ authLoading: true, authError: '' });

    try {
      const { token, user } = await authService.login({ email, password });
      if (!token) {
        throw new Error('Authentication token was not returned by the API.');
      }

      const resolvedUser = user || (await authService.me());
      const existingUser = get().knownUsers.find(
        (entry) => entry.id === resolvedUser.id || entry.email === resolvedUser.email
      );
      const mappedUser = normalizeUser(resolvedUser, existingUser);

      setApiAuthToken(token);
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);

      const nextKnownUsers = upsertUser(get().knownUsers, mappedUser);
      const nextDeviceAccounts = upsertDeviceAccount(get().deviceAccounts, {
        userId: mappedUser.id,
        email: mappedUser.email,
        token,
      });

      const nextState = {
        authLoading: false,
        authToken: token,
        currentUserId: mappedUser.id,
        currentUser: mappedUser,
        knownUsers: nextKnownUsers,
        deviceAccounts: nextDeviceAccounts,
        isAuthenticated: true,
        authError: '',
      };

      set(nextState);
      await persistLocalState({ ...get(), ...nextState });

      return { ok: true };
    } catch (error) {
      set((state) => ({
        authLoading: false,
        authError: normalizeApiError(error),
        isAuthenticated: state.isAuthenticated,
      }));

      return { ok: false };
    }
  },

  register: async ({ fullName, username, email, birthday, password }) => {
    set({ authLoading: true, authError: '' });

    try {
      const registrationResult = await authService.register({
        fullName,
        username,
        email,
        birthday,
        password,
      });

      let token = registrationResult.token;
      let user = registrationResult.user;

      if (!token) {
        const loginResult = await authService.login({ email, password });
        token = loginResult.token;
        user = loginResult.user || user;
      }

      if (!token) {
        throw new Error('The account was created, but the API did not return a login token. Try logging in with your new credentials.');
      }

      const resolvedUser = user || (await authService.me());
      const existingUser = get().knownUsers.find(
        (entry) => entry.id === resolvedUser.id || entry.email === resolvedUser.email
      );
      const mappedUser = normalizeUser(resolvedUser, existingUser);

      setApiAuthToken(token);
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);

      const nextKnownUsers = upsertUser(get().knownUsers, mappedUser);
      const nextDeviceAccounts = upsertDeviceAccount(get().deviceAccounts, {
        userId: mappedUser.id,
        email: mappedUser.email,
        token,
      });

      const nextState = {
        authLoading: false,
        authToken: token,
        currentUserId: mappedUser.id,
        currentUser: mappedUser,
        knownUsers: nextKnownUsers,
        deviceAccounts: nextDeviceAccounts,
        isAuthenticated: true,
        authError: '',
      };

      set(nextState);
      await persistLocalState({ ...get(), ...nextState });

      return { ok: true };
    } catch (error) {
      set((state) => ({
        authLoading: false,
        authError: normalizeApiError(error),
        isAuthenticated: state.isAuthenticated,
      }));

      return { ok: false };
    }
  },

  switchAccount: async (accountId) => {
    const state = get();
    const targetAccount = state.deviceAccounts.find((account) => account.userId === accountId);
    const targetUser = resolveCurrentUser(state.knownUsers, accountId);

    if (!targetAccount?.token || !targetUser) {
      return { ok: false };
    }

    setApiAuthToken(targetAccount.token);
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, targetAccount.token);

    const nextDeviceAccounts = upsertDeviceAccount(state.deviceAccounts, targetAccount);
    const nextState = {
      authToken: targetAccount.token,
      currentUserId: targetUser.id,
      currentUser: targetUser,
      deviceAccounts: nextDeviceAccounts,
      isAuthenticated: true,
      authError: '',
    };

    set(nextState);
    await persistLocalState({ ...get(), ...nextState });

    return { ok: true };
  },

  logout: async () => {
    setApiAuthToken(null);
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);

    set({
      currentUser: null,
      currentUserId: null,
      authToken: null,
      isAuthenticated: false,
      authError: '',
      tweets: [],
      searchQuery: '',
      searchResults: {
        users: [],
        tweets: [],
      },
    });
  },

  addTweet: (content) => {
    const state = get();
    if (!state.currentUser) {
      return;
    }

    const updatedAuthor = {
      ...state.currentUser,
      tweets: state.currentUser.tweets + 1,
    };

    const newTweet = {
      id: Date.now().toString(),
      userId: updatedAuthor.id,
      username: updatedAuthor.username,
      displayName: updatedAuthor.displayName,
      avatar: updatedAuthor.avatar,
      avatarImage: updatedAuthor.avatarImage,
      averageColor: updatedAuthor.averageColor,
      content,
      timestamp: 'Just now',
      likes: 0,
      retweets: 0,
      replies: 0,
      isLiked: false,
      isRetweeted: false,
      isBookmarked: false,
    };

    const nextKnownUsers = upsertUser(state.knownUsers, updatedAuthor);
    const nextState = {
      tweets: [newTweet, ...state.tweets],
      knownUsers: nextKnownUsers,
      currentUser: updatedAuthor,
    };

    set(nextState);
    persistLocalState({ ...get(), ...nextState });
  },

  likeTweet: (id) => {
    set((state) => ({
      tweets: state.tweets.map((tweet) =>
        tweet.id === id
          ? {
              ...tweet,
              isLiked: !tweet.isLiked,
              likes: tweet.isLiked ? tweet.likes - 1 : tweet.likes + 1,
            }
          : tweet
      ),
    }));
  },

  retweetTweet: (id) => {
    set((state) => ({
      tweets: state.tweets.map((tweet) =>
        tweet.id === id
          ? {
              ...tweet,
              isRetweeted: !tweet.isRetweeted,
              retweets: tweet.isRetweeted ? tweet.retweets - 1 : tweet.retweets + 1,
            }
          : tweet
      ),
    }));
  },

  bookmarkTweet: (id) => {
    set((state) => ({
      tweets: state.tweets.map((tweet) =>
        tweet.id === id ? { ...tweet, isBookmarked: !tweet.isBookmarked } : tweet
      ),
    }));
  },

  updateUserProfile: (updates) => {
    const state = get();
    if (!state.currentUser) {
      return;
    }

    const updatedCurrentUser = normalizeUser(
      {
        ...state.currentUser,
        ...updates,
      },
      state.currentUser
    );

    const nextKnownUsers = upsertUser(state.knownUsers, updatedCurrentUser);
    const nextTweets = state.tweets.map((tweet) => {
      if (tweet.userId === state.currentUser.id || tweet.username === state.currentUser.username) {
        return updateTweetAuthor(tweet, updatedCurrentUser);
      }

      return tweet;
    });

    const nextState = {
      currentUser: updatedCurrentUser,
      knownUsers: nextKnownUsers,
      tweets: nextTweets,
    };

    set(nextState);
    persistLocalState({ ...get(), ...nextState });
  },

  isFollowingUser: (targetUserId) => {
    const state = get();
    return Boolean(state.currentUser?.followingIds?.includes(targetUserId));
  },

  getFollowersForUser: (userId) => {
    const state = get();
    const user = state.knownUsers.find((entry) => entry.id === userId);
    if (!user) {
      return [];
    }

    return user.followerIds
      .map((followerId) => state.knownUsers.find((entry) => entry.id === followerId))
      .filter(Boolean);
  },

  getFollowingForUser: (userId) => {
    const state = get();
    const user = state.knownUsers.find((entry) => entry.id === userId);
    if (!user) {
      return [];
    }

    return user.followingIds
      .map((followingId) => state.knownUsers.find((entry) => entry.id === followingId))
      .filter(Boolean);
  },

  followUser: (targetUserId) => {
    const state = get();
    const currentUser = state.currentUser;
    const targetUser = state.knownUsers.find((user) => user.id === targetUserId);

    if (!currentUser || !targetUser || currentUser.id === targetUserId) {
      return;
    }

    if (currentUser.followingIds.includes(targetUserId)) {
      return;
    }

    const updatedCurrentUser = normalizeUser(
      {
        ...currentUser,
        followingIds: [...currentUser.followingIds, targetUserId],
        following: currentUser.followingIds.length + 1,
      },
      currentUser
    );
    const updatedTargetUser = normalizeUser(
      {
        ...targetUser,
        followerIds: [...targetUser.followerIds, currentUser.id],
        followers: targetUser.followerIds.length + 1,
      },
      targetUser
    );

    const nextKnownUsers = updateUsers(state.knownUsers, [updatedCurrentUser, updatedTargetUser]);
    const nextState = {
      knownUsers: nextKnownUsers,
      currentUser: updatedCurrentUser,
    };

    set(nextState);
    persistLocalState({ ...get(), ...nextState });
  },

  unfollowUser: (targetUserId) => {
    const state = get();
    const currentUser = state.currentUser;
    const targetUser = state.knownUsers.find((user) => user.id === targetUserId);

    if (!currentUser || !targetUser || currentUser.id === targetUserId) {
      return;
    }

    if (!currentUser.followingIds.includes(targetUserId)) {
      return;
    }

    const updatedCurrentUser = normalizeUser(
      {
        ...currentUser,
        followingIds: currentUser.followingIds.filter((id) => id !== targetUserId),
      },
      currentUser
    );
    const updatedTargetUser = normalizeUser(
      {
        ...targetUser,
        followerIds: targetUser.followerIds.filter((id) => id !== currentUser.id),
      },
      targetUser
    );

    const nextKnownUsers = updateUsers(state.knownUsers, [updatedCurrentUser, updatedTargetUser]);
    const nextState = {
      knownUsers: nextKnownUsers,
      currentUser: updatedCurrentUser,
    };

    set(nextState);
    persistLocalState({ ...get(), ...nextState });
  },

  sendMessage: (conversationId, content) => {
    const state = get();
    if (!state.currentUser || !conversationId || !content.trim()) {
      return;
    }

    const newMessage = {
      id: Date.now().toString(),
      conversationId,
      sender: state.currentUser.username,
      content,
      timestamp: 'Just now',
    };

    const nextState = {
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), newMessage],
      },
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? { ...conv, lastMessage: content, timestamp: 'Just now', unread: false }
          : conv
      ),
    };

    set(nextState);
    persistLocalState({ ...get(), ...nextState });
  },

  setSearchQuery: async (query) => {
    const state = get();
    const normalized = query.trim().toLowerCase();

    set({ searchQuery: query });

    if (!normalized) {
      set({ searchResults: { users: [], tweets: [] } });
      return;
    }

    const tweetResults = state.tweets.filter((tweet) => {
      return (
        tweet.content.toLowerCase().includes(normalized) ||
        tweet.username.toLowerCase().includes(normalized) ||
        tweet.displayName.toLowerCase().includes(normalized)
      );
    });

    const localUserResults = state.knownUsers.filter((user) => {
      if (user.id === state.currentUserId) {
        return false;
      }

      const normalizedHandle = (user.username || '').replace(/^@/, '').toLowerCase();

      return (
        user.displayName.toLowerCase().includes(normalized) ||
        normalizedHandle.includes(normalized) ||
        user.username.toLowerCase().includes(normalized) ||
        user.bio.toLowerCase().includes(normalized)
      );
    });

    let remoteUserResults = [];
    try {
      const remoteUsers = await authService.searchUsers(normalized);
      remoteUserResults = remoteUsers.map((user) => {
        const existingUser = get().knownUsers.find(
          (entry) => entry.id === user.id || entry.email === user.email
        );
        return normalizeUser(user, existingUser);
      });
    } catch {
      remoteUserResults = [];
    }

    const mergedUserResults = mergeUniqueUsers(localUserResults, remoteUserResults);
    const nextKnownUsers = mergeUsers(get().knownUsers, remoteUserResults);

    const nextState = {
      knownUsers: nextKnownUsers,
      searchResults: { users: mergedUserResults, tweets: tweetResults },
    };

    set(nextState);
    persistLocalState({ ...get(), ...nextState });
  },
}));
