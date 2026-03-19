import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, useColorScheme } from 'react-native';
import { Bookmark } from 'lucide-react-native/icons';
import { useAppStore } from '../store/appStore';
import { Tweet } from '../components/Tweet';
import { AppHeader } from '../components/AppHeader';

export const BookmarksScreen = ({ onOpenDrawer }) => {
  const tweets = useAppStore((state) => state.tweets);
  const refreshAppData = useAppStore((state) => state.refreshAppData);
  const displayMode = useAppStore((state) => state.displayMode);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const systemScheme = useColorScheme();
  const isDark = displayMode === 'night' || (displayMode === 'system' && systemScheme === 'dark');
  const textScale = [0.92, 1, 1.08, 1.16][fontScaleLevel] || 1;
  const iconScale = [0.9, 1, 1.1, 1.2][fontScaleLevel] || 1;
  const [refreshing, setRefreshing] = useState(false);
  const bookmarkedTweets = tweets.filter((t) => t.isBookmarked);

  const palette = isDark
    ? { bg: '#000000', title: '#f2f2f2', body: '#8b98a5' }
    : { bg: '#ffffff', title: '#0f1419', body: '#536471' };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshAppData();
    } finally {
      setRefreshing(false);
    }
  }, [refreshAppData]);

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}> 
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
            <Bookmark size={60 * iconScale} color={palette.body} strokeWidth={1.5} />
            <Text style={[styles.emptyStateTitle, { color: palette.title, fontSize: 24 * textScale }]}>Save posts for later</Text>
            <Text style={[styles.emptyStateText, { color: palette.body, fontSize: 15 * textScale }]}> 
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