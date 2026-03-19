import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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

const Section = ({ title, children }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
};

const Row = ({ item, onPress }) => {
  const Icon = item.icon;
  const hasValidIcon = typeof Icon === 'function';
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.84} onPress={onPress}>
      <View style={styles.rowLeft}>
        {hasValidIcon ? (
          <Icon size={30} color="#f2f2f2" strokeWidth={1.9} />
        ) : (
          <View style={styles.iconFallback} />
        )}
        <View style={styles.rowTextWrap}>
          <Text style={styles.rowTitle}>{item.title}</Text>
          {item.subtitle ? <Text style={styles.rowSubtitle}>{item.subtitle}</Text> : null}
        </View>
      </View>

      <View style={styles.rowRight}>
        {item.badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        ) : null}
        <ChevronRight size={24} color="#4f555b" />
      </View>
    </TouchableOpacity>
  );
};

export const CreatorStudioScreen = ({ onBack, onOpenRevenueSharing, onOpenSubscriptions, onOpenInspiration }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}> 
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.84}>
          <ArrowLeft size={29} color="#f2f2f2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Creator Studio</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <Section title="Programs">
          <Row item={creatorItems.programs[0]} onPress={onOpenRevenueSharing} />
          <Row item={creatorItems.programs[1]} onPress={onOpenSubscriptions} />
        </Section>

        <Section title="Tools">
          <Row item={creatorItems.tools[0]} onPress={onOpenInspiration} />
          <Row item={creatorItems.tools[1]} onPress={() => {}} />
        </Section>

        <Section title="Support">
          <Row item={creatorItems.support[0]} onPress={() => {}} />
          <Row item={creatorItems.support[1]} onPress={() => {}} />
        </Section>
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
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 110,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    color: '#767d84',
    fontSize: 39 / 2,
    fontWeight: '700',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowTextWrap: {
    marginLeft: 14,
    flex: 1,
  },
  iconFallback: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#4f555b',
  },
  rowTitle: {
    color: '#f2f2f2',
    fontSize: 42 / 2,
    fontWeight: '700',
    marginBottom: 1,
  },
  rowSubtitle: {
    color: '#757c83',
    fontSize: 37 / 2,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    backgroundColor: '#232323',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: {
    color: '#dfdfdf',
    fontSize: 17,
    fontWeight: '700',
  },
});
