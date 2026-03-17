import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MessageCircle, Repeat2, Heart, Bookmark, Share2, ChartBar } from 'lucide-react-native/icons';
import { useAppStore } from '../store/appStore';

export const Tweet = ({ tweet }) => {
  const likeTweet = useAppStore((state) => state.likeTweet);
  const retweetTweet = useAppStore((state) => state.retweetTweet);
  const bookmarkTweet = useAppStore((state) => state.bookmarkTweet);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{tweet.displayName[0]}</Text>
        </View>
        <View style={styles.headerText}>
          <View style={styles.nameRow}>
            <Text style={styles.displayName}>{tweet.displayName}</Text>
            <Text style={styles.username}>{tweet.username}</Text>
            <Text style={styles.timestamp}>· {tweet.timestamp}</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.content}>{tweet.content}</Text>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
