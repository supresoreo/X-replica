# Twitter/X Clone App

A full-featured Twitter/X clone built with React Native, TypeScript, and Zustand for state management. This application replicates the core functionality and design of Twitter/X with a clean, simple codebase.

## Features

### ✅ Core Functionality

- **For You Feed** - Browse a timeline of posts with real-time interactions
- **Profile Page** - View user profile with stats, bio, and posts
- **Search** - Search for posts and users with live filtering
- **Direct Messages** - Full messaging functionality with conversations
- **Bookmarks** - Save and manage your favorite posts
- **Post/Tweet Creation** - Create new posts with character count limit (280)

### 🎨 Interactive Features

- ❤️ Like/Unlike posts
- 🔁 Retweet posts
- 🔖 Bookmark posts
- 💬 Reply count display
- 📊 Analytics view count
- 🔗 Share posts
- ✉️ Send direct messages
- 📊 User statistics (followers, following, posts)

## Technology Stack

- **React Native** - Cross-platform mobile framework
- **TypeScript** - Type-safe JavaScript
- **Zustand** - Simple, fast state management
- **Lucide React Native** - Beautiful, consistent icon set
- **React Native Safe Area Context** - Handle device safe areas

## Project Structure

```
midtermExam/
├── App.tsx                           # Main app component with navigation
├── src/
│   ├── store/
│   │   └── appStore.ts              # Zustand store (global state)
│   ├── components/
│   │   ├── Tweet.tsx                # Reusable tweet component
│   │   ├── CreatePostModal.tsx      # Post creation modal
│   │   └── TabBar.tsx               # Bottom tab navigation
│   └── screens/
│       ├── ForYouScreen.tsx         # Main feed/timeline
│       ├── ProfileScreen.tsx        # User profile
│       ├── SearchScreen.tsx         # Search functionality
│       ├── MessagesScreen.tsx       # Direct messages
│       └── BookmarksScreen.tsx      # Saved posts
└── package.json
```

## State Management (Zustand)

The app uses Zustand for simple, centralized state management:

```typescript
// Global state includes:
- currentUser: User profile information
- tweets: Array of all posts
- bookmarks: Saved posts
- conversations: DM conversations
- messages: Message history
- searchQuery & searchResults: Search state
```

### Key Store Actions:
- `addTweet(content)` - Create new post
- `likeTweet(id)` - Toggle like on post
- `retweetTweet(id)` - Toggle retweet
- `bookmarkTweet(id)` - Toggle bookmark
- `sendMessage(conversationId, content)` - Send DM
- `setSearchQuery(query)` - Search posts

## Getting Started

### Prerequisites
- Node.js >= 22.11.0
- React Native development environment setup

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start Metro bundler:
```bash
npm start
```

3. Run on Android:
```bash
npm run android
```

4. Run on iOS:
```bash
npm run ios
```

## Usage Guide

### Navigation
- Use the bottom tab bar to switch between screens:
  - 🏠 Home (For You feed)
  - ✨ Grok (AI assistant)
  - 🔔 Notifications
  - ✉️ Messagesks
  - 👤 Profile

### Creating Posts
1. Tap the blue feather ✒️ floating button on the home screen
2. Type your message (max 280 characters)
3. Tap "Post" to publish

### Interacting with Posts
- Tap heart icon to like (turns pink)
- Tap retweet icon to retweet (turns green)
- Tap bookmark icon to save for later
- Tap analytics icon to view engagement
- Tap share icon to share post
- Reply count shown with chat bubble icon

### Direct Messages
1. Go to Messages tab
2. Tap on a conversation
3. Type and send messages
4. Tap ← to return to conversations list

### Search
1. Go to Search tab
2. Type in the search box
3. Results filter in real-time by content, username, or display name

## Design Philosophy

This app follows a **minimalist black and white** approach, inspired by X's modern design:
- ✅ Minimal dependencies (only essential libraries)
- ✅ Basic but functional UI components
- ✅ Professional Lucide icons for clean, consistent UI
- ✅ Easy to understand and modify
- ✅ Simple unicode icons for minimalist look
- ✅ Clean monochrome design with subtle accents

## Color Scheme

- **Primary Black**: #000 (Buttons and accents)
- **Text Dark**: #0f1419 (Primary text)
- **Text Gray**: #536471 (Secondary text)
- **Border/Background**: #eff3f4 (Subtle borders)
- **Background**: #fff (Main background)
- **Like Pink**: #f91880 (Like action)
- **Retweet Green**: #00ba7c (Retweet action)

## Sample Data

The app comes with pre-populated sample data:
- 4 sample tweets from @elonmusk, @github, @reactnative, @openai
- 3 sample DM conversations
- 1 user profile (@johnsmith)

## Future Enhancements

Potential features to add:
- Image/video uploads
- Comments/replies thread
- User authentication
- Follow/unfollow users
- Notifications
- Dark mode theme
- Pull-to-refresh
- Infinite scroll pagination

## License

This is an educational project for learning purposes.

---

Built with ❤️ using React Native and Zustand

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
