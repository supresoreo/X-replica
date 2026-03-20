import React, { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, useColorScheme, TouchableOpacity } from 'react-native';
import { Bell } from 'lucide-react-native/icons';
import { AppHeader } from '../components/AppHeader';
import { useAppStore } from '../store/appStore';
import { UserAvatar } from '../components/UserAvatar';
import { styles } from '../styles/screens/NotificationsScreen.styles';

const formatRelativeTime = (createdAt) => {
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

const getNotificationText = (notification) => {
  const actor = notification.actorDisplayName || 'Someone';

  switch (notification.type) {
    case 'follow':
      return `${actor} followed you`;
    case 'like':
      return `${actor} liked your post`;
    case 'repost':
      return `${actor} reposted your post`;
    case 'bookmark':
      return `${actor} bookmarked your post`;
    case 'reply':
      return `${actor} replied to your post`;
    default:
      return notification.message || `${actor} interacted with your account`;
  }
};

export const NotificationsScreen = ({ onOpenDrawer, onOpenTweet, onSelectProfile }) => {
  const notifications = useAppStore((state) => state.notifications || []);
  const tweets = useAppStore((state) => state.tweets || []);
  const markNotificationsAsRead = useAppStore((state) => state.markNotificationsAsRead);
  const displayMode = useAppStore((state) => state.displayMode);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const systemScheme = useColorScheme();
  const isDark = displayMode === 'night' || (displayMode === 'system' && systemScheme === 'dark');
  const textScale = [0.92, 1, 1.08, 1.16][fontScaleLevel] || 1;
  const iconScale = [0.9, 1, 1.1, 1.2][fontScaleLevel] || 1;

  const palette = isDark
    ? {
        bg: '#000000',
        border: '#1f2428',
        title: '#f2f2f2',
        body: '#8b98a5',
        rowActiveOpacity: 0.85,
      }
    : {
        bg: '#ffffff',
        border: '#eff3f4',
        title: '#0f1419',
        body: '#536471',
        rowActiveOpacity: 0.84,
      };

  useEffect(() => {
    markNotificationsAsRead();
  }, [markNotificationsAsRead]);

  const handleNotificationPress = (notification) => {
    // For 'follow' notifications, navigate to the actor's profile
    if (notification.type === 'follow') {
      onSelectProfile?.(notification.actorId);
      return;
    }

    // For other notifications (like, reply, repost, bookmark), navigate to the tweet
    if (notification.tweetId) {
      const tweet = tweets.find((t) => t.id === notification.tweetId);
      if (tweet) {
        onOpenTweet?.(tweet);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <AppHeader title="Notifications" onOpenDrawer={onOpenDrawer} />
      
      <ScrollView style={styles.content}>
        {notifications.length ? (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              activeOpacity={palette.rowActiveOpacity}
              style={[styles.notificationRow, { borderBottomColor: palette.border }]}
              onPress={() => handleNotificationPress(notification)}
            >
              <UserAvatar
                imageUri={notification.actorAvatarImage}
                fallbackText={notification.actorAvatar || notification.actorDisplayName?.charAt(0)}
                backgroundColor={notification.actorAverageColor || '#000000'}
                size={40}
              />
              <View style={styles.notificationBody}>
                <View style={styles.notificationTopRow}>
                  <Text style={[styles.notificationText, { color: palette.title, fontSize: 15 * textScale }]}>{getNotificationText(notification)}</Text>
                  <Text style={[styles.timeText, { color: palette.body, fontSize: 13 * textScale }]}>{formatRelativeTime(notification.createdAt)}</Text>
                </View>
                {!!notification.tweetPreview && (
                  <Text style={[styles.tweetPreview, { color: palette.body, fontSize: 14 * textScale, lineHeight: 20 * textScale }]} numberOfLines={2}>
                    {notification.tweetPreview}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Bell size={60 * iconScale} color={palette.title} strokeWidth={1.5} />
            <Text style={[styles.emptyStateTitle, { color: palette.title, fontSize: 24 * textScale }]}>Nothing to see here</Text>
            <Text style={[styles.emptyStateText, { color: palette.body, fontSize: 15 * textScale }]}> 
              When you get notifications, they'll show up here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

