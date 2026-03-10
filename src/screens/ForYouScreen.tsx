import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Sparkles } from 'lucide-react-native/icons';
import { useAppStore } from '../store/appStore';
import { Tweet } from '../components/Tweet';

interface ForYouScreenProps {
  onCreatePost: () => void;
}

export const ForYouScreen: React.FC<ForYouScreenProps> = ({ onCreatePost }) => {
  const tweets = useAppStore((state) => state.tweets);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>𝕏</Text>
      </View>
      
      <ScrollView style={styles.feed}>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} />
        ))}
      </ScrollView>
      
      <TouchableOpacity style={styles.fab} onPress={onCreatePost}>
        <Sparkles size={24} color="#fff" strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f1419',
  },
  feed: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
