import React, { useMemo, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppStore } from '../store/appStore';
import { Tweet } from '../components/Tweet';
import { AppHeader } from '../components/AppHeader';
import { EditProfileModal } from '../components/EditProfileModal';
import { FollowListModal } from '../components/FollowListModal';
import { UserAvatar } from '../components/UserAvatar';

export const ProfileScreen = ({ onOpenDrawer, profileUserId = null }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [followListMode, setFollowListMode] = useState(null);
  const currentUser = useAppStore((state) => state.currentUser);
  const knownUsers = useAppStore((state) => state.knownUsers);
  const isFollowingUser = useAppStore((state) => state.isFollowingUser);
  const followUser = useAppStore((state) => state.followUser);
  const unfollowUser = useAppStore((state) => state.unfollowUser);
  const tweets = useAppStore((state) => state.tweets);
  const viewedUser = useMemo(() => {
    if (!profileUserId || profileUserId === currentUser?.id) {
      return currentUser;
    }

    return knownUsers.find((user) => user.id === profileUserId) || currentUser;
  }, [currentUser, knownUsers, profileUserId]);
  const isOwnProfile = viewedUser?.id === currentUser?.id;
  const userTweets = tweets.filter(
    (tweet) => tweet.userId === viewedUser?.id || tweet.username === viewedUser?.username
  );
  const suggestedUsers = useMemo(() => {
    return knownUsers
      .filter((user) => user.id !== currentUser?.id)
      .slice(0, 4);
  }, [currentUser?.id, knownUsers]);
  const isFollowingViewedUser = viewedUser?.id ? isFollowingUser(viewedUser.id) : false;

  if (!currentUser || !viewedUser) {
    return null;
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Profile" onOpenDrawer={onOpenDrawer} />
      
      <ScrollView style={styles.content}>
        {viewedUser.bannerImage ? (
          <ImageBackground source={{ uri: viewedUser.bannerImage }} style={styles.banner} imageStyle={styles.bannerImage} />
        ) : (
          <View style={[styles.banner, { backgroundColor: viewedUser.banner }]} />
        )}
        
        <View style={styles.profileInfo}>
          <UserAvatar
            imageUri={viewedUser.avatarImage}
            fallbackText={viewedUser.avatar || viewedUser.displayName[0]}
            backgroundColor={viewedUser.averageColor || '#000000'}
            size={76}
            borderWidth={4}
            borderColor="#ffffff"
            style={styles.avatarCircle}
          />

          {isOwnProfile ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setShowEditModal(true)}
            >
              <Text style={styles.editButtonText}>Edit profile</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.editButton, isFollowingViewedUser && styles.unfollowButton]}
              onPress={() =>
                isFollowingViewedUser ? unfollowUser(viewedUser.id) : followUser(viewedUser.id)
              }
            >
              <Text style={[styles.editButtonText, isFollowingViewedUser && styles.unfollowButtonText]}>
                {isFollowingViewedUser ? 'Unfollow' : 'Follow'}
              </Text>
            </TouchableOpacity>
          )}

          <Text style={styles.displayName}>{viewedUser.displayName}</Text>
          <Text style={styles.username}>{viewedUser.username}</Text>

          {viewedUser.bio && <Text style={styles.bio}>{viewedUser.bio}</Text>}
          
          <View style={styles.profileMeta}>
            {viewedUser.location && (
              <Text style={styles.metaItem}>📍 {viewedUser.location}</Text>
            )}
            {viewedUser.website && (
              <Text style={styles.metaItem}>🔗 {viewedUser.website}</Text>
            )}
          </View>
          
          <View style={styles.stats}>
            <TouchableOpacity style={styles.stat} onPress={() => setFollowListMode('following')}>
              <Text style={styles.statNumber}>{viewedUser.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.stat} onPress={() => setFollowListMode('followers')}>
              <Text style={styles.statNumber}>{viewedUser.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.tabs}>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabTextActive}>Posts</Text>
            <View style={styles.tabIndicator} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Replies</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Media</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Likes</Text>
          </TouchableOpacity>
        </View>
        
        {userTweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} />
        ))}

        {isOwnProfile ? (
          <View style={styles.suggestionsSection}>
            <Text style={styles.suggestionsTitle}>Suggested people</Text>
            {suggestedUsers.map((user) => {
              const isFollowing = isFollowingUser(user.id);
              return (
                <View key={user.id} style={styles.suggestionRow}>
                  <UserAvatar
                    imageUri={user.avatarImage}
                    fallbackText={user.avatar || user.displayName[0]}
                    backgroundColor={user.averageColor || '#000000'}
                    size={48}
                  />
                  <View style={styles.suggestionDetails}>
                    <Text style={styles.suggestionName}>{user.displayName}</Text>
                    <Text style={styles.suggestionUsername}>{user.username}</Text>
                    {!!user.bio && (
                      <Text style={styles.suggestionBio} numberOfLines={2}>
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

      <EditProfileModal 
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
      />

      <FollowListModal
        visible={Boolean(followListMode)}
        mode={followListMode}
        userId={viewedUser.id}
        onClose={() => setFollowListMode(null)}
      />
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
  banner: {
    height: 150,
    backgroundColor: '#cfd9de',
  },
  bannerImage: {
    resizeMode: 'cover',
  },
  profileInfo: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  avatarCircle: {
    marginTop: -38,
    marginBottom: 10,
  },
  editButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cfd9de',
  },
  editButtonText: {
    color: '#0f1419',
    fontWeight: 'bold',
  },
  displayName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f1419',
  },
  username: {
    fontSize: 15,
    color: '#536471',
    marginBottom: 10,
  },
  bio: {
    fontSize: 15,
    color: '#0f1419',
    marginBottom: 10,
  },
  profileMeta: {
    marginBottom: 15,
    gap: 8,
  },
  metaItem: {
    fontSize: 14,
    color: '#536471',
  },
  stats: {
    flexDirection: 'row',
    gap: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#0f1419',
  },
  statLabel: {
    color: '#536471',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  tabText: {
    color: '#536471',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#0f1419',
    fontWeight: 'bold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '100%',
    backgroundColor: '#000',
  },
  suggestionsSection: {
    padding: 15,
    gap: 16,
  },
  suggestionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f1419',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  suggestionDetails: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f1419',
  },
  suggestionUsername: {
    fontSize: 14,
    color: '#536471',
    marginBottom: 4,
  },
  suggestionBio: {
    fontSize: 14,
    lineHeight: 20,
    color: '#0f1419',
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
});
