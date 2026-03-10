/**
 * Twitter/X Clone App
 * A full-featured social media app with Zustand state management
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ForYouScreen } from './src/screens/ForYouScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { MessagesScreen } from './src/screens/MessagesScreen';
import { BookmarksScreen } from './src/screens/BookmarksScreen';
import { GrokScreen } from './src/screens/GrokScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { CreatePostModal } from './src/components/CreatePostModal';
import { TabBar } from './src/components/TabBar';

function App() {
  const [activeTab, setActiveTab] = useState('forYou');
  const [showCreatePost, setShowCreatePost] = useState(false);

  const renderScreen = () => {
    switch (activeTab) {
      case 'forYou':
        return <ForYouScreen onCreatePost={() => setShowCreatePost(true)} />;
      case 'search':
        return <SearchScreen />;
      case 'grok':
        return <GrokScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'messages':
        return <MessagesScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'bookmarks':
        return <BookmarksScreen />;
      default:
        return <ForYouScreen onCreatePost={() => setShowCreatePost(true)} />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        {renderScreen()}
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        <CreatePostModal
          visible={showCreatePost}
          onClose={() => setShowCreatePost(false)}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
