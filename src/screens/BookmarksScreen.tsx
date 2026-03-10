import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Bookmark } from 'lucide-react-native/icons';
import { useAppStore } from '../store/appStore';
import { Tweet } from '../components/Tweet';

export const BookmarksScreen: React.FC = () => {
  const tweets = useAppStore((state) => state.tweets);
  const bookmarkedTweets = tweets.filter((t) => t.isBookmarked);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookmarks</Text>
      </View>
      
      <ScrollView style={styles.content}>
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
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f1419',
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
