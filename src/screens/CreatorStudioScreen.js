import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { styles } from '../styles/screens/CreatorStudioScreen.styles';
import {
  ArrowLeft,
  BarChart3,
  BadgeCheck,
  ChevronRight,
  CircleQuestionMark,
  Mail,
  Rocket,
  Sparkles,
} from 'lucide-react-native/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/appStore';

const creatorItems = {
  programs: [
    {
      key: 'revenue-sharing',
      title: 'Revenue Sharing',
      subtitle: 'Earn from your posts',
      icon: Rocket,
      badge: 'Ineligible',
    },
    {
      key: 'subscriptions',
      title: 'Subscriptions',
      subtitle: '',
      icon: BadgeCheck,
      badge: 'Ineligible',
    },
  ],
  tools: [
    {
      key: 'inspiration',
      title: 'Inspiration',
      subtitle: 'Top posts by engagement',
      icon: Sparkles,
    },
    {
      key: 'analytics',
      title: 'Analytics',
      subtitle: '',
      icon: BarChart3,
    },
  ],
  support: [
    {
      key: 'contact-support',
      title: 'Contact support',
      subtitle: '',
      icon: Mail,
    },
    {
      key: 'learn-more',
      title: 'Learn more',
      subtitle: '',
      icon: CircleQuestionMark,
    },
  ],
};

const Section = ({ title, children, palette, textScale }) => {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: palette.body, fontSize: (39 / 2) * textScale }]}>{title}</Text>
      {children}
    </View>
  );
};

const Row = ({ item, onPress, palette, textScale, iconScale }) => {
  const Icon = item.icon;
  const hasValidIcon = typeof Icon === 'function';
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.84} onPress={onPress}>
      <View style={styles.rowLeft}>
        {hasValidIcon ? (
          <Icon size={30 * iconScale} color={palette.title} strokeWidth={1.9} />
        ) : (
          <View style={[styles.iconFallback, { borderColor: palette.body }]} />
        )}
        <View style={styles.rowTextWrap}>
          <Text style={[styles.rowTitle, { color: palette.title, fontSize: (42 / 2) * textScale }]}>{item.title}</Text>
          {item.subtitle ? <Text style={[styles.rowSubtitle, { color: palette.body, fontSize: (37 / 2) * textScale }]}>{item.subtitle}</Text> : null}
        </View>
      </View>

      <View style={styles.rowRight}>
        {item.badge ? (
          <View style={[styles.badge, { backgroundColor: palette.badgeBg }]}>
            <Text style={[styles.badgeText, { color: palette.badgeText, fontSize: 17 * textScale }]}>{item.badge}</Text>
          </View>
        ) : null}
        <ChevronRight size={24 * iconScale} color={palette.body} />
      </View>
    </TouchableOpacity>
  );
};

export const CreatorStudioScreen = ({ onBack, onOpenRevenueSharing, onOpenSubscriptions, onOpenInspiration }) => {
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
        title: '#f2f2f2',
        body: '#767d84',
        badgeBg: '#232323',
        badgeText: '#dfdfdf',
      }
    : {
        bg: '#ffffff',
        title: '#0f1419',
        body: '#536471',
        badgeBg: '#eff3f4',
        badgeText: '#0f1419',
      };

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}> 
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}> 
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.84}>
          <ArrowLeft size={29 * iconScale} color={palette.title} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: palette.title, fontSize: (41 / 2) * textScale }]}>Creator Studio</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <Section title="Programs" palette={palette} textScale={textScale}>
          <Row item={creatorItems.programs[0]} onPress={onOpenRevenueSharing} palette={palette} textScale={textScale} iconScale={iconScale} />
          <Row item={creatorItems.programs[1]} onPress={onOpenSubscriptions} palette={palette} textScale={textScale} iconScale={iconScale} />
        </Section>

        <Section title="Tools" palette={palette} textScale={textScale}>
          <Row item={creatorItems.tools[0]} onPress={onOpenInspiration} palette={palette} textScale={textScale} iconScale={iconScale} />
          <Row item={creatorItems.tools[1]} onPress={() => {}} palette={palette} textScale={textScale} iconScale={iconScale} />
        </Section>

        <Section title="Support" palette={palette} textScale={textScale}>
          <Row item={creatorItems.support[0]} onPress={() => {}} palette={palette} textScale={textScale} iconScale={iconScale} />
          <Row item={creatorItems.support[1]} onPress={() => {}} palette={palette} textScale={textScale} iconScale={iconScale} />
        </Section>
      </ScrollView>
    </View>
  );
};

