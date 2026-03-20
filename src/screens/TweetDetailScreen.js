import React, { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { styles } from '../styles/screens/TweetDetailScreen.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react-native/icons';
import Video from 'react-native-video';
import { useAppStore } from '../store/appStore';
import { UserAvatar } from '../components/UserAvatar';

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

export const TweetDetailScreen = ({ tweet, onBack, onOpenProfile }) => {
  const displayMode = useAppStore((state) => state.displayMode);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const getRepliesForTweet = useAppStore((state) => state.getRepliesForTweet);
  const currentUser = useAppStore((state) => state.currentUser);
  const systemScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [isMuted, setIsMuted] = useState(true);

  const isDark = displayMode === 'night' || (displayMode === 'system' && systemScheme === 'dark');
  const textScale = [0.92, 1, 1.08, 1.16][fontScaleLevel] || 1;
  const timestampLabel = formatTweetTime(tweet?.createdAt, tweet?.timestamp);

  const mediaType = useMemo(() => {
    if (tweet?.mediaType) {
      return tweet.mediaType;
    }

    if (tweet?.mediaUri || tweet?.image) {
      return 'image';
    }

    return null;
  }, [tweet?.image, tweet?.mediaType, tweet?.mediaUri]);

  const mediaUri = tweet?.mediaUri || tweet?.image || null;

  const palette = isDark
    ? {
        bg: '#000000',
        headerBorder: '#1f2428',
        cardBg: '#0f1215',
        cardBorder: '#1f2428',
        title: '#f2f2f2',
        textPrimary: '#f2f2f2',
        textSecondary: '#8b98a5',
      }
    : {
        bg: '#ffffff',
        headerBorder: '#eff3f4',
        cardBg: '#ffffff',
        cardBorder: '#e6ecf0',
        title: '#0f1419',
        textPrimary: '#0f1419',
        textSecondary: '#536471',
      };

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}> 
      <View style={[styles.header, { paddingTop: insets.top + 6, borderBottomColor: palette.headerBorder }]}> 
        <TouchableOpacity style={styles.backButton} activeOpacity={0.84} onPress={onBack}>
          <ArrowLeft size={24} color={palette.title} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: palette.title, fontSize: 20 * textScale }]}>Post</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {tweet ? (
          <>
            <View style={[styles.card, { backgroundColor: palette.cardBg, borderColor: palette.cardBorder }]}> 
              <View style={styles.authorRow}>
                <TouchableOpacity activeOpacity={0.85} onPress={() => onOpenProfile?.(tweet.userId)}>
                  <UserAvatar
                    imageUri={tweet.avatarImage}
                    fallbackText={tweet.avatar || tweet.displayName?.[0]}
                    backgroundColor={tweet.averageColor || '#000000'}
                    size={44}
                  />
                </TouchableOpacity>
                <View style={styles.authorTextWrap}>
                  <Text style={[styles.displayName, { color: palette.textPrimary, fontSize: 16 * textScale }]}>{tweet.displayName}</Text>
                  <Text style={[styles.username, { color: palette.textSecondary, fontSize: 14 * textScale }]}>{tweet.username} · {timestampLabel}</Text>
                </View>
              </View>

              <Text style={[styles.tweetText, { color: palette.textPrimary, fontSize: 17 * textScale, lineHeight: 24 * textScale }]}>
                {tweet.content}
              </Text>
            </View>

            {mediaUri ? (
              <View style={styles.focusedMediaWrap}>
                {mediaType === 'video' ? (
                  <>
                    <Video
                      source={{ uri: mediaUri }}
                      style={styles.focusedMedia}
                      paused={false}
                      muted={isMuted}
                      repeat
                      resizeMode="contain"
                    />
                    <TouchableOpacity
                      style={styles.muteButton}
                      onPress={() => setIsMuted((prev) => !prev)}
                      activeOpacity={0.85}
                    >
                      {isMuted ? <VolumeX size={18} color="#ffffff" /> : <Volume2 size={18} color="#ffffff" />}
                    </TouchableOpacity>
                  </>
                ) : (
                  <Image source={{ uri: mediaUri }} style={styles.focusedMedia} resizeMode="contain" />
                )}
              </View>
            ) : null}

            {tweet?._replies && tweet._replies.length > 0 && (
              <>
                <View style={[styles.repliesSpacer, { borderColor: palette.headerBorder }]} />
                <Text style={[styles.repliesHeader, { color: palette.textPrimary, fontSize: 16 * textScale }]}>
                  Replies ({tweet._replies.length})
                </Text>
                {tweet._replies.map((reply) => (
                  <View key={reply.id} style={[styles.replyCard, { backgroundColor: palette.cardBg, borderColor: palette.cardBorder }]}>
                    <View style={styles.authorRow}>
                      <View style={styles.replyAvatar}>
                        <Text style={{ color: palette.textSecondary, fontSize: 11 * textScale }}>
                          {reply.displayName?.[0] || 'U'}
                        </Text>
                      </View>
                      <View style={styles.authorTextWrap}>
                        <Text style={[styles.displayName, { color: palette.textPrimary, fontSize: 14 * textScale }]}>
                          {reply.displayName}
                        </Text>
                        <Text style={[styles.username, { color: palette.textSecondary, fontSize: 13 * textScale }]}>
                          {reply.username} · {formatTweetTime(reply.createdAt)}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.replyText, { color: palette.textPrimary, fontSize: 14 * textScale, lineHeight: 20 * textScale }]}>
                      {reply.content}
                    </Text>
                    <View style={[styles.replyActions, { borderColor: palette.headerBorder }]}>
                      <Text style={[styles.replyLikeCount, { color: palette.textSecondary, fontSize: 12 * textScale }]}>
                        {reply.likes || 0} {reply.likes === 1 ? 'like' : 'likes'}
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            )}
          </>
        ) : (
          <View style={[styles.card, { backgroundColor: palette.cardBg, borderColor: palette.cardBorder }]}> 
            <Text style={[styles.emptyTitle, { color: palette.textPrimary, fontSize: 20 * textScale }]}>Post unavailable</Text>
            <Text style={[styles.emptyText, { color: palette.textSecondary, fontSize: 15 * textScale }]}>This post may have been removed.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};


