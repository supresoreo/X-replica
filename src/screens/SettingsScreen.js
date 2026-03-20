import React from 'react';
import { ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { styles } from '../styles/screens/SettingsScreen.styles';
import {
  ArrowLeft,
  BadgeCheck,
  Bell,
  ChevronRight,
  Lock,
  Search,
  Settings,
  UserRound,
} from 'lucide-react-native/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/appStore';

const SETTINGS_ITEMS = [
  {
    key: 'your-account',
    title: 'Your account',
    description:
      'See information about your account, download an archive of your data, or learn about your account deactivation options.',
    icon: UserRound,
  },
  {
    key: 'security',
    title: 'Security and account access',
    description:
      "Manage your account's security and keep track of your account's usage including apps that you have connected to your account.",
    icon: Lock,
  },
  {
    key: 'premium',
    title: 'Premium',
    description: 'Manage your subscription features including Undo post timing.',
    icon: BadgeCheck,
  },
  {
    key: 'timeline',
    title: 'Timeline',
    description: 'Configure your timeline appearance and interactions',
    icon: Settings,
  },
  {
    key: 'privacy-safety',
    title: 'Privacy and safety',
    description: 'Manage what information you see and share on X.',
    icon: Lock,
  },
  {
    key: 'notifications',
    title: 'Notifications',
    description:
      'Select the kinds of notifications you get about your activities, interests, and recommendations.',
    icon: Bell,
  },
  {
    key: 'accessibility-display-languages',
    title: 'Accessibility, display, and languages',
    description: 'Manage how X content is displayed to you.',
    icon: Settings,
    route: 'accessibility-display-languages',
  },
  {
    key: 'additional-resources',
    title: 'Additional resources',
    description:
      'Check out other places for helpful information to learn more about X products and services.',
    icon: Search,
  },
];

export const SettingsScreen = ({ onBack, onOpenAccessibilityDisplayLanguages }) => {
  const insets = useSafeAreaInsets();
  const currentUser = useAppStore((state) => state.currentUser);
  const displayMode = useAppStore((state) => state.displayMode);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const systemScheme = useColorScheme();
  const isDark = displayMode === 'night' || (displayMode === 'system' && systemScheme === 'dark');
  const textScale = [0.92, 1, 1.08, 1.16][fontScaleLevel] || 1;
  const iconScale = [0.9, 1, 1.1, 1.2][fontScaleLevel] || 1;
  const palette = isDark
    ? {
        bg: '#000',
        surface: '#1b1f2a',
        textPrimary: '#f2f2f2',
        textSecondary: '#6f7a83',
        icon: '#8d949b',
        chevron: '#444c55',
      }
    : {
        bg: '#fff',
        surface: '#eef2f7',
        textPrimary: '#0f1419',
        textSecondary: '#536471',
        icon: '#5c6670',
        chevron: '#8b98a5',
      };

  const handlePress = (item) => {
    if (item.route === 'accessibility-display-languages') {
      onOpenAccessibilityDisplayLanguages?.();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}> 
        <TouchableOpacity style={styles.backButton} activeOpacity={0.85} onPress={onBack}>
          <ArrowLeft size={27 * iconScale} color={palette.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={[styles.title, { color: palette.textPrimary, fontSize: 20 * textScale }]}>Settings</Text>
          <Text style={[styles.username, { color: palette.textSecondary, fontSize: 16 * textScale }]}>{currentUser?.username || '@user'}</Text>
        </View>
        <View style={styles.rightSpacer} />
      </View>

      <View style={[styles.searchWrap, { backgroundColor: palette.surface }]}>
        <Search size={20 * iconScale} color={palette.textSecondary} />
        <Text style={[styles.searchText, { color: palette.textSecondary, fontSize: 17.5 * textScale }]}>Search settings</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {SETTINGS_ITEMS.map((item) => {
          const Icon = item.icon;
          const isInteractive = Boolean(item.route);

          return (
            <TouchableOpacity
              key={item.key}
              activeOpacity={isInteractive ? 0.82 : 1}
              style={styles.itemRow}
              onPress={() => handlePress(item)}
            >
              <Icon size={24 * iconScale} color={palette.icon} strokeWidth={2} />
              <View style={styles.itemTextWrap}>
                <Text style={[styles.itemTitle, { color: palette.textPrimary, fontSize: 18.5 * textScale }]}>{item.title}</Text>
                <Text style={[styles.itemDescription, { color: palette.textSecondary, fontSize: 16.5 * textScale }]}>{item.description}</Text>
              </View>
              <ChevronRight size={22 * iconScale} color={palette.chevron} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
