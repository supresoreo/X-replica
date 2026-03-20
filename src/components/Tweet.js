import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Image } from 'react-native';
import { MessageCircle, Repeat2, Heart, Bookmark, Share2, ChartBar, Volume2, VolumeX } from 'lucide-react-native/icons';
import Video from 'react-native-video';
import { useAppStore } from '../store/appStore';
import { UserAvatar } from './UserAvatar';
import { ComposeReplyModal } from './ComposeReplyModal';

const formatTweetTime = (createdAt, fallback = '') => {
  const parsed = Date.parse(createdAt || '');
  if (Number.isNaN(parsed)) {
    return fallback || 'Now';
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

export const Tweet = ({ tweet, onPressProfile, onPressTweet, onPressMedia }) => {
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const replyTweet = useAppStore((state) => state.replyTweet);
  const submitReply = useAppStore((state) => state.submitReply);
  const likeTweet = useAppStore((state) => state.likeTweet);
  const retweetTweet = useAppStore((state) => state.retweetTweet);
  const bookmarkTweet = useAppStore((state) => state.bookmarkTweet);
  const currentUser = useAppStore((state) => state.currentUser);
  const displayMode = useAppStore((state) => state.displayMode);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const systemScheme = useColorScheme();
  const isDark = displayMode === 'night' || (displayMode === 'system' && systemScheme === 'dark');

  const textScale = [0.92, 1, 1.08, 1.16][fontScaleLevel] || 1;
  const iconScale = [0.9, 1, 1.1, 1.2][fontScaleLevel] || 1;
  const timestampLabel = formatTweetTime(tweet.createdAt, tweet.timestamp);
  const [isMuted, setIsMuted] = useState(true);

  const mediaType = useMemo(() => {
    if (tweet.mediaType) {
      return tweet.mediaType;
    }

    if (tweet.mediaUri || tweet.image) {
      return 'image';
    }

    return null;
  }, [tweet.image, tweet.mediaType, tweet.mediaUri]);
  const mediaUri = tweet.mediaUri || tweet.image || null;

  const palette = isDark
    ? {
        bg: '#000000',
        border: '#1f2428',
        textPrimary: '#f2f2f2',
        textSecondary: '#8b98a5',
        actionIcon: '#8b98a5',
      }
    : {
        bg: '#ffffff',
        border: '#eff3f4',
        textPrimary: '#0f1419',
        textSecondary: '#536471',
        actionIcon: '#536471',
      };

  const handleOpenTweet = () => {
    onPressTweet?.(tweet);
  };

  const handleOpenMedia = () => {
    if (onPressMedia) {
      onPressMedia(tweet);
      return;
    }

    onPressTweet?.(tweet);
  };

  const handleOpenReplyModal = () => {
    if (!currentUser) {
      return;
    }
    setReplyModalVisible(true);
  };

  const handleSubmitReply = async (replyData) => {
    await submitReply(tweet.id, replyData.content);
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.bg, borderBottomColor: palette.border }]}>
      <View style={styles.mainRow}>
        <TouchableOpacity
          style={styles.avatarButton}
          activeOpacity={0.85}
          onPress={() => onPressProfile?.(tweet.userId)}
        >
          <UserAvatar
            imageUri={tweet.avatarImage}
            fallbackText={tweet.avatar || tweet.displayName[0]}
            backgroundColor={tweet.averageColor || '#000000'}
            size={40}
            style={styles.avatarCircle}
          />
        </TouchableOpacity>

        <View style={styles.bodyColumn}>
          <TouchableOpacity style={styles.textArea} activeOpacity={0.88} onPress={handleOpenTweet}>
            <View style={styles.nameRow}>
              <Text style={[styles.displayName, { color: palette.textPrimary, fontSize: 15 * textScale }]}>{tweet.displayName}</Text>
              <Text style={[styles.username, { color: palette.textSecondary, fontSize: 15 * textScale }]}>{tweet.username}</Text>
              <Text style={[styles.timestamp, { color: palette.textSecondary, fontSize: 15 * textScale }]}>· {timestampLabel}</Text>
            </View>
            <Text style={[styles.content, { color: palette.textPrimary, fontSize: 15 * textScale, lineHeight: 20 * textScale }]}>{tweet.content}</Text>
          </TouchableOpacity>

          {mediaUri ? (
            <TouchableOpacity style={styles.mediaWrap} activeOpacity={0.92} onPress={handleOpenMedia}>
              {mediaType === 'video' ? (
                <>
                  <Video
                    key={`video-${tweet.id}`}
                    source={{ uri: mediaUri }}
                    style={styles.media}
                    paused={false}
                    muted={isMuted}
                    repeat
                    resizeMode="cover"
                    rate={1}
                    progressUpdateInterval={500}
                    bufferConfig={{
                      minBufferMs: 15000,
                      maxBufferMs: 50000,
                      bufferForPlaybackMs: 2500,
                      bufferForPlaybackAfterRebufferMs: 5000,
                    }}
                    onError={() => {
                      // Silently handle errors for smooth playback
                    }}
                  />
                  <TouchableOpacity
                    style={styles.muteButton}
                    onPress={(event) => {
                      event?.stopPropagation?.();
                      setIsMuted((prev) => !prev);
                    }}
                    activeOpacity={0.85}
                  >
                    {isMuted ? <VolumeX size={16} color="#ffffff" /> : <Volume2 size={16} color="#ffffff" />}
                  </TouchableOpacity>
                </>
              ) : (
                <Image source={{ uri: mediaUri }} style={styles.media} />
              )}
            </TouchableOpacity>
          ) : null}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleOpenReplyModal}>
              <MessageCircle size={18 * iconScale} color={palette.actionIcon} />
              <Text style={[styles.actionCount, { color: palette.textSecondary, fontSize: 13 * textScale }]}>{tweet.replies}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => retweetTweet(tweet.id)}
            >
              <Repeat2 size={18 * iconScale} color={tweet.isRetweeted ? '#00ba7c' : palette.actionIcon} />
              <Text style={[styles.actionCount, { color: palette.textSecondary, fontSize: 13 * textScale }, tweet.isRetweeted && styles.retweeted]}>
                {tweet.retweets}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => likeTweet(tweet.id)}
            >
              <Heart size={18 * iconScale} color={tweet.isLiked ? '#f91880' : palette.actionIcon} fill={tweet.isLiked ? '#f91880' : 'none'} />
              <Text style={[styles.actionCount, { color: palette.textSecondary, fontSize: 13 * textScale }, tweet.isLiked && styles.liked]}>
                {tweet.likes}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <ChartBar size={18 * iconScale} color={palette.actionIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => bookmarkTweet(tweet.id)}
            >
              <Bookmark size={18 * iconScale} color={palette.actionIcon} fill={tweet.isBookmarked ? palette.actionIcon : 'none'} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Share2 size={18 * iconScale} color={palette.actionIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ComposeReplyModal
        visible={replyModalVisible}
        tweet={tweet}
        currentUser={currentUser}
        onClose={() => setReplyModalVisible(false)}
        onSubmit={handleSubmitReply}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarButton: {
    marginRight: 10,
  },
  avatarCircle: {
    marginRight: 0,
  },
  bodyColumn: {
    flex: 1,
  },
  textArea: {},
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  displayName: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  username: {
    marginRight: 5,
  },
  timestamp: {},
  content: {
    marginTop: 2,
    marginBottom: 10,
  },
  mediaWrap: {
    marginTop: 2,
    marginBottom: 10,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0f1419',
  },
  media: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  muteButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionCount: {},
  liked: {
    color: '#f91880',
  },
  retweeted: {
    color: '#00ba7c',
  },
});