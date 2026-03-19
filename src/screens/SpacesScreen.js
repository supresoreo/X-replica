import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { ArrowLeft, Ellipsis, Search, MicVocal } from 'lucide-react-native/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/appStore';

const SPACE_CARDS = [
  {
    id: 'iran-day-19',
    title: '🚨 BREAKING: IRAN DAY 19 | IRAN BOMBING SAUDI ARABIA OIL',
    listening: '2.4K listening',
    tags: [],
    hostName: 'DOC',
    hostRole: 'Speaker',
    hostBio: 'Attorney | Former Chiropractor | DMs & Comments not legal or medical advice | America First not MAGA |',
  },
  {
    id: 'joe-kent',
    title: 'JOE KENT ON TUCKER • KENT CONFIRMED BLOCKED KIRK ASSASSINATION BUTLER',
    listening: '760 listening',
    tags: ['US national news', 'World news', 'Twitter Spaces'],
    hostName: 'Diligent Denizen 🇺🇸',
    hostRole: 'Host',
    hostBio: 'Hosting Conversations That Shape History | YOU Decide the Narrative | Citizen Journalist | FOLLOW for REAL NE...',
  },
];

const sampleListeners = ['#7ea7cc', '#d9b995', '#30363f'];

export const SpacesScreen = ({ onBack }) => {
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
        body: '#6e7b84',
      }
    : {
        bg: '#ffffff',
        panel: '#eff3f4',
        title: '#0f1419',
        body: '#536471',
      };

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}> 
      <View style={[styles.headerTop, { paddingTop: insets.top + 8 }]}> 
        <TouchableOpacity style={styles.backButton} activeOpacity={0.82} onPress={onBack}>
          <ArrowLeft size={28 * iconScale} color={palette.title} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: palette.title, fontSize: (41 / 2) * textScale }]}>Spaces</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={[styles.searchWrap, { backgroundColor: palette.panel }]}>
        <Search size={22 * iconScale} color={palette.body} />
        <Text style={[styles.searchText, { color: palette.body, fontSize: (42 / 2) * textScale }]}>Search for a Space</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <Text style={[styles.happeningTitle, { color: palette.title, fontSize: (56 / 2) * textScale }]}>Happening Now</Text>
        <Text style={[styles.happeningSubtitle, { color: palette.body, fontSize: (42 / 2) * textScale }]}>Spaces going on right now</Text>

        {SPACE_CARDS.map((card) => (
          <View key={card.id} style={styles.spaceCard}>
            <View style={styles.cardTopRow}>
              <Text style={styles.liveLabel}>|▮▮▮ LIVE</Text>
              <TouchableOpacity activeOpacity={0.78}>
                <Ellipsis size={22 * iconScale} color="#f4f4f4" />
              </TouchableOpacity>
            </View>

            <Text style={[styles.cardTitle, { fontSize: (53 / 2) * textScale }]}>{card.title}</Text>

            {card.tags.length ? (
              <Text style={styles.cardTags}>{card.tags.join(' · ')}</Text>
            ) : null}

            <View style={styles.listenersRow}>
              <View style={styles.listenersStack}>
                {sampleListeners.map((color, index) => (
                  <View
                    key={`${card.id}-listener-${index}`}
                    style={[
                      styles.listenerAvatar,
                      { backgroundColor: color, marginLeft: index === 0 ? 0 : -9 },
                    ]}
                  />
                ))}
              </View>
              <Text style={[styles.listenersText, { fontSize: (42 / 2) * textScale }]}>{card.listening}</Text>
            </View>

            <View style={styles.hostPanel}>
              <View style={[styles.hostAvatar, { backgroundColor: '#9eb3c6' }]} />
              <View style={styles.hostMeta}>
                <View style={styles.hostTopLine}>
                  <Text style={[styles.hostName, { fontSize: 19 * textScale }]}>{card.hostName}</Text>
                  <View style={styles.roleBadge}>
                    <Text style={[styles.roleText, { fontSize: (17 / 1.2) * textScale }]}>{card.hostRole}</Text>
                  </View>
                </View>
                <Text style={[styles.hostBio, { fontSize: 18 * textScale, lineHeight: 24 * textScale }]}>{card.hostBio}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 74 }]}
        activeOpacity={0.88}
      >
        <MicVocal size={30 * iconScale} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
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
    color: '#f0f2f3',
    fontSize: 41 / 2,
    fontWeight: '700',
    marginRight: 36,
  },
  headerSpacer: {
    width: 36,
  },
  searchWrap: {
    marginTop: 10,
    marginHorizontal: 16,
    backgroundColor: '#1d222e',
    borderRadius: 24,
    height: 54,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchText: {
    color: '#6e7b84',
    fontSize: 42 / 2,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 110,
  },
  happeningTitle: {
    color: '#f4f6f7',
    fontSize: 56 / 2,
    fontWeight: '800',
    marginBottom: 2,
  },
  happeningSubtitle: {
    color: '#6f7b85',
    fontSize: 42 / 2,
    marginBottom: 18,
  },
  spaceCard: {
    backgroundColor: '#6f49e2',
    borderRadius: 18,
    paddingTop: 14,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  liveLabel: {
    color: '#f4f4f4',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 53 / 2,
    lineHeight: 34,
    fontWeight: '800',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  cardTags: {
    color: '#efeafd',
    fontSize: 38 / 2,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  listenersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  listenersStack: {
    flexDirection: 'row',
    marginRight: 8,
  },
  listenerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#6f49e2',
  },
  listenersText: {
    color: '#efeaff',
    fontSize: 42 / 2,
  },
  hostPanel: {
    backgroundColor: 'rgba(47, 25, 120, 0.45)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hostAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  hostMeta: {
    flex: 1,
  },
  hostTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  hostName: {
    color: '#f4f6ff',
    fontSize: 19,
    fontWeight: '700',
  },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  roleText: {
    color: '#f6f6ff',
    fontSize: 17 / 1.2,
    fontWeight: '600',
  },
  hostBio: {
    color: '#ebe7ff',
    fontSize: 18,
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#5f6fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
