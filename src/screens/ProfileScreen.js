import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store/appStore';
import { Tweet } from '../components/Tweet';

export const ProfileScreen = () => {
  const currentUser = useAppStore((state) => state.currentUser);
  const tweets = useAppStore((state) => state.tweets);
  const userTweets = tweets.filter((t) => t.username === currentUser.username);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={[styles.banner, { backgroundColor: currentUser.banner }]} />
        
        <View style={styles.profileInfo}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{currentUser.displayName[0]}</Text>
          </View>
          
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit profile</Text>
          </TouchableOpacity>
          
          <Text style={styles.displayName}>{currentUser.displayName}</Text>
          <Text style={styles.username}>{currentUser.username}</Text>
          
          <Text style={styles.bio}>{currentUser.bio}</Text>
          
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{currentUser.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{currentUser.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f1419',
  },
  content: {
    flex: 1,
  },
  banner: {
    height: 150,
    backgroundColor: '#cfd9de',
  },
  profileInfo: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#000',
    marginTop: -35,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
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
});
