import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { styles } from '../styles/screens/CreatorProgramScreen.styles';
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

