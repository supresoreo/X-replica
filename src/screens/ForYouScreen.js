import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native/icons';
import { useAppStore } from '../store/appStore';
import { Tweet } from '../components/Tweet';
import { AppHeader } from '../components/AppHeader';

export const ForYouScreen = ({ onCreatePost, onOpenDrawer }) => {
  const tweets = useAppStore((state) => state.tweets);
  const currentUser = useAppStore((state) => state.currentUser);
  const knownUsers = useAppStore((state) => state.knownUsers);
  const [feedTab, setFeedTab] = useState('forYou');

  const followingFeedTweets = !currentUser
    ? []
    : (() => {
        const followingIds = new Set(currentUser.followingIds || []);
        const followedUsernames = new Set(
          knownUsers
            .filter((user) => followingIds.has(user.id))
            .map((user) => (user.username || '').toLowerCase())
        );

        return tweets.filter((tweet) => {
          const tweetUserId = tweet.userId || '';
          const tweetUsername = (tweet.username || '').toLowerCase();
          const currentUsername = (currentUser.username || '').toLowerCase();
          const isOwnTweet = tweetUserId === currentUser.id || tweetUsername === currentUsername;
          const isFromFollowedUser = followingIds.has(tweetUserId) || followedUsernames.has(tweetUsername);

          return isOwnTweet || isFromFollowedUser;
        });
      })();

  const visibleTweets = feedTab === 'following' ? followingFeedTweets : tweets;
  const emptyTitle = feedTab === 'following' ? 'No tweets from your circle yet' : 'No posts yet';
  const emptyText =
    feedTab === 'following'
      ? 'Follow more people to build your Following timeline. Your own tweets will also appear here.'
      : 'Real posts from real users will appear here.';

  return (
    <View style={styles.container}>
      <AppHeader title="𝕏" centered onOpenDrawer={onOpenDrawer} />

      <View style={styles.feedTabsRow}>
        <TouchableOpacity
          style={styles.feedTabButton}
          activeOpacity={0.85}
          onPress={() => setFeedTab('forYou')}
        >
          <Text style={[styles.feedTabText, feedTab === 'forYou' && styles.feedTabTextActive]}>For you</Text>
          {feedTab === 'forYou' ? <View style={styles.feedTabIndicator} /> : null}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.feedTabButton}
          activeOpacity={0.85}
          onPress={() => setFeedTab('following')}
        >
          <Text style={[styles.feedTabText, feedTab === 'following' && styles.feedTabTextActive]}>Following</Text>
          {feedTab === 'following' ? <View style={styles.feedTabIndicator} /> : null}
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.feed}>
        {visibleTweets.length ? (
          visibleTweets.map((tweet) => (
            <Tweet key={tweet.id} tweet={tweet} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>{emptyTitle}</Text>
            <Text style={styles.emptyStateText}>{emptyText}</Text>
          </View>
        )}
      </ScrollView>
      
      <TouchableOpacity style={styles.fab} onPress={onCreatePost}>
        <Plus size={42} color="#fff" strokeWidth={2.1} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  feed: {
    flex: 1,
  },
  feedTabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  feedTabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 10,
  },
  feedTabText: {
    fontSize: 16,
    color: '#536471',
    fontWeight: '600',
  },
  feedTabTextActive: {
    color: '#0f1419',
    fontWeight: '800',
  },
  feedTabIndicator: {
    marginTop: 8,
    width: 54,
    height: 3,
    borderRadius: 3,
    backgroundColor: '#1d9bf0',
  },
  emptyState: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f1419',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#536471',
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#4fa0ea',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 9,
    shadowColor: '#2a7dc9',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 8,
  },
});
