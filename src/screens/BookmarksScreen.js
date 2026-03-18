import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Bookmark } from 'lucide-react-native/icons';
import { useAppStore } from '../store/appStore';
import { Tweet } from '../components/Tweet';
import { AppHeader } from '../components/AppHeader';

export const BookmarksScreen = ({ onOpenDrawer }) => {
  const tweets = useAppStore((state) => state.tweets);
  const refreshAppData = useAppStore((state) => state.refreshAppData);
  const [refreshing, setRefreshing] = useState(false);
  const bookmarkedTweets = tweets.filter((t) => t.isBookmarked);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshAppData();
    } finally {
      setRefreshing(false);
    }
  }, [refreshAppData]);

  return (
    <View style={styles.container}>
      <AppHeader title="Bookmarks" onOpenDrawer={onOpenDrawer} />
      
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {bookmarkedTweets.length > 0 ? (
          bookmarkedTweets.map((tweet) => (
            <Tweet key={tweet.id} tweet={tweet} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Bookmark size={60} color="#536471" strokeWidth={1.5} />
            <Text style={styles.emptyStateTitle}>Save posts for later</Text>
            <Text style={styles.emptyStateText}>
              Bookmark posts to easily find them again
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 100,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f1419',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#536471',
    textAlign: 'center',
    maxWidth: 300,
  },
});
