import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeft, Heart, MessageCircle, Repeat2 } from 'lucide-react-native/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tweet } from '../components/Tweet';
import { useAppStore } from '../store/appStore';

const TIME_PERIODS = [
  { id: 'last24h', label: 'Last 24h' },
  { id: 'last7d', label: 'Last 7d' },
  { id: 'last30d', label: 'Last 30d' },
];

const CONTENT_TYPES = [
  { id: 'likes', label: 'Most Likes', icon: Heart },
  { id: 'replies', label: 'Most Replies', icon: MessageCircle },
  { id: 'quotes', label: 'Most Quotes', icon: Repeat2 },
];

export const InspirationScreen = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const tweets = useAppStore((state) => state.tweets);
  
  const [timePeriod, setTimePeriod] = useState('last24h');
  const [contentType, setContentType] = useState('likes');

  // Generate placeholder filtered tweets based on selections
  const getFilteredTweets = () => {
    if (!tweets || tweets.length === 0) {
      return [];
    }
    
    // Return a subset of tweets based on current filters
    // In a real app, these would be sorted by engagement metrics
    return tweets.slice(0, 8);
  };

  const filteredTweets = getFilteredTweets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}> 
        <TouchableOpacity style={styles.backButton} activeOpacity={0.84} onPress={onBack}>
          <ArrowLeft size={28} color="#f2f2f2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inspiration</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Time Period Tabs */}
      <View style={styles.timePeriodsWrap}>
        {TIME_PERIODS.map((period) => (
          <TouchableOpacity
            key={period.id}
            style={[
              styles.timeTab,
              timePeriod === period.id && styles.timeTabActive,
            ]}
            activeOpacity={0.84}
            onPress={() => setTimePeriod(period.id)}
          >
            <Text
              style={[
                styles.timeTabLabel,
                timePeriod === period.id && styles.timeTabLabelActive,
              ]}
            >
              {period.label}
            </Text>
            {timePeriod === period.id && <View style={styles.timeTabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Content Type Pills */}
      <View style={styles.contentTypesWrap}>
        {CONTENT_TYPES.map((type) => {
          const Icon = type.icon;
          const isActive = contentType === type.id;
          return (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.contentTypePill,
                isActive && styles.contentTypePillActive,
              ]}
              activeOpacity={0.84}
              onPress={() => setContentType(type.id)}
            >
              <Icon
                size={20}
                color={isActive ? '#fff' : '#708a95'}
                strokeWidth={2}
                style={styles.pillIcon}
              />
              <Text
                style={[
                  styles.pillLabel,
                  isActive && styles.pillLabelActive,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tweet Feed */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {filteredTweets.length > 0 ? (
          filteredTweets.map((tweet) => (
            <Tweet key={tweet.id} tweet={tweet} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No posts yet</Text>
            <Text style={styles.emptyStateText}>
              Check back later for top posts from {TIME_PERIODS.find(p => p.id === timePeriod)?.label.toLowerCase()}
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
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#f2f2f2',
    fontSize: 41 / 2,
    fontWeight: '700',
    marginRight: 36,
  },
  headerSpacer: {
    width: 36,
  },
  timePeriodsWrap: {
    borderBottomWidth: 1,
    borderBottomColor: '#2f3336',
    paddingHorizontal: 16,
  },
  timeTab: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginRight: 24,
  },
  timeTabActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#1d9bf0',
  },
  timeTabLabel: {
    color: '#71767b',
    fontSize: 38 / 2,
    fontWeight: '600',
  },
  timeTabLabelActive: {
    color: '#f2f2f2',
  },
  timeTabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#1d9bf0',
    borderRadius: 999,
  },
  contentTypesWrap: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  contentTypePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2f3336',
    backgroundColor: 'transparent',
  },
  contentTypePillActive: {
    backgroundColor: '#1d9bf0',
    borderColor: '#1d9bf0',
  },
  pillIcon: {
    marginRight: 6,
  },
  pillLabel: {
    color: '#71767b',
    fontSize: 38 / 2,
    fontWeight: '700',
  },
  pillLabelActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 80,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f2f2f2',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#71767b',
    textAlign: 'center',
    maxWidth: 280,
  },
});
