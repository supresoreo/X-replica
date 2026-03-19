import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';
import { normalizeApiError, setApiAuthToken } from '../services/apiClient';

const AUTH_TOKEN_KEY = '@xclone_auth_token';
const LOCAL_STATE_KEY = '@xclone_local_state';
const ACCOUNT_STATE_KEY_PREFIX = '@xclone_account_state_';
const DEFAULT_DISPLAY_MODE = 'system';
const DEFAULT_FONT_SCALE_LEVEL = 1;

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
  const hasFollowerIds = Array.isArray(user.followerIds) || Array.isArray(existingUser?.followerIds);
  const hasFollowingIds = Array.isArray(user.followingIds) || Array.isArray(existingUser?.followingIds);

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
    followers: hasFollowerIds
      ? followerIds.length
      : toNumber(user.followers ?? existingUser?.followers),
    following: hasFollowingIds
      ? followingIds.length
      : toNumber(user.following ?? existingUser?.following),
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

const reconcileKnownUsers = (users = []) => {
  const usersById = new Map();

  users.forEach((user) => {
    const normalized = normalizeUser(user);
    if (!normalized?.id) {
      return;
    }

    usersById.set(normalized.id, {
      ...normalized,
      followerIds: uniqueStrings(normalized.followerIds),
      followingIds: uniqueStrings(normalized.followingIds),
    });
  });

  const knownIds = new Set(usersById.keys());

  usersById.forEach((user) => {
    user.followerIds = user.followerIds.filter((id) => knownIds.has(id));
    user.followingIds = user.followingIds.filter((id) => knownIds.has(id));
  });

  usersById.forEach((user) => {
    user.followingIds.forEach((targetId) => {
      const target = usersById.get(targetId);
      if (!target) {
        return;
      }

      target.followerIds = uniqueStrings([...target.followerIds, user.id]);
    });

    user.followerIds.forEach((followerId) => {
      const follower = usersById.get(followerId);
      if (!follower) {
        return;
      }

      follower.followingIds = uniqueStrings([...follower.followingIds, user.id]);
    });
  });

  return Array.from(usersById.values()).map((user) => ({
    ...user,
    followers: user.followerIds.length,
    following: user.followingIds.length,
  }));
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
    displayMode: state.displayMode,
    fontScaleLevel: state.fontScaleLevel,
  });
};

const buildAccountState = (state) => {
  return JSON.stringify({
    authoredTweets: state.authoredTweets,
    tweets: state.tweets,
    bookmarks: state.bookmarks,
    conversations: state.conversations,
    messages: state.messages,
    notifications: state.notifications,
    mutedNotifications: state.mutedNotifications,
    unreadMessages: state.unreadMessages,
    searchQuery: state.searchQuery,
    searchResults: state.searchResults,
    searchHistory: state.searchHistory,
  });
};

const defaultAccountState = () => ({
  authoredTweets: [],
  tweets: [],
  bookmarks: [],
  conversations: [],
  messages: {},
  notifications: [],
  mutedNotifications: [],
  unreadMessages: {},
  searchQuery: '',
  searchResults: { users: [], tweets: [] },
  searchState: 'idle',
  searchError: '',
  searchHistory: [],
});

const getAccountStateKey = (userId) => `${ACCOUNT_STATE_KEY_PREFIX}${userId}`;

const persistLocalState = async (state) => {
  await AsyncStorage.setItem(LOCAL_STATE_KEY, buildPersistedState(state));
};

const persistAccountState = async (userId, state) => {
  if (!userId) {
    return;
  }

  await AsyncStorage.setItem(getAccountStateKey(userId), buildAccountState(state));
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

const loadAccountState = async (userId) => {
  if (!userId) {
    return defaultAccountState();
  }

  const rawState = await AsyncStorage.getItem(getAccountStateKey(userId));

  if (!rawState) {
    return defaultAccountState();
  }

  try {
    const parsed = JSON.parse(rawState);
    return {
      ...defaultAccountState(),
      ...parsed,
      searchResults: parsed?.searchResults || { users: [], tweets: [] },
      searchHistory: parsed?.searchHistory || [],
    };
  } catch {
    return defaultAccountState();
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

const sortNotifications = (notifications = []) => {
  return [...notifications].sort((a, b) => Date.parse(b.createdAt || '') - Date.parse(a.createdAt || ''));
};

const createNotification = ({ type, actor, targetUserId, tweet = null, message = '' }) => {
  return {
    id: `${targetUserId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    actorId: actor?.id || '',
    actorDisplayName: actor?.displayName || 'User',
    actorUsername: actor?.username || '@user',
    actorAvatar: actor?.avatar || 'U',
    actorAvatarImage: actor?.avatarImage || '',
    actorAverageColor: actor?.averageColor || '#000000',
    targetUserId,
    tweetId: tweet?.id || null,
    tweetPreview: tweet?.content ? tweet.content.slice(0, 120) : '',
    message,
    read: false,
    createdAt: new Date().toISOString(),
  };
};

const appendNotificationForUser = async (targetUserId, notification) => {
  if (!targetUserId || !notification) {
    return;
  }

  const targetState = await loadAccountState(targetUserId);
  const nextNotifications = sortNotifications([notification, ...(targetState.notifications || [])]);

  await persistAccountState(targetUserId, {
    ...defaultAccountState(),
    ...targetState,
    notifications: nextNotifications,
  });
};

const getIsoTimestamp = (value) => {
  if (typeof value === 'string' && !Number.isNaN(Date.parse(value))) {
    return new Date(value).toISOString();
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return new Date(value).toISOString();
  }

  return null;
};

const formatTweetTime = (createdAt) => {
  const parsed = Date.parse(createdAt || '');
  if (Number.isNaN(parsed)) {
    return 'Now';
  }

  const diffMs = Date.now() - parsed;
  const clampedDiffMs = diffMs < 0 ? 0 : diffMs;
  const diffMinutes = Math.floor(clampedDiffMs / 60000);

  if (diffMinutes < 1) {
    return 'Now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}d`;
  }

  return new Date(parsed).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};

const normalizeTweet = (tweet, author = null) => {
  if (!tweet) {
    return null;
  }

  const fromId = getIsoTimestamp(Number(tweet.id));
  const createdAt =
    getIsoTimestamp(tweet.createdAt) ||
    getIsoTimestamp(tweet.timestamp) ||
    fromId ||
    new Date().toISOString();

  return {
    ...tweet,
    id: tweet.id || `${author?.id || 'tweet'}-${Date.now()}`,
    userId: tweet.userId || author?.id || '',
    username: tweet.username || author?.username || '@user',
    displayName: tweet.displayName || author?.displayName || 'User',
    avatar: tweet.avatar || author?.avatar || 'U',
    avatarImage: tweet.avatarImage || author?.avatarImage || '',
    averageColor: tweet.averageColor || author?.averageColor || '#000000',
    createdAt,
    timestamp: formatTweetTime(createdAt),
    likes: toNumber(tweet.likes),
    retweets: toNumber(tweet.retweets),
    replies: toNumber(tweet.replies),
    isLiked: Boolean(tweet.isLiked),
    isRetweeted: Boolean(tweet.isRetweeted),
    isBookmarked: Boolean(tweet.isBookmarked),
  };
};

const dedupeAndSortTweets = (tweets) => {
  const tweetsById = new Map();

  tweets.forEach((tweet) => {
    const normalized = normalizeTweet(tweet);
    if (!normalized?.id) {
      return;
    }

    const existing = tweetsById.get(normalized.id);
    if (!existing) {
      tweetsById.set(normalized.id, normalized);
      return;
    }

    const existingTime = Date.parse(existing.createdAt || '');
    const nextTime = Date.parse(normalized.createdAt || '');
    if (Number.isNaN(existingTime) || nextTime >= existingTime) {
      tweetsById.set(normalized.id, { ...existing, ...normalized });
    }
  });

  return Array.from(tweetsById.values()).sort((a, b) => {
    return Date.parse(b.createdAt || '') - Date.parse(a.createdAt || '');
  });
};

const getAuthoredTweets = (accountState, userId, knownUsers) => {
  const author = resolveCurrentUser(knownUsers, userId);
  const sourceTweets = Array.isArray(accountState?.authoredTweets)
    ? accountState.authoredTweets
    : (accountState?.tweets || []).filter((tweet) => tweet.userId === userId);

  return dedupeAndSortTweets(sourceTweets.map((tweet) => normalizeTweet(tweet, author)));
};

const loadComposedAccountState = async (userId, knownUsers) => {
  const baseAccountState = await loadAccountState(userId);
  const currentUser = resolveCurrentUser(knownUsers, userId);
  const authoredTweets = getAuthoredTweets(baseAccountState, userId, knownUsers);
  const followingIds = uniqueStrings(currentUser?.followingIds || []);

  const followingAccountStates = await Promise.all(
    followingIds.map((followedUserId) => loadAccountState(followedUserId))
  );

  const followingTweets = followingAccountStates.flatMap((accountState, index) => {
    const followedUserId = followingIds[index];
    return getAuthoredTweets(accountState, followedUserId, knownUsers);
  });

  return {
    ...baseAccountState,
    authoredTweets,
    tweets: dedupeAndSortTweets([...authoredTweets, ...followingTweets]),
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
  displayMode: DEFAULT_DISPLAY_MODE,
  fontScaleLevel: DEFAULT_FONT_SCALE_LEVEL,

  authoredTweets: [],
  tweets: [],
  bookmarks: [],
  conversations: [],
  messages: {},
  notifications: [],
  mutedNotifications: [],
  unreadMessages: {},
  searchQuery: '',
  searchResults: {
    users: [],
    tweets: [],
  },
  searchHistory: [],
  searchState: 'idle',
  searchError: '',

  getUnreadNotificationCount: () => {
    return (get().notifications || []).filter((entry) => !entry.read).length;
  },

  markNotificationsAsRead: async () => {
    const state = get();
    if (!state.currentUserId || !state.notifications.some((entry) => !entry.read)) {
      return;
    }

    const nextState = {
      notifications: state.notifications.map((entry) => ({ ...entry, read: true })),
    };

    set(nextState);
    const mergedState = { ...get(), ...nextState };
    await persistLocalState(mergedState);
    await persistAccountState(mergedState.currentUserId, mergedState);
  },

  getUnreadMessageCount: () => {
    const unreadMessages = get().unreadMessages || {};
    return Object.values(unreadMessages).reduce((total, count) => total + (count || 0), 0);
  },

  markMessagesAsRead: async (conversationId) => {
    const state = get();
    if (!conversationId || !state.unreadMessages[conversationId]) {
      return;
    }

    const nextUnreadMessages = { ...state.unreadMessages };
    delete nextUnreadMessages[conversationId];

    const nextState = {
      unreadMessages: nextUnreadMessages,
    };

    set(nextState);
    const mergedState = { ...get(), ...nextState };
    await persistLocalState(mergedState);
    if (state.currentUserId) {
      await persistAccountState(state.currentUserId, mergedState);
    }
  },

  markAllMessagesAsRead: async () => {
    const state = get();
    if (!state.currentUserId || !Object.keys(state.unreadMessages || {}).length) {
      return;
    }

    const nextState = {
      unreadMessages: {},
    };

    set(nextState);
    const mergedState = { ...get(), ...nextState };
    await persistLocalState(mergedState);
    await persistAccountState(mergedState.currentUserId, mergedState);
  },

  isNotificationMutedForUser: (userId) => {
    return get().mutedNotifications.includes(userId);
  },

  muteNotificationsForUser: async (userId) => {
    const state = get();
    if (!userId || state.mutedNotifications.includes(userId)) {
      return;
    }

    const nextMutedNotifications = [...state.mutedNotifications, userId];
    set({ mutedNotifications: nextMutedNotifications });

    const mergedState = { ...get() };
    await persistLocalState(mergedState);
    if (state.currentUserId) {
      await persistAccountState(state.currentUserId, mergedState);
    }
  },

  unmuteNotificationsForUser: async (userId) => {
    const state = get();
    if (!userId || !state.mutedNotifications.includes(userId)) {
      return;
    }

    const nextMutedNotifications = state.mutedNotifications.filter((id) => id !== userId);
    set({ mutedNotifications: nextMutedNotifications });

    const mergedState = { ...get() };
    await persistLocalState(mergedState);
    if (state.currentUserId) {
      await persistAccountState(state.currentUserId, mergedState);
    }
  },

  hydrateAuth: async () => {
    try {
      const [persistedToken, persistedState] = await Promise.all([
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        loadPersistedState(),
      ]);

      const knownUsers = reconcileKnownUsers(
        mergeUsers(SEED_USERS, persistedState?.knownUsers || [])
      );
      const deviceAccounts = persistedState?.deviceAccounts || [];
      const currentUserId = persistedState?.currentUserId || deviceAccounts[0]?.userId || null;
      const fallbackUser = resolveCurrentUser(knownUsers, currentUserId);
      const currentAccount = deviceAccounts.find((account) => account.userId === currentUserId);
      const authToken = persistedToken || currentAccount?.token || null;

      if (!authToken || !fallbackUser) {
        const accountState = await loadComposedAccountState(currentUserId, knownUsers);
        set({
          knownUsers,
          deviceAccounts,
          currentUserId,
          currentUser: fallbackUser,
          displayMode: persistedState?.displayMode || DEFAULT_DISPLAY_MODE,
          fontScaleLevel:
            typeof persistedState?.fontScaleLevel === 'number'
              ? Math.max(0, Math.min(3, persistedState.fontScaleLevel))
              : DEFAULT_FONT_SCALE_LEVEL,
          authoredTweets: accountState.authoredTweets,
          tweets: accountState.tweets,
          bookmarks: accountState.bookmarks,
          conversations: accountState.conversations,
          messages: accountState.messages,
          notifications: accountState.notifications,
          mutedNotifications: accountState.mutedNotifications,
          unreadMessages: accountState.unreadMessages,
          searchQuery: accountState.searchQuery,
          searchResults: accountState.searchResults,
          searchHistory: accountState.searchHistory,
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
        knownUsers: reconcileKnownUsers(nextKnownUsers),
        deviceAccounts,
        displayMode: persistedState?.displayMode || DEFAULT_DISPLAY_MODE,
        fontScaleLevel:
          typeof persistedState?.fontScaleLevel === 'number'
            ? Math.max(0, Math.min(3, persistedState.fontScaleLevel))
            : DEFAULT_FONT_SCALE_LEVEL,
        isAuthenticated: true,
        authError: '',
        ...(await loadComposedAccountState(nextCurrentUser.id, reconcileKnownUsers(nextKnownUsers))),
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

  refreshAppData: async () => {
    const state = get();
    if (!state.currentUserId) {
      return { ok: false };
    }

    let nextKnownUsers = state.knownUsers;

    if (state.isAuthenticated && state.authToken) {
      setApiAuthToken(state.authToken);

      try {
        const meResponse = await authService.me();
        const remoteUser = normalizeUser(meResponse?.user || meResponse);
        nextKnownUsers = reconcileKnownUsers(upsertUser(state.knownUsers, remoteUser));
      } catch {
        nextKnownUsers = reconcileKnownUsers(state.knownUsers);
      }
    } else {
      nextKnownUsers = reconcileKnownUsers(state.knownUsers);
    }

    const nextCurrentUser = resolveCurrentUser(nextKnownUsers, state.currentUserId);
    const accountState = await loadComposedAccountState(state.currentUserId, nextKnownUsers);

    const nextState = {
      knownUsers: nextKnownUsers,
      currentUser: nextCurrentUser,
      authoredTweets: accountState.authoredTweets,
      tweets: accountState.tweets,
      bookmarks: accountState.bookmarks,
      conversations: accountState.conversations,
      messages: accountState.messages,
      notifications: accountState.notifications,
      mutedNotifications: accountState.mutedNotifications,
      unreadMessages: accountState.unreadMessages,
      searchQuery: accountState.searchQuery,
      searchResults: accountState.searchResults,
      searchHistory: accountState.searchHistory,
    };

    set(nextState);

    const mergedState = { ...get(), ...nextState };
    await persistLocalState(mergedState);
    await persistAccountState(mergedState.currentUserId, mergedState);

    if (mergedState.searchQuery?.trim()) {
      await get().setSearchQuery(mergedState.searchQuery);
    }

    return { ok: true };
  },

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

      const nextKnownUsers = reconcileKnownUsers(upsertUser(get().knownUsers, mappedUser));
      const nextDeviceAccounts = upsertDeviceAccount(get().deviceAccounts, {
        userId: mappedUser.id,
        email: mappedUser.email,
        token,
      });
      const accountState = await loadComposedAccountState(mappedUser.id, nextKnownUsers);

      const nextState = {
        authLoading: false,
        authToken: token,
        currentUserId: mappedUser.id,
        currentUser: mappedUser,
        knownUsers: nextKnownUsers,
        deviceAccounts: nextDeviceAccounts,
        isAuthenticated: true,
        authError: '',
        authoredTweets: accountState.authoredTweets,
        tweets: accountState.tweets,
        bookmarks: accountState.bookmarks,
        conversations: accountState.conversations,
        messages: accountState.messages,
        notifications: accountState.notifications,
        mutedNotifications: accountState.mutedNotifications,
        unreadMessages: accountState.unreadMessages,
        searchQuery: accountState.searchQuery,
        searchResults: accountState.searchResults,
        searchHistory: accountState.searchHistory,
      };

      set(nextState);
      await persistLocalState({ ...get(), ...nextState });
      await persistAccountState(mappedUser.id, { ...get(), ...nextState });

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

      const nextKnownUsers = reconcileKnownUsers(upsertUser(get().knownUsers, mappedUser));
      const nextDeviceAccounts = upsertDeviceAccount(get().deviceAccounts, {
        userId: mappedUser.id,
        email: mappedUser.email,
        token,
      });
      const accountState = await loadComposedAccountState(mappedUser.id, nextKnownUsers);

      const nextState = {
        authLoading: false,
        authToken: token,
        currentUserId: mappedUser.id,
        currentUser: mappedUser,
        knownUsers: nextKnownUsers,
        deviceAccounts: nextDeviceAccounts,
        isAuthenticated: true,
        authError: '',
        authoredTweets: accountState.authoredTweets,
        tweets: accountState.tweets,
        bookmarks: accountState.bookmarks,
        conversations: accountState.conversations,
        messages: accountState.messages,
        notifications: accountState.notifications,
        mutedNotifications: accountState.mutedNotifications,
        unreadMessages: accountState.unreadMessages,
        searchQuery: accountState.searchQuery,
        searchResults: accountState.searchResults,
        searchHistory: accountState.searchHistory,
      };

      set(nextState);
      await persistLocalState({ ...get(), ...nextState });
      await persistAccountState(mappedUser.id, { ...get(), ...nextState });

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
    const accountState = await loadComposedAccountState(targetUser.id, state.knownUsers);

    const nextDeviceAccounts = upsertDeviceAccount(state.deviceAccounts, targetAccount);
    const nextState = {
      authToken: targetAccount.token,
      currentUserId: targetUser.id,
      currentUser: targetUser,
      deviceAccounts: nextDeviceAccounts,
      isAuthenticated: true,
      authError: '',
      authoredTweets: accountState.authoredTweets,
      tweets: accountState.tweets,
      bookmarks: accountState.bookmarks,
      conversations: accountState.conversations,
      messages: accountState.messages,
      notifications: accountState.notifications,
      mutedNotifications: accountState.mutedNotifications,
      unreadMessages: accountState.unreadMessages,
      searchQuery: accountState.searchQuery,
      searchResults: accountState.searchResults,
      searchHistory: accountState.searchHistory,
    };

    set(nextState);
    await persistLocalState({ ...get(), ...nextState });
    await persistAccountState(targetUser.id, { ...get(), ...nextState });

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
      authoredTweets: [],
      tweets: [],
      notifications: [],
      mutedNotifications: [],
      searchQuery: '',
      searchHistory: [],
  searchState: 'idle',
  searchError: '',
      searchResults: {
        users: [],
        tweets: [],
      },
    });
  },

  addSearchHistoryEntry: async (query) => {
    const state = get();
    const normalized = query.trim();
    if (!normalized) {
      return;
    }

    const deduped = [
      normalized,
      ...(state.searchHistory || []).filter(
        (entry) => entry.toLowerCase() !== normalized.toLowerCase()
      ),
    ].slice(0, 20);

    const nextState = { searchHistory: deduped };
    set(nextState);
    const mergedState = { ...get(), ...nextState };
    await persistLocalState(mergedState);
    if (mergedState.currentUserId) {
      await persistAccountState(mergedState.currentUserId, mergedState);
    }
  },

  clearSearchHistory: async () => {
    const state = get();
    if (!(state.searchHistory || []).length) {
      return;
    }

    const nextState = { searchHistory: [] };
    set(nextState);
    const mergedState = { ...get(), ...nextState };
    await persistLocalState(mergedState);
    if (mergedState.currentUserId) {
      await persistAccountState(mergedState.currentUserId, mergedState);
    }
  },

  setDisplayMode: async (mode) => {
    const allowedModes = ['system', 'day', 'night'];
    const nextMode = allowedModes.includes(mode) ? mode : DEFAULT_DISPLAY_MODE;

    set({ displayMode: nextMode });
    const mergedState = { ...get(), displayMode: nextMode };
    await persistLocalState(mergedState);
  },

  setFontScaleLevel: async (level) => {
    const nextLevel = Math.max(0, Math.min(3, Number.isFinite(level) ? level : DEFAULT_FONT_SCALE_LEVEL));

    set({ fontScaleLevel: nextLevel });
    const mergedState = { ...get(), fontScaleLevel: nextLevel };
    await persistLocalState(mergedState);
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
      id: `${updatedAuthor.id}-${Date.now()}`,
      userId: updatedAuthor.id,
      username: updatedAuthor.username,
      displayName: updatedAuthor.displayName,
      avatar: updatedAuthor.avatar,
      avatarImage: updatedAuthor.avatarImage,
      averageColor: updatedAuthor.averageColor,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      retweets: 0,
      replies: 0,
      isLiked: false,
      isRetweeted: false,
      isBookmarked: false,
    };

    const normalizedTweet = normalizeTweet(newTweet, updatedAuthor);
    const nextAuthoredTweets = dedupeAndSortTweets([normalizedTweet, ...(state.authoredTweets || [])]);
    const nextTimelineTweets = dedupeAndSortTweets([normalizedTweet, ...state.tweets]);

    const nextKnownUsers = reconcileKnownUsers(upsertUser(state.knownUsers, updatedAuthor));
    const nextState = {
      authoredTweets: nextAuthoredTweets,
      tweets: nextTimelineTweets,
      knownUsers: nextKnownUsers,
      currentUser: updatedAuthor,
    };

    set(nextState);
    const mergedState = { ...get(), ...nextState };
    persistLocalState(mergedState);
    persistAccountState(mergedState.currentUserId, mergedState);
  },

  replyTweet: (id) => {
    const state = get();
    const actor = state.currentUser;
    if (!actor) {
      return;
    }

    const targetTweet = state.tweets.find((tweet) => tweet.id === id);
    if (!targetTweet) {
      return;
    }

    const nextState = {
      tweets: state.tweets.map((tweet) =>
        tweet.id === id
          ? {
              ...tweet,
              replies: (tweet.replies || 0) + 1,
            }
          : tweet
      ),
    };

    set(nextState);
    const mergedState = { ...get(), ...nextState };
    persistLocalState(mergedState);
    persistAccountState(mergedState.currentUserId, mergedState);

    if (targetTweet.userId && targetTweet.userId !== actor.id) {
      appendNotificationForUser(
        targetTweet.userId,
        createNotification({ type: 'reply', actor, targetUserId: targetTweet.userId, tweet: targetTweet })
      );
    }
  },

  likeTweet: (id) => {
    const state = get();
    const actor = state.currentUser;
    if (!actor) {
      return;
    }

    const targetTweet = state.tweets.find((tweet) => tweet.id === id);
    if (!targetTweet) {
      return;
    }

    const willLike = !targetTweet.isLiked;
    const nextState = {
      tweets: state.tweets.map((tweet) =>
        tweet.id === id
          ? {
              ...tweet,
              isLiked: !tweet.isLiked,
              likes: tweet.isLiked ? tweet.likes - 1 : tweet.likes + 1,
            }
          : tweet
      ),
    };

    set(nextState);
    const mergedState = { ...get(), ...nextState };
    persistLocalState(mergedState);
    persistAccountState(mergedState.currentUserId, mergedState);

    if (willLike && targetTweet.userId && targetTweet.userId !== actor.id) {
      appendNotificationForUser(
        targetTweet.userId,
        createNotification({ type: 'like', actor, targetUserId: targetTweet.userId, tweet: targetTweet })
      );
    }
  },

  retweetTweet: (id) => {
    const state = get();
    const actor = state.currentUser;
    if (!actor) {
      return;
    }

    const targetTweet = state.tweets.find((tweet) => tweet.id === id);
    if (!targetTweet) {
      return;
    }

    const willRepost = !targetTweet.isRetweeted;
    const nextState = {
      tweets: state.tweets.map((tweet) =>
        tweet.id === id
          ? {
              ...tweet,
              isRetweeted: !tweet.isRetweeted,
              retweets: tweet.isRetweeted ? tweet.retweets - 1 : tweet.retweets + 1,
            }
          : tweet
      ),
    };

    set(nextState);
    const mergedState = { ...get(), ...nextState };
    persistLocalState(mergedState);
    persistAccountState(mergedState.currentUserId, mergedState);

    if (willRepost && targetTweet.userId && targetTweet.userId !== actor.id) {
      appendNotificationForUser(
        targetTweet.userId,
        createNotification({ type: 'repost', actor, targetUserId: targetTweet.userId, tweet: targetTweet })
      );
    }
  },

  bookmarkTweet: (id) => {
    const state = get();
    const actor = state.currentUser;
    if (!actor) {
      return;
    }

    const targetTweet = state.tweets.find((tweet) => tweet.id === id);
    if (!targetTweet) {
      return;
    }

    const willBookmark = !targetTweet.isBookmarked;
    const nextState = {
      tweets: state.tweets.map((tweet) =>
        tweet.id === id ? { ...tweet, isBookmarked: !tweet.isBookmarked } : tweet
      ),
    };

    set(nextState);
    const mergedState = { ...get(), ...nextState };
    persistLocalState(mergedState);
    persistAccountState(mergedState.currentUserId, mergedState);

    if (willBookmark && targetTweet.userId && targetTweet.userId !== actor.id) {
      appendNotificationForUser(
        targetTweet.userId,
        createNotification({ type: 'bookmark', actor, targetUserId: targetTweet.userId, tweet: targetTweet })
      );
    }
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

    const nextKnownUsers = reconcileKnownUsers(upsertUser(state.knownUsers, updatedCurrentUser));
    const nextTweets = state.tweets.map((tweet) => {
      if (tweet.userId === state.currentUser.id || tweet.username === state.currentUser.username) {
        return updateTweetAuthor(tweet, updatedCurrentUser);
      }

      return tweet;
    });

    const nextAuthoredTweets = (state.authoredTweets || []).map((tweet) =>
      tweet.userId === state.currentUser.id || tweet.username === state.currentUser.username
        ? updateTweetAuthor(tweet, updatedCurrentUser)
        : tweet
    );

    const nextState = {
      currentUser: updatedCurrentUser,
      knownUsers: nextKnownUsers,
      authoredTweets: nextAuthoredTweets,
      tweets: nextTweets,
    };

    set(nextState);
    const mergedState = { ...get(), ...nextState };
    persistLocalState(mergedState);
    persistAccountState(mergedState.currentUserId, mergedState);
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

  followUser: async (targetUserId) => {
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

    const nextKnownUsers = reconcileKnownUsers(
      updateUsers(state.knownUsers, [updatedCurrentUser, updatedTargetUser])
    );
    const nextState = {
      knownUsers: nextKnownUsers,
      currentUser: updatedCurrentUser,
    };

    set(nextState);
    const composedAccountState = await loadComposedAccountState(updatedCurrentUser.id, nextKnownUsers);
    set({ authoredTweets: composedAccountState.authoredTweets, tweets: composedAccountState.tweets });
    const mergedState = {
      ...get(),
      ...nextState,
      authoredTweets: composedAccountState.authoredTweets,
      tweets: composedAccountState.tweets,
    };
    persistLocalState(mergedState);
    persistAccountState(mergedState.currentUserId, mergedState);

    appendNotificationForUser(
      targetUserId,
      createNotification({
        type: 'follow',
        actor: updatedCurrentUser,
        targetUserId,
        message: `${updatedCurrentUser.displayName} followed you`,
      })
    );
  },

  unfollowUser: async (targetUserId) => {
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

    const nextKnownUsers = reconcileKnownUsers(
      updateUsers(state.knownUsers, [updatedCurrentUser, updatedTargetUser])
    );
    const nextState = {
      knownUsers: nextKnownUsers,
      currentUser: updatedCurrentUser,
    };

    set(nextState);
    const composedAccountState = await loadComposedAccountState(updatedCurrentUser.id, nextKnownUsers);
    set({ authoredTweets: composedAccountState.authoredTweets, tweets: composedAccountState.tweets });
    const mergedState = {
      ...get(),
      ...nextState,
      authoredTweets: composedAccountState.authoredTweets,
      tweets: composedAccountState.tweets,
    };
    persistLocalState(mergedState);
    persistAccountState(mergedState.currentUserId, mergedState);
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
    const mergedState = { ...get(), ...nextState };
    persistLocalState(mergedState);
    persistAccountState(mergedState.currentUserId, mergedState);
    
    // Notify the recipient about the new message
    get().recordUnreadMessage(conversationId, state.currentUser.id);
  },

  recordUnreadMessage: async (conversationId, senderId) => {
    const state = get();
    const senderUser = state.knownUsers.find((u) => u.id === senderId);
    
    if (!senderUser || !conversationId) {
      return;
    }

    // Get the recipient's account state (conversationId is typically the recipientId)
    const recipientState = await loadAccountState(conversationId);
    const currentUnreadCount = recipientState.unreadMessages?.[senderId] || 0;
    
    const nextUnreadMessages = {
      ...recipientState.unreadMessages,
      [senderId]: currentUnreadCount + 1,
    };

    const updatedRecipientState = {
      ...recipientState,
      unreadMessages: nextUnreadMessages,
    };

    await persistAccountState(conversationId, updatedRecipientState);
  },

  getOrCreateConversation: (userId) => {
    const state = get();
    const knownUser = state.knownUsers.find((u) => u.id === userId);
    if (!knownUser) {
      return null;
    }

    const existingConversation = state.conversations.find(
      (conv) => conv.id === userId || conv.userId === userId
    );

    if (existingConversation) {
      return existingConversation;
    }

    // Create new conversation
    const newConversation = {
      id: userId,
      userId,
      displayName: knownUser.displayName,
      lastMessage: 'No messages yet',
      timestamp: 'Now',
      unread: false,
    };

    const nextConversations = [newConversation, ...state.conversations];
    set({ conversations: nextConversations });
    const mergedState = { ...get() };
    persistAccountState(state.currentUserId, mergedState);

    return newConversation;
  },

  setSearchQuery: async (query) => {
    const state = get();
    const normalized = query.trim().toLowerCase();

    set({ searchQuery: query });

    if (!normalized) {
      set({ searchResults: { users: [], tweets: [] }, searchState: 'idle', searchError: '' });
      return;
    }

    // Start loading state
    set({ searchState: 'loading', searchError: '' });

    const localUserResults = state.knownUsers.filter((user) => {
      if (user.id === state.currentUserId) {
        return false;
      }

      const displayName = (user.displayName || '').toLowerCase();
      const normalizedHandle = (user.username || '').replace(/^@/, '').toLowerCase();
      const username = (user.username || '').toLowerCase();
      const bio = (user.bio || '').toLowerCase();

      return (
        displayName.includes(normalized) ||
        normalizedHandle.includes(normalized) ||
        username.includes(normalized) ||
        bio.includes(normalized)
      );
    });

    let remoteUserResults = [];
    let hasError = false;
    try {
      const remoteUsers = await authService.searchUsers(normalized);
      remoteUserResults = remoteUsers.map((user) => {
        const existingUser = get().knownUsers.find(
          (entry) => entry.id === user.id || entry.email === user.email
        );
        return normalizeUser(user, existingUser);
      });
    } catch (error) {
      remoteUserResults = [];
      hasError = true;
    }

    // Ignore stale async responses if user has typed a newer query.
    const latestNormalized = (get().searchQuery || '').trim().toLowerCase();
    if (latestNormalized !== normalized) {
      return;
    }

    const mergedUserResults = mergeUniqueUsers(localUserResults, remoteUserResults);
    const nextKnownUsers = reconcileKnownUsers(mergeUsers(get().knownUsers, remoteUserResults));
    // Prefer showing available matches even if remote lookup fails.
    let nextSearchState = 'success';
    let nextSearchError = '';

    if (mergedUserResults.length === 0) {
      nextSearchState = 'empty';
      nextSearchError = hasError ? 'Unable to reach server. Showing local results only.' : '';
    }

    const nextState = {
      knownUsers: nextKnownUsers,
      searchResults: { users: mergedUserResults, tweets: [] },
      searchState: nextSearchState,
      searchError: nextSearchError,
    };

    set(nextState);
    const mergedState = { ...get(), ...nextState };
    persistLocalState(mergedState);
    persistAccountState(mergedState.currentUserId, mergedState);
  },
}));
