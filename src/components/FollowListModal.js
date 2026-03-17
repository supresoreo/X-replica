import React, { useMemo } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { X } from 'lucide-react-native/icons';
import { useAppStore } from '../store/appStore';
import { UserAvatar } from './UserAvatar';

export const FollowListModal = ({ visible, mode, userId, onClose }) => {
  const currentUser = useAppStore((state) => state.currentUser);
  const knownUsers = useAppStore((state) => state.knownUsers);
  const getFollowersForUser = useAppStore((state) => state.getFollowersForUser);
  const getFollowingForUser = useAppStore((state) => state.getFollowingForUser);
  const isFollowingUser = useAppStore((state) => state.isFollowingUser);
  const followUser = useAppStore((state) => state.followUser);
  const unfollowUser = useAppStore((state) => state.unfollowUser);

  const users = useMemo(() => {
    if (!userId) {
      return [];
    }

    return mode === 'followers'
      ? getFollowersForUser(userId)
      : getFollowingForUser(userId);
  }, [getFollowersForUser, getFollowingForUser, mode, userId]);

  const suggestedUsers = useMemo(() => {
    const listedIds = new Set(users.map((user) => user.id));

    return knownUsers.filter((user) => {
      return user.id !== currentUser?.id && !listedIds.has(user.id);
    }).slice(0, 4);
  }, [currentUser?.id, knownUsers, users]);

  const title = mode === 'followers' ? 'Followers' : 'Following';

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.iconButton}>
            <X size={24} color="#0f1419" />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.iconButton} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {users.length ? (
            users.map((user) => {
              const isCurrentUser = currentUser?.id === user.id;
              const isFollowing = isFollowingUser(user.id);

              return (
                <View key={user.id} style={styles.userRow}>
                  <UserAvatar
                    imageUri={user.avatarImage}
                    fallbackText={user.avatar || user.displayName?.charAt(0)}
                    backgroundColor={user.averageColor}
                    size={48}
                  />
                  <View style={styles.userDetails}>
                    <Text style={styles.displayName}>{user.displayName}</Text>
                    <Text style={styles.username}>{user.username}</Text>
                    {!!user.bio && (
                      <Text style={styles.bio} numberOfLines={2}>
                        {user.bio}
                      </Text>
                    )}
                  </View>
                  {!isCurrentUser ? (
                    <TouchableOpacity
                      style={[styles.followButton, isFollowing && styles.unfollowButton]}
                      onPress={() => (isFollowing ? unfollowUser(user.id) : followUser(user.id))}
                    >
                      <Text style={[styles.followButtonText, isFollowing && styles.unfollowButtonText]}>
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No {title.toLowerCase()} yet</Text>
              <Text style={styles.emptyText}>
                Follow people from this device or switch accounts and follow back to build your network.
              </Text>
            </View>
          )}

          {suggestedUsers.length ? (
            <View style={styles.suggestionsSection}>
              <Text style={styles.suggestionsTitle}>Suggested people</Text>
              {suggestedUsers.map((user) => {
                const isFollowing = isFollowingUser(user.id);
                return (
                  <View key={user.id} style={styles.userRow}>
                    <UserAvatar
                      imageUri={user.avatarImage}
                      fallbackText={user.avatar || user.displayName?.charAt(0)}
                      backgroundColor={user.averageColor}
                      size={48}
                    />
                    <View style={styles.userDetails}>
                      <Text style={styles.displayName}>{user.displayName}</Text>
                      <Text style={styles.username}>{user.username}</Text>
                      {!!user.bio && (
                        <Text style={styles.bio} numberOfLines={2}>
                          {user.bio}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={[styles.followButton, isFollowing && styles.unfollowButton]}
                      onPress={() => (isFollowing ? unfollowUser(user.id) : followUser(user.id))}
                    >
                      <Text style={[styles.followButtonText, isFollowing && styles.unfollowButtonText]}>
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ) : null}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f1419',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  userDetails: {
    flex: 1,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f1419',
  },
  username: {
    fontSize: 14,
    color: '#536471',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: '#0f1419',
    lineHeight: 20,
  },
  followButton: {
    minWidth: 90,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#0f1419',
    alignItems: 'center',
  },
  unfollowButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cfd9de',
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  unfollowButtonText: {
    color: '#0f1419',
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f1419',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#536471',
    textAlign: 'center',
    maxWidth: 280,
  },
  suggestionsSection: {
    marginTop: 12,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#eff3f4',
    gap: 16,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f1419',
  },
});
