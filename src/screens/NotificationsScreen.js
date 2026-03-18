import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Bell } from 'lucide-react-native/icons';
import { AppHeader } from '../components/AppHeader';
import { useAppStore } from '../store/appStore';
import { UserAvatar } from '../components/UserAvatar';

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

export const NotificationsScreen = ({ onOpenDrawer }) => {
  const notifications = useAppStore((state) => state.notifications || []);
  const markNotificationsAsRead = useAppStore((state) => state.markNotificationsAsRead);

  useEffect(() => {
    markNotificationsAsRead();
  }, [markNotificationsAsRead]);

  return (
    <View style={styles.container}>
      <AppHeader title="Notifications" onOpenDrawer={onOpenDrawer} />
      
      <ScrollView style={styles.content}>
        {notifications.length ? (
          notifications.map((notification) => (
            <View key={notification.id} style={styles.notificationRow}>
              <UserAvatar
                imageUri={notification.actorAvatarImage}
                fallbackText={notification.actorAvatar || notification.actorDisplayName?.charAt(0)}
                backgroundColor={notification.actorAverageColor || '#000000'}
                size={40}
              />
              <View style={styles.notificationBody}>
                <View style={styles.notificationTopRow}>
                  <Text style={styles.notificationText}>{getNotificationText(notification)}</Text>
                  <Text style={styles.timeText}>{formatRelativeTime(notification.createdAt)}</Text>
                </View>
                {!!notification.tweetPreview && (
                  <Text style={styles.tweetPreview} numberOfLines={2}>
                    {notification.tweetPreview}
                  </Text>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Bell size={60} color="#0f1419" strokeWidth={1.5} />
            <Text style={styles.emptyStateTitle}>Nothing to see here</Text>
            <Text style={styles.emptyStateText}>
              When you get notifications, they'll show up here
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
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  notificationBody: {
    flex: 1,
  },
  notificationTopRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 8,
  },
  notificationText: {
    flex: 1,
    fontSize: 15,
    color: '#0f1419',
    lineHeight: 21,
  },
  timeText: {
    fontSize: 13,
    color: '#536471',
  },
  tweetPreview: {
    marginTop: 4,
    fontSize: 14,
    color: '#536471',
    lineHeight: 20,
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
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#536471',
    textAlign: 'center',
    maxWidth: 300,
  },
});
