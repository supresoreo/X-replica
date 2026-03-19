import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { ArrowLeft, ChevronRight, CircleQuestionMark } from 'lucide-react-native/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/appStore';

const placeholderCards = [
  {
    id: 'paid-to-post',
    title: 'Get paid to post',
    description:
      'Earn from sharing high quality content. The more you engage users on X, the more you earn.',
  },
  {
    id: 'build-fanbase',
    title: 'Build a fanbase',
    description:
      'Offer exclusive content to your biggest supporters and earn recurring revenue with placeholder-only program cards.',
  },
];

export const CreatorProgramScreen = ({ program = 'revenue', onBack }) => {
  const insets = useSafeAreaInsets();
  const isRevenue = program === 'revenue';
  const displayMode = useAppStore((state) => state.displayMode);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const systemScheme = useColorScheme();
  const isDark = displayMode === 'night' || (displayMode === 'system' && systemScheme === 'dark');
  const textScale = [0.92, 1, 1.08, 1.16][fontScaleLevel] || 1;
  const iconScale = [0.9, 1, 1.1, 1.2][fontScaleLevel] || 1;

  const palette = isDark
    ? {
        bg: '#000000',
        title: '#f3f3f3',
        body: '#767f87',
        buttonBg: '#f5f5f5',
        buttonText: '#0f1113',
        border: '#2f3336',
      }
    : {
        bg: '#ffffff',
        title: '#0f1419',
        body: '#536471',
        buttonBg: '#0f1419',
        buttonText: '#ffffff',
        border: '#d8e0e5',
      };

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}> 
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}> 
        <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.84} onPress={onBack}>
          <ArrowLeft size={29 * iconScale} color={palette.title} />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
        <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.84}>
          <CircleQuestionMark size={29 * iconScale} color={palette.title} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <Text style={[styles.title, { color: palette.title, fontSize: (56 / 2) * textScale }]}>Make money on X</Text>
        <Text style={[styles.subtitle, { color: palette.body, fontSize: (48 / 2) * textScale, lineHeight: 34 * textScale }]}>
          The first step to monetization is getting Verified with X Premium.
        </Text>

        <TouchableOpacity style={[styles.ctaButton, { backgroundColor: palette.buttonBg }]} activeOpacity={0.88}>
          <Text style={[styles.ctaButtonText, { color: palette.buttonText, fontSize: (43 / 2) * textScale }]}>Become a Premium Creator</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} activeOpacity={0.84}>
          <Text style={[styles.linkText, { fontSize: (44 / 2) * textScale }]}>
            {isRevenue ? 'Check Revenue Sharing eligibility' : 'Check Subscriptions eligibility'}
          </Text>
          <ChevronRight size={24 * iconScale} color="#1d9bf0" />
        </TouchableOpacity>

        {placeholderCards.map((card) => (
          <View key={card.id} style={[styles.card, { borderColor: palette.border }]}>
            <Text style={[styles.cardTitle, { color: palette.title, fontSize: (52 / 2) * textScale }]}>{card.title}</Text>
            <Text style={[styles.cardDescription, { color: palette.body, fontSize: (42 / 2) * textScale, lineHeight: 28 * textScale }]}>{card.description}</Text>

            <View style={styles.cardMediaPlaceholder}>
              <View style={styles.mockPhone}>
                <View style={styles.mockBanner}>
                  <Text style={[styles.mockBannerTitle, { fontSize: (32 / 2) * textScale }]}>You got paid!</Text>
                  <Text style={[styles.mockBannerAmount, { fontSize: (30 / 2) * textScale }]}>$816.54 has been deposited into your account.</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
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
    justifyContent: 'space-between',
  },
  headerIconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: 16,
    paddingTop: 38,
    paddingBottom: 110,
  },
  title: {
    color: '#f3f3f3',
    fontSize: 56 / 2,
    textAlign: 'center',
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: '#767f87',
    fontSize: 48 / 2,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 24,
  },
  ctaButton: {
    height: 58,
    backgroundColor: '#f5f5f5',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  ctaButtonText: {
    color: '#0f1113',
    fontSize: 43 / 2,
    fontWeight: '700',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  linkText: {
    color: '#1d9bf0',
    fontSize: 44 / 2,
    fontWeight: '500',
  },
  card: {
    borderWidth: 1,
    borderColor: '#2f3336',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: {
    color: '#f2f2f2',
    fontSize: 52 / 2,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardDescription: {
    color: '#7a838b',
    fontSize: 42 / 2,
    lineHeight: 28,
    marginBottom: 14,
  },
  cardMediaPlaceholder: {
    height: 290,
    borderRadius: 16,
    backgroundColor: '#020615',
    borderWidth: 1,
    borderColor: '#0f1525',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mockPhone: {
    width: '80%',
    height: '78%',
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#4a4f58',
    backgroundColor: '#05070b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockBanner: {
    width: '110%',
    borderRadius: 12,
    backgroundColor: '#272932',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  mockBannerTitle: {
    color: '#f2f2f2',
    fontSize: 32 / 2,
    fontWeight: '700',
    marginBottom: 4,
  },
  mockBannerAmount: {
    color: '#adb3be',
    fontSize: 30 / 2,
  },
});