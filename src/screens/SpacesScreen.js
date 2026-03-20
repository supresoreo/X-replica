import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { styles } from '../styles/screens/SpacesScreen.styles';
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

