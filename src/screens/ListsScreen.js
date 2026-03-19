import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { ArrowLeft, Ellipsis, Search, ListPlus, Lock, Pin } from 'lucide-react-native/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/appStore';

const DISCOVER_LISTS = [
  {
    id: 'portal-news',
    title: 'Portal News',
    members: '40 members',
    followers: '203 followers including @ming...',
    color: '#8fd8fb',
  },
  {
    id: 'ults',
    title: 'ULTS',
    members: '24 members',
    followers: '2.3K followers including @heol...',
    color: '#7f8894',
  },
  {
    id: 'k-pop',
    title: 'K-pop',
    members: '23 members',
    followers: '2.8K followers including @jor2...',
    color: '#13d7c7',
  },
];

const FOLLOW_AVATARS = ['#f6c0a2', '#d9dde4', '#888f98'];

export const ListsScreen = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const displayMode = useAppStore((state) => state.displayMode);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const systemScheme = useColorScheme();
  const isDark = displayMode === 'night' || (displayMode === 'system' && systemScheme === 'dark');
  const textScale = [0.92, 1, 1.08, 1.16][fontScaleLevel] || 1;
  const iconScale = [0.9, 1, 1.1, 1.2][fontScaleLevel] || 1;

  const palette = isDark
    ? {
        bg: '#000000',
        panel: '#1d222e',
        title: '#f2f2f2',
        body: '#8b98a5',
        border: '#1f2428',
        buttonBg: '#f7f9f9',
        buttonText: '#0f1419',
      }
    : {
        bg: '#ffffff',
        panel: '#eff3f4',
        title: '#0f1419',
        body: '#536471',
        border: '#d8e0e5',
        buttonBg: '#0f1419',
        buttonText: '#ffffff',
      };

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}> 
      <View style={[styles.headerRow, { paddingTop: insets.top + 8 }]}> 
        <TouchableOpacity style={styles.topIconButton} activeOpacity={0.82} onPress={onBack}>
          <ArrowLeft size={27 * iconScale} color={palette.title} />
        </TouchableOpacity>

        <View style={[styles.searchBar, { backgroundColor: palette.panel }]}> 
          <Search size={22 * iconScale} color={palette.body} />
          <Text style={[styles.searchPlaceholder, { color: palette.body, fontSize: (40 / 2) * textScale }]}>Search Lists</Text>
        </View>

        <TouchableOpacity style={styles.topIconButton} activeOpacity={0.82}>
          <Ellipsis size={27 * iconScale} color={palette.title} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <Text style={[styles.sectionTitle, { color: palette.title, fontSize: (50 / 2) * textScale }]}>Discover new Lists</Text>

        {DISCOVER_LISTS.map((item) => (
          <View key={item.id} style={styles.listRow}>
            <View style={[styles.listIcon, { backgroundColor: item.color }]}> 
              <View style={styles.iconGlyph} />
            </View>

            <View style={styles.listMetaWrap}>
              <Text style={[styles.listTitle, { color: palette.title, fontSize: (39 / 2) * textScale }]} numberOfLines={1}>
                {item.title}
                <Text style={[styles.listMetaMuted, { color: palette.body }]}> · {item.members}</Text>
              </Text>

              <View style={styles.followersRow}>
                <View style={styles.avatarStack}>
                  {FOLLOW_AVATARS.map((avatarColor, index) => (
                    <View
                      key={`${item.id}-avatar-${index}`}
                      style={[
                        styles.miniAvatar,
                        {
                          backgroundColor: avatarColor,
                          marginLeft: index === 0 ? 0 : -8,
                        },
                      ]}
                    />
                  ))}
                </View>
                <Text style={[styles.followersText, { color: palette.body, fontSize: (34 / 2) * textScale }]} numberOfLines={1}>
                  {item.followers}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={[styles.followButton, { backgroundColor: palette.buttonBg }]} activeOpacity={0.88}>
              <Text style={[styles.followButtonText, { color: palette.buttonText, fontSize: 19 * textScale }]}>Follow</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.showMoreButton} activeOpacity={0.86}>
          <Text style={[styles.showMoreText, { fontSize: (38 / 2) * textScale }]}>Show more</Text>
        </TouchableOpacity>

        <View style={[styles.sectionDivider, { borderTopColor: palette.border }]} />

        <Text style={[styles.sectionTitle, { color: palette.title, fontSize: (50 / 2) * textScale }]}>Your Lists</Text>

        <View style={styles.listRow}>
          <View style={[styles.listIcon, { backgroundColor: '#7f4adb' }]}> 
            <View style={styles.iconGlyph} />
          </View>

          <View style={styles.listMetaWrap}>
            <View style={styles.privateTitleRow}>
              <Text style={[styles.listTitle, { color: palette.title, fontSize: (39 / 2) * textScale }]} numberOfLines={1}>
                :DDD
                <Text style={[styles.listMetaMuted, { color: palette.body }]}> · 2 members</Text>
              </Text>
              <Lock size={16 * iconScale} color={palette.body} />
            </View>

            <View style={styles.followersRow}>
              <View style={[styles.miniAvatar, { backgroundColor: '#f1d1b8' }]} />
              <Text style={[styles.followersText, { color: palette.body, fontSize: (34 / 2) * textScale }]} numberOfLines={1}>
                sj @kminjeong01
              </Text>
            </View>
          </View>

          <Pin size={20 * iconScale} color={palette.body} />
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 76 }]}
        activeOpacity={0.9}
      >
        <ListPlus size={29 * iconScale} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },
  topIconButton: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1d222e',
    borderRadius: 28,
    paddingHorizontal: 18,
    height: 52,
    gap: 10,
  },
  searchPlaceholder: {
    color: '#6d7b84',
    fontSize: 40 / 2,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingTop: 22,
    paddingBottom: 120,
  },
  sectionTitle: {
    color: '#e8eaed',
    fontSize: 50 / 2,
    fontWeight: '800',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listIcon: {
    width: 58,
    height: 58,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconGlyph: {
    width: 26,
    height: 34,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'rgba(32, 87, 118, 0.35)',
  },
  listMetaWrap: {
    flex: 1,
    marginLeft: 13,
    marginRight: 12,
  },
  listTitle: {
    color: '#f3f5f6',
    fontSize: 39 / 2,
    fontWeight: '700',
  },
  listMetaMuted: {
    color: '#7f8a91',
    fontWeight: '500',
  },
  followersRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  miniAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#000',
  },
  followersText: {
    color: '#6f7a83',
    fontSize: 34 / 2,
    flex: 1,
  },
  followButton: {
    backgroundColor: '#f7f9f9',
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 10,
  },
  followButtonText: {
    color: '#0f1419',
    fontSize: 19,
    fontWeight: '700',
  },
  showMoreButton: {
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  showMoreText: {
    color: '#1d9bf0',
    fontSize: 38 / 2,
    fontWeight: '500',
  },
  sectionDivider: {
    borderTopWidth: 1,
    borderTopColor: '#1f2428',
    marginBottom: 14,
  },
  privateTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#1d9bf0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
