import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MessageCircle, Repeat2, Heart, Bookmark, Share2, ChartBar } from 'lucide-react-native/icons';
import { useAppStore } from '../store/appStore';
import { UserAvatar } from './UserAvatar';

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

export const Tweet = ({ tweet, onPressProfile }) => {
  const replyTweet = useAppStore((state) => state.replyTweet);
  const likeTweet = useAppStore((state) => state.likeTweet);
  const retweetTweet = useAppStore((state) => state.retweetTweet);
  const bookmarkTweet = useAppStore((state) => state.bookmarkTweet);
  const timestampLabel = formatTweetTime(tweet.createdAt, tweet.timestamp);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
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
        <View style={styles.headerText}>
          <View style={styles.nameRow}>
            <Text style={styles.displayName}>{tweet.displayName}</Text>
            <Text style={styles.username}>{tweet.username}</Text>
            <Text style={styles.timestamp}>· {timestampLabel}</Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <Text style={styles.content}>{tweet.content}</Text>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => replyTweet(tweet.id)}>
          <MessageCircle size={18} color="#536471" />
          <Text style={styles.actionCount}>{tweet.replies}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => retweetTweet(tweet.id)}
        >
          <Repeat2 size={18} color={tweet.isRetweeted ? '#00ba7c' : '#536471'} />
          <Text style={[styles.actionCount, tweet.isRetweeted && styles.retweeted]}>
            {tweet.retweets}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => likeTweet(tweet.id)}
        >
          <Heart size={18} color={tweet.isLiked ? '#f91880' : '#536471'} fill={tweet.isLiked ? '#f91880' : 'none'} />
          <Text style={[styles.actionCount, tweet.isLiked && styles.liked]}>
            {tweet.likes}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <ChartBar size={18} color="#536471" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => bookmarkTweet(tweet.id)}
        >
          <Bookmark size={18} color="#536471" fill={tweet.isBookmarked ? '#536471' : 'none'} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Share2 size={18} color="#536471" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  avatarCircle: {
    marginRight: 10,
  },
  headerText: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  displayName: {
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 5,
    color: '#0f1419',
  },
  username: {
    color: '#536471',
    fontSize: 15,
    marginRight: 5,
  },
  timestamp: {
    color: '#536471',
    fontSize: 15,
  },
  content: {
    fontSize: 15,
    lineHeight: 20,
    color: '#0f1419',
    marginBottom: 10,
    marginLeft: 50,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginLeft: 50,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionCount: {
    color: '#536471',
    fontSize: 13,
  },
  liked: {
    color: '#f91880',
  },
  retweeted: {
    color: '#00ba7c',
  },
});
