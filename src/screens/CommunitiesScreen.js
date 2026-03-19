import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { Search, UsersRound } from 'lucide-react-native/icons';
import { AppHeader } from '../components/AppHeader';
import { useAppStore } from '../store/appStore';

const HOME_LIST = [
  {
    id: 'design-sphere',
    name: 'The Design Sphere',
    members: '657K Members',
    category: 'Design',
    description: 'A place for UI inspiration, critique, and portfolio growth.',
  },
  {
    id: 'x-feedback',
    name: 'X Communities Feedback',
    members: '530K Members',
    category: 'X Official',
    description: 'Share product feedback and discuss upcoming platform updates.',
  },
  {
    id: 'apple',
    name: 'Apple',
    members: '612K Members',
    category: 'Technology',
    description: 'Talk hardware, software releases, and ecosystem tips.',
  },
];

const EXPLORE_TAGS = [
  'Sports',
  'Technology',
  'Art',
  'Entertainment',
  'Gaming',
  'Politics',
  'Business',
  'Culture',
];

export const CommunitiesScreen = ({ onOpenDrawer }) => {
  const displayMode = useAppStore((state) => state.displayMode);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const systemScheme = useColorScheme();
  const isDark = displayMode === 'night' || (displayMode === 'system' && systemScheme === 'dark');
  const textScale = [0.92, 1, 1.08, 1.16][fontScaleLevel] || 1;
  const iconScale = [0.9, 1, 1.1, 1.2][fontScaleLevel] || 1;

  const palette = isDark
    ? {
        bg: '#000000',
        panel: '#0b0f16',
        title: '#e7e9ea',
        body: '#71767b',
        border: '#2f3336',
        cardBorder: '#16181c',
        chipBg: '#0b0f16',
        joinBg: '#ffffff',
        joinText: '#0f1419',
      }
    : {
        bg: '#ffffff',
        panel: '#f7f9fb',
        title: '#0f1419',
        body: '#536471',
        border: '#d8e0e5',
        cardBorder: '#eff3f4',
        chipBg: '#ffffff',
        joinBg: '#0f1419',
        joinText: '#ffffff',
      };

  const [viewState, setViewState] = useState({
    tab: 'home',
    selectedCategory: EXPLORE_TAGS[0],
  });

  const { tab, selectedCategory } = viewState;

  const handleTabChange = (nextTab) => {
    setViewState((prev) => ({ ...prev, tab: nextTab }));
  };

  const handleCategoryChange = (nextCategory) => {
    setViewState((prev) => ({ ...prev, selectedCategory: nextCategory }));
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}> 
      <View style={styles.headerWrap}>
        <AppHeader title="Communities" centered onOpenDrawer={onOpenDrawer} />
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
            <Search size={25 * iconScale} color={palette.title} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
            <UsersRound size={25 * iconScale} color={palette.title} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.tabBar, { borderBottomColor: palette.border }]}> 
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => handleTabChange('home')}
        >
          <Text style={[styles.tabLabel, { color: palette.body, fontSize: 18 * textScale }, tab === 'home' && styles.tabLabelActive, tab === 'home' && { color: palette.title }]}>Home</Text>
          {tab === 'home' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => handleTabChange('explore')}
        >
          <Text style={[styles.tabLabel, { color: palette.body, fontSize: 18 * textScale }, tab === 'explore' && styles.tabLabelActive, tab === 'explore' && { color: palette.title }]}>Explore</Text>
          {tab === 'explore' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {tab === 'home' ? (
          <View style={styles.section}>
            <View style={styles.filterRow}>
              <TouchableOpacity style={styles.trendingChip} activeOpacity={0.85}>
                <Text style={[styles.trendingChipText, { color: palette.title, fontSize: 14 * textScale }]}>Trending</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.rowBetween}>
              <Text style={[styles.sectionTitle, { color: palette.title, fontSize: 34 * textScale }]}>Discover new Communities</Text>
              <Text style={[styles.muted, { color: palette.body, fontSize: 22 * textScale }]}>...</Text>
            </View>

            {HOME_LIST.map((item) => (
              <View key={item.id} style={[styles.communityCard, { borderBottomColor: palette.cardBorder }]}> 
                <View style={[styles.communityAvatar, { backgroundColor: palette.panel, borderColor: palette.border }]}> 
                  <Text style={[styles.communityAvatarText, { color: palette.title, fontSize: 20 * textScale }]}>{item.name.charAt(0)}</Text>
                </View>
                <View style={styles.communityMeta}>
                  <Text style={[styles.communityName, { color: palette.title, fontSize: 18 * textScale }]}>{item.name}</Text>
                  <Text style={[styles.communityMembers, { color: palette.body, fontSize: 14 * textScale }]}>{item.members}</Text>
                  <Text style={[styles.communityCategory, { color: palette.body, fontSize: 13 * textScale }]}>{item.category}</Text>
                  <Text style={[styles.communityDescription, { color: palette.body, fontSize: 13 * textScale }]}>{item.description}</Text>
                </View>
                <View style={styles.joinWrap}>
                  <TouchableOpacity style={[styles.joinButton, { borderColor: palette.border, backgroundColor: palette.joinBg }]} activeOpacity={0.85}>
                    <Text style={[styles.joinButtonText, { color: palette.joinText, fontSize: 13 * textScale }]}>Join</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.linkButton} activeOpacity={0.8}>
              <Text style={[styles.linkText, { fontSize: 16 * textScale }]}>Show more</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.section}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagRow}
            >
              {EXPLORE_TAGS.map((tag) => {
                const active = selectedCategory === tag;
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.tagChip, { borderColor: palette.border, backgroundColor: palette.bg }, active && styles.tagChipActive]}
                    onPress={() => handleCategoryChange(tag)}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.tagText, { color: palette.title, fontSize: 14 * textScale }, active && styles.tagTextActive]}>{tag}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={[styles.placeholderPost, { borderColor: palette.border, backgroundColor: palette.panel }]}> 
              <Text style={[styles.placeholderTitle, { color: palette.title, fontSize: 16 * textScale }]}>{selectedCategory} Highlights</Text>
              <Text style={[styles.placeholderText, { color: palette.body, fontSize: 14 * textScale, lineHeight: 20 * textScale }]}>
                Placeholder feed cards for {selectedCategory} communities will appear here.
              </Text>
            </View>

            <View style={[styles.placeholderPost, { borderColor: palette.border, backgroundColor: palette.panel }]}> 
              <Text style={[styles.placeholderTitle, { color: palette.title, fontSize: 16 * textScale }]}>Trending in {selectedCategory}</Text>
              <Text style={[styles.placeholderText, { color: palette.body, fontSize: 14 * textScale, lineHeight: 20 * textScale }]}>
                Placeholder trending topics, featured spaces, and pinned threads.
              </Text>
            </View>

            <View style={[styles.placeholderPost, { borderColor: palette.border, backgroundColor: palette.panel }]}> 
              <Text style={[styles.placeholderTitle, { color: palette.title, fontSize: 16 * textScale }]}>Recommended Communities</Text>
              <Text style={[styles.placeholderText, { color: palette.body, fontSize: 14 * textScale, lineHeight: 20 * textScale }]}>
                Placeholder recommendation tiles for users interested in {selectedCategory}.
              </Text>
            </View>
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
  headerWrap: {
    position: 'relative',
  },
  headerActions: {
    position: 'absolute',
    right: 14,
    bottom: 9,
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#2f3336',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  tabLabel: {
    color: '#71767b',
    fontSize: 18,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: '#e7e9ea',
  },
  tabIndicator: {
    marginTop: 7,
    height: 3,
    width: 84,
    borderRadius: 999,
    backgroundColor: '#1d9bf0',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingBottom: 30,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  filterRow: {
    flexDirection: 'row',
  },
  trendingChip: {
    borderWidth: 1,
    borderColor: '#2f3336',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#0b0f16',
  },
  trendingChipText: {
    color: '#e7e9ea',
    fontSize: 14,
    fontWeight: '700',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#e7e9ea',
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
    flex: 1,
  },
  muted: {
    color: '#71767b',
    fontSize: 22,
    fontWeight: '700',
  },
  communityCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#16181c',
    paddingBottom: 13,
  },
  communityAvatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#12171f',
    borderWidth: 1,
    borderColor: '#2f3336',
    alignItems: 'center',
    justifyContent: 'center',
  },
  communityAvatarText: {
    color: '#e7e9ea',
    fontSize: 20,
    fontWeight: '700',
  },
  communityMeta: {
    flex: 1,
  },
  communityName: {
    color: '#e7e9ea',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  communityMembers: {
    color: '#71767b',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  communityCategory: {
    color: '#8b98a5',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  communityDescription: {
    color: '#8b98a5',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  joinWrap: {
    paddingTop: 4,
  },
  joinButton: {
    borderWidth: 1,
    borderColor: '#2f3336',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#fff',
  },
  joinButtonText: {
    color: '#0f1419',
    fontSize: 13,
    fontWeight: '700',
  },
  linkButton: {
    paddingTop: 4,
  },
  linkText: {
    color: '#1d9bf0',
    fontSize: 16,
    fontWeight: '500',
  },
  tagRow: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 4,
  },
  tagChip: {
    borderWidth: 1,
    borderColor: '#2f3336',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#000',
  },
  tagChipActive: {
    borderColor: '#1d9bf0',
    backgroundColor: 'rgba(29, 155, 240, 0.14)',
  },
  tagText: {
    color: '#e7e9ea',
    fontSize: 14,
    fontWeight: '700',
  },
  tagTextActive: {
    color: '#bfe2ff',
  },
  placeholderPost: {
    borderWidth: 1,
    borderColor: '#2f3336',
    borderRadius: 14,
    padding: 16,
    backgroundColor: '#0b0f16',
  },
  placeholderTitle: {
    color: '#e7e9ea',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  placeholderText: {
    color: '#71767b',
    fontSize: 14,
    lineHeight: 20,
  },
});