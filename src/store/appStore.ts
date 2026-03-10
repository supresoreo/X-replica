import { create } from 'zustand';

export interface Tweet {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  retweets: number;
  replies: number;
  isLiked: boolean;
  isRetweeted: boolean;
  isBookmarked: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: string;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export interface User {
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  tweets: number;
  banner: string;
}

interface AppState {
  // User
  currentUser: User;
  
  // Tweets
  tweets: Tweet[];
  addTweet: (content: string) => void;
  likeTweet: (id: string) => void;
  retweetTweet: (id: string) => void;
  bookmarkTweet: (id: string) => void;
  
  // Bookmarks
  bookmarks: Tweet[];
  
  // Messages
  conversations: Conversation[];
  messages: { [conversationId: string]: Message[] };
  sendMessage: (conversationId: string, content: string) => void;
  
  // Search
  searchQuery: string;
  searchResults: Tweet[];
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initialize current user
  currentUser: {
    username: '@johnsmith',
    displayName: 'John Smith',
    avatar: '👤',
    bio: 'Software developer | React Native enthusiast | Coffee lover',
    followers: 1234,
    following: 567,
    tweets: 89,
    banner: '#cfd9de',
  },
  
  // Initialize with sample tweets
  tweets: [
    {
      id: '1',
      username: '@elonmusk',
      displayName: 'Elon Musk',
      avatar: '🚀',
      content: 'Just launched a new feature for X!',
      timestamp: '2h ago',
      likes: 12500,
      retweets: 3400,
      replies: 890,
      isLiked: false,
      isRetweeted: false,
      isBookmarked: false,
    },
    {
      id: '2',
      username: '@github',
      displayName: 'GitHub',
      avatar: '🐙',
      content: 'Introducing new AI-powered code review features. Check it out!',
      timestamp: '4h ago',
      likes: 8900,
      retweets: 2100,
      replies: 456,
      isLiked: true,
      isRetweeted: false,
      isBookmarked: true,
    },
    {
      id: '3',
      username: '@reactnative',
      displayName: 'React Native',
      avatar: '⚛️',
      content: 'React Native 0.84 is here with exciting new features and improvements!',
      timestamp: '6h ago',
      likes: 15600,
      retweets: 4500,
      replies: 789,
      isLiked: false,
      isRetweeted: true,
      isBookmarked: false,
    },
    {
      id: '4',
      username: '@openai',
      displayName: 'OpenAI',
      avatar: '🤖',
      content: 'We are constantly working to improve AI safety and capabilities.',
      timestamp: '8h ago',
      likes: 23400,
      retweets: 6700,
      replies: 1234,
      isLiked: true,
      isRetweeted: false,
      isBookmarked: true,
    },
  ],
  
  addTweet: (content: string) => {
    const state = get();
    const newTweet: Tweet = {
      id: Date.now().toString(),
      username: state.currentUser.username,
      displayName: state.currentUser.displayName,
      avatar: state.currentUser.avatar,
      content,
      timestamp: 'Just now',
      likes: 0,
      retweets: 0,
      replies: 0,
      isLiked: false,
      isRetweeted: false,
      isBookmarked: false,
    };
    
    set({ tweets: [newTweet, ...state.tweets] });
    set({ currentUser: { ...state.currentUser, tweets: state.currentUser.tweets + 1 } });
  },
  
  likeTweet: (id: string) => {
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
  
  retweetTweet: (id: string) => {
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
  
  bookmarkTweet: (id: string) => {
    set((state) => ({
      tweets: state.tweets.map((tweet) =>
        tweet.id === id ? { ...tweet, isBookmarked: !tweet.isBookmarked } : tweet
      ),
    }));
  },
  
  bookmarks: [],
  
  // Initialize conversations
  conversations: [
    {
      id: '1',
      username: '@sarahconnor',
      displayName: 'Sarah Connor',
      avatar: '👩',
      lastMessage: 'Hey! How are you doing?',
      timestamp: '2m ago',
      unread: true,
    },
    {
      id: '2',
      username: '@mikejohnson',
      displayName: 'Mike Johnson',
      avatar: '👨',
      lastMessage: 'Thanks for the help!',
      timestamp: '1h ago',
      unread: false,
    },
    {
      id: '3',
      username: '@teamlead',
      displayName: 'Team Lead',
      avatar: '👔',
      lastMessage: 'Meeting at 3 PM tomorrow',
      timestamp: '3h ago',
      unread: true,
    },
  ],
  
  messages: {
    '1': [
      {
        id: '1',
        conversationId: '1',
        sender: '@sarahconnor',
        content: 'Hey! How are you doing?',
        timestamp: '2m ago',
      },
    ],
    '2': [
      {
        id: '2',
        conversationId: '2',
        sender: '@mikejohnson',
        content: 'Thanks for the help!',
        timestamp: '1h ago',
      },
      {
        id: '3',
        conversationId: '2',
        sender: '@johnsmith',
        content: 'No problem!',
        timestamp: '50m ago',
      },
    ],
    '3': [
      {
        id: '4',
        conversationId: '3',
        sender: '@teamlead',
        content: 'Meeting at 3 PM tomorrow',
        timestamp: '3h ago',
      },
    ],
  },
  
  sendMessage: (conversationId: string, content: string) => {
    const state = get();
    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId,
      sender: state.currentUser.username,
      content,
      timestamp: 'Just now',
    };
    
    set({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), newMessage],
      },
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? { ...conv, lastMessage: content, timestamp: 'Just now', unread: false }
          : conv
      ),
    });
  },
  
  searchQuery: '',
  searchResults: [],
  
  setSearchQuery: (query: string) => {
    const state = get();
    set({ searchQuery: query });
    
    if (query.trim() === '') {
      set({ searchResults: [] });
    } else {
      const results = state.tweets.filter(
        (tweet) =>
          tweet.content.toLowerCase().includes(query.toLowerCase()) ||
          tweet.username.toLowerCase().includes(query.toLowerCase()) ||
          tweet.displayName.toLowerCase().includes(query.toLowerCase())
      );
      set({ searchResults: results });
    }
  },
}));
