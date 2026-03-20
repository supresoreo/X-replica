import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { styles } from '../styles/screens/InspirationScreen.styles';
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

export const InspirationScreen = ({ onBack, onOpenProfile, onOpenTweet }) => {
  const insets = useSafeAreaInsets();
  const tweets = useAppStore((state) => state.tweets);
  const displayMode = useAppStore((state) => state.displayMode);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const systemScheme = useColorScheme();
  const isDark = displayMode === 'night' || (displayMode === 'system' && systemScheme === 'dark');
  const textScale = [0.92, 1, 1.08, 1.16][fontScaleLevel] || 1;
  const iconScale = [0.9, 1, 1.1, 1.2][fontScaleLevel] || 1;

  const palette = isDark
    ? {
        bg: '#000000',
        title: '#f2f2f2',
        body: '#71767b',
        border: '#2f3336',
        pillBorder: '#2f3336',
        pillActiveText: '#ffffff',
      }
    : {
        bg: '#ffffff',
        title: '#0f1419',
        body: '#536471',
        border: '#d8e0e5',
        pillBorder: '#d8e0e5',
        pillActiveText: '#ffffff',
      };
  
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
    <View style={[styles.container, { backgroundColor: palette.bg }]}> 
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}> 
        <TouchableOpacity style={styles.backButton} activeOpacity={0.84} onPress={onBack}>
          <ArrowLeft size={28 * iconScale} color={palette.title} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: palette.title, fontSize: (41 / 2) * textScale }]}>Inspiration</Text>
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
                { color: palette.body, fontSize: (38 / 2) * textScale },
                timePeriod === period.id && styles.timeTabLabelActive,
                timePeriod === period.id && { color: palette.title },
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
                size={20 * iconScale}
                color={isActive ? palette.pillActiveText : palette.body}
                strokeWidth={2}
                style={styles.pillIcon}
              />
              <Text
                style={[
                  styles.pillLabel,
                  { color: palette.body, fontSize: (38 / 2) * textScale },
                  isActive && styles.pillLabelActive,
                  isActive && { color: palette.pillActiveText },
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
            <Tweet
              key={tweet.id}
              tweet={tweet}
              onPressProfile={onOpenProfile}
              onPressTweet={onOpenTweet}
              onPressMedia={onOpenTweet}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateTitle, { color: palette.title, fontSize: 24 * textScale }]}>No posts yet</Text>
            <Text style={[styles.emptyStateText, { color: palette.body, fontSize: 15 * textScale }]}> 
              Check back later for top posts from {TIME_PERIODS.find(p => p.id === timePeriod)?.label.toLowerCase()}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

