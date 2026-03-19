import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native/icons';
import { useAppStore } from '../store/appStore';
import { Tweet } from '../components/Tweet';
import { AppHeader } from '../components/AppHeader';

export const ForYouScreen = ({ onCreatePost, onOpenDrawer, onOpenProfile }) => {
  const tweets = useAppStore((state) => state.tweets);
  const currentUser = useAppStore((state) => state.currentUser);
  const knownUsers = useAppStore((state) => state.knownUsers);
  const refreshAppData = useAppStore((state) => state.refreshAppData);
  const displayMode = useAppStore((state) => state.displayMode);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const systemScheme = useColorScheme();
  
  // Hook to get the safe area bottom inset
  const insets = useSafeAreaInsets();

  const isDark = displayMode === 'night' || (displayMode === 'system' && systemScheme === 'dark');
  const textScale = [0.92, 1, 1.08, 1.16][fontScaleLevel] || 1;
  const iconScale = [0.9, 1, 1.1, 1.2][fontScaleLevel] || 1;
  const [feedTab, setFeedTab] = useState('forYou');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshAppData();
    } finally {
      setRefreshing(false);
    }
  }, [refreshAppData]);

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

  const palette = isDark
    ? {
        bg: '#000000',
        border: '#1f2428',
        tabInactive: '#8b98a5',
        tabActive: '#f2f2f2',
        emptyTitle: '#f2f2f2',
        emptyText: '#8b98a5',
      }
    : {
        bg: '#ffffff',
        border: '#eff3f4',
        tabInactive: '#536471',
        tabActive: '#0f1419',
        emptyTitle: '#0f1419',
        emptyText: '#536471',
      };

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <AppHeader title="𝕏" centered onOpenDrawer={onOpenDrawer} />

      <View style={[styles.feedTabsRow, { borderBottomColor: palette.border }]}>
        <TouchableOpacity
          style={styles.feedTabButton}
          activeOpacity={0.85}
          onPress={() => setFeedTab('forYou')}
        >
          <Text
            style={[
              styles.feedTabText,
              { color: palette.tabInactive, fontSize: 16 * textScale },
              feedTab === 'forYou' && [styles.feedTabTextActive, { color: palette.tabActive }],
            ]}
          >
            For you
          </Text>
          {feedTab === 'forYou' ? <View style={styles.feedTabIndicator} /> : null}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.feedTabButton}
          activeOpacity={0.85}
          onPress={() => setFeedTab('following')}
        >
          <Text
            style={[
              styles.feedTabText,
              { color: palette.tabInactive, fontSize: 16 * textScale },
              feedTab === 'following' && [styles.feedTabTextActive, { color: palette.tabActive }],
            ]}
          >
            Following
          </Text>
          {feedTab === 'following' ? <View style={styles.feedTabIndicator} /> : null}
        </TouchableOpacity>
      </View>
      
      <ScrollView
        style={styles.feed}
        /* Adding padding to the bottom of the scroll content so the last tweet isn't hidden */
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {visibleTweets.length ? (
          visibleTweets.map((tweet) => (
            <Tweet key={tweet.id} tweet={tweet} onPressProfile={onOpenProfile} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateTitle, { color: palette.emptyTitle, fontSize: 24 * textScale }]}>{emptyTitle}</Text>
            <Text style={[styles.emptyStateText, { color: palette.emptyText, fontSize: 15 * textScale }]}>{emptyText}</Text>
          </View>
        )}
      </ScrollView>
      
      <TouchableOpacity 
        /* Pushing the FAB up by the height of the device navigation bar */
        style={[styles.fab, { bottom: 20 + insets.bottom }]} 
        onPress={onCreatePost}
      >
        <Plus size={42 * iconScale} color="#fff" strokeWidth={2.1} />
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
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1d9bf0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});