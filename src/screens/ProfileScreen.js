import React, { useCallback, useMemo, useState } from 'react';
import { ImageBackground, ScrollView, Text, TouchableOpacity, View, RefreshControl, useColorScheme } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { Alert } from 'react-native';
import { Bell, Mail } from 'lucide-react-native/icons';
import { useAppStore } from '../store/appStore';
import { Tweet } from '../components/Tweet';
import { AppHeader } from '../components/AppHeader';
import { EditProfileModal } from '../components/EditProfileModal';
import { FollowListModal } from '../components/FollowListModal';
import { UserAvatar } from '../components/UserAvatar';
import { transformNodeForDisplay } from '../utils/themeTransform';
import { styles } from '../styles/screens/ProfileScreen.styles';

export const ProfileScreen = ({ onOpenDrawer, profileUserId = null, onSelectProfile = null, onOpenTweet = null }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [followListMode, setFollowListMode] = useState(null);
  const currentUser = useAppStore((state) => state.currentUser);
  const knownUsers = useAppStore((state) => state.knownUsers);
  const isFollowingUser = useAppStore((state) => state.isFollowingUser);
  const followUser = useAppStore((state) => state.followUser);
  const unfollowUser = useAppStore((state) => state.unfollowUser);
  const refreshAppData = useAppStore((state) => state.refreshAppData);
  const tweets = useAppStore((state) => state.tweets);
  const muteNotificationsForUser = useAppStore((state) => state.muteNotificationsForUser);
  const unmuteNotificationsForUser = useAppStore((state) => state.unmuteNotificationsForUser);
  const isNotificationMutedForUser = useAppStore((state) => state.isNotificationMutedForUser);
  const getOrCreateConversation = useAppStore((state) => state.getOrCreateConversation);
  const displayMode = useAppStore((state) => state.displayMode);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const systemScheme = useColorScheme();
  const isDark = displayMode === 'night' || (displayMode === 'system' && systemScheme === 'dark');
  const textScale = [0.92, 1, 1.08, 1.16][fontScaleLevel] || 1;
  const iconScale = [0.9, 1, 1.1, 1.2][fontScaleLevel] || 1;
  const [refreshing, setRefreshing] = useState(false);
  const viewedUser = useMemo(() => {
    if (!profileUserId || profileUserId === currentUser?.id) {
      return currentUser;
    }

    return knownUsers.find((user) => user.id === profileUserId) || currentUser;
  }, [currentUser, knownUsers, profileUserId]);
  const isOwnProfile = viewedUser?.id === currentUser?.id;
  const isNotificationMuted = viewedUser?.id ? isNotificationMutedForUser(viewedUser.id) : false;
  const userTweets = tweets.filter(
    (tweet) => tweet.userId === viewedUser?.id || tweet.username === viewedUser?.username
  );
  const suggestedUsers = useMemo(() => {
    return knownUsers
      .filter((user) => user.id !== currentUser?.id)
      .slice(0, 4);
  }, [currentUser?.id, knownUsers]);
  const isFollowingViewedUser = viewedUser?.id ? isFollowingUser(viewedUser.id) : false;

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshAppData();
    } finally {
      setRefreshing(false);
    }
  }, [refreshAppData]);

  const handleToggleNotifications = useCallback(() => {
    if (!viewedUser?.id) return;
    if (isNotificationMuted) {
      unmuteNotificationsForUser(viewedUser.id);
    } else {
      muteNotificationsForUser(viewedUser.id);
    }
  }, [viewedUser?.id, isNotificationMuted, muteNotificationsForUser, unmuteNotificationsForUser]);

  const handleOpenDM = useCallback(() => {
    if (!viewedUser?.id) return;
    // Ensure conversation exists
    getOrCreateConversation(viewedUser.id);
    // Navigate to messages screen
    if (onSelectProfile) {
      onSelectProfile(viewedUser.id, 'messages');
    }
  }, [viewedUser?.id, getOrCreateConversation, onSelectProfile]);

  if (!currentUser || !viewedUser) {
    return null;
  }

  const updateProfileAvatar = useAppStore((state) => state.updateProfileAvatar);

const handleChangeAvatar = useCallback(() => {
  Alert.alert("Change Avatar", "Choose an option", [
    {
      text: "Camera",
      onPress: () => {
        launchCamera({ mediaType: 'photo' }, (response) => {
          if (response.didCancel || response.errorCode) return;

          const uri = response.assets?.[0]?.uri;
          if (uri) updateProfileAvatar(uri);
        });
      },
    },
    {
      text: "Gallery",
      onPress: () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
          if (response.didCancel || response.errorCode) return;

          const uri = response.assets?.[0]?.uri;
          if (uri) updateProfileAvatar(uri);
        });
      },
    },
    { text: "Cancel", style: "cancel" },
  ]);
}, [updateProfileAvatar]);

  const contentNode = (
    <View style={styles.container}>
      <AppHeader title="Profile" onOpenDrawer={onOpenDrawer} />
      
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
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
            onPress={isOwnProfile ? handleChangeAvatar : null} // 👈 ONLY if own profile
          />

          {isOwnProfile ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setShowEditModal(true)}
            >
              <Text style={styles.editButtonText}>Edit profile</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.actionButtonsGroup}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleToggleNotifications}
              >
                <Bell
                  size={20}
                  color={isNotificationMuted ? '#cfd9de' : '#0f1419'}
                  fill={isNotificationMuted ? '#cfd9de' : 'none'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleOpenDM}
              >
                <Mail size={20} color="#0f1419" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.followButton, isFollowingViewedUser && styles.unfollowButton]}
                onPress={() =>
                  isFollowingViewedUser ? unfollowUser(viewedUser.id) : followUser(viewedUser.id)
                }
              >
                <Text style={[styles.followButtonText, isFollowingViewedUser && styles.unfollowButtonText]}>
                  {isFollowingViewedUser ? 'Unfollow' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </View>
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
          <Tweet
            key={tweet.id}
            tweet={tweet}
            onPressProfile={(userId) => onSelectProfile?.(userId)}
            onPressTweet={onOpenTweet}
            onPressMedia={onOpenTweet}
          />
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
        onSelectProfile={(userId) => {
          setFollowListMode(null);
          if (onSelectProfile) {
            onSelectProfile(userId);
          }
        }}
      />
    </View>
  );

  return transformNodeForDisplay(contentNode, isDark, textScale, iconScale);
};

