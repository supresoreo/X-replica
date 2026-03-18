import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {
  BadgeCheck,
  Zap,
  BarChart3,
  Star,
  MessageCircle,
  TrendingUp,
  Edit,
  BookOpen,
  Download,
  Palette,
  Radio,
  AtSign,
  Rocket,
} from 'lucide-react-native/icons';
import { AppHeader } from '../components/AppHeader';

const TIERS = {
  basic: {
    id: 'basic',
    label: 'Basic',
    title: 'Subscribe to Premium',
    features: [
      {
        icon: Edit,
        title: 'Enhanced experience',
        description: 'Edit and write longer posts.',
      },
      {
        icon: BookOpen,
        title: 'Bookmark folders',
        description: 'Organize your saved posts into private collections',
      },
      {
        icon: Download,
        title: 'Download videos',
        description: 'Download your favorite videos and play them in the background',
      },
      {
        icon: Palette,
        title: 'Customization',
        description: 'Choose your favorite app icon, customize navigation and bookmark folders',
      },
    ],
    pricing: {
      monthly: { price: 129, currency: '₱' },
      annual: { price: 1320, perMonth: 110, currency: '₱' },
    },
  },
  premium: {
    id: 'premium',
    label: 'Premium',
    title: 'Save 50% on Premium',
    features: [
      {
        icon: BadgeCheck,
        title: 'Verified checkmark',
        description: 'Build credibility and protect your account from impersonators.',
      },
      {
        icon: Zap,
        title: 'Enhanced Grok access',
        description: 'Tag @Grok in replies, and unlock higher usage limits.',
      },
      {
        icon: BarChart3,
        title: 'Advanced analytics',
        description: 'Get insights into what works and doesn\'t with a full account analytics studio.',
        expandable: true,
      },
      {
        icon: Star,
        title: 'Less ads in your feeds',
        description: 'See approximately 50% less ads in the For Your & Following feed.',
      },
      {
        icon: MessageCircle,
        title: 'Boosted replies',
        description: 'Get more visibility and grow your reach.',
        expandable: true,
      },
    ],
    pricing: {
      monthly: { price: 175, strikethrough: 350, currency: '₱', duration: 'for 2 months', thenPrice: 350 },
      annual: { price: 3490, currency: '₱', perMonth: 110 },
    },
    discount: '50% off',
  },
  premiumPlus: {
    id: 'premiumPlus',
    label: 'Premium+',
    title: 'Save 50% on Premium+',
    features: [
      {
        icon: Radio,
        title: 'Fully ad-free',
        description: 'Experience X without any interruptions in For You, Following, and Replies.',
      },
      {
        icon: Zap,
        title: 'SuperGrok',
        description: 'The world\'s most powerful AI tool, worth $360 USD, included free with Premium+.',
        badge: 'NEW',
      },
      {
        icon: AtSign,
        title: 'Handle Marketplace',
        description: 'Secure your ideal handle (username).',
        badge: 'NEW',
      },
      {
        icon: TrendingUp,
        title: 'Highest reply boost',
        description: 'Get more visibility and grow your reach.',
        expandable: true,
      },
      {
        icon: Rocket,
        title: 'Radar Advanced Search',
        description: 'Find the first link to break trending stories.',
        expandable: true,
      },
    ],
    pricing: {
      monthly: { price: 1440, strikethrough: 2890, currency: '₱', duration: 'for 2 months', thenPrice: 2890 },
      annual: { price: 24990, currency: '₱', perMonth: 110 },
    },
    discount: '50% off',
  },
};

const FeatureItem = ({ icon: Icon, title, description, badge, expandable }) => (
  <View style={styles.featureRow}>
    {Icon && (
      <View style={styles.featureIcon}>
        <Icon size={24} color="#a8dadc" strokeWidth={1.5} />
      </View>
    )}
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
      {badge && <Text style={styles.badge}>{badge}</Text>}
    </View>
    {expandable && <Text style={styles.expandIcon}>›</Text>}
  </View>
);

export const PremiumScreen = ({ onOpenDrawer }) => {
  const [selectedTier, setSelectedTier] = useState('premium');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const scrollRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const currentTier = useMemo(() => TIERS[selectedTier], [selectedTier]);

  const handleTierChange = useCallback(
    (tierId) => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      setSelectedTier(tierId);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    },
    [fadeAnim]
  );

  const handleBillingCycleChange = useCallback((cycle) => {
    setBillingCycle(cycle);
  }, []);

  const pricing = useMemo(() => {
    return currentTier.pricing[billingCycle];
  }, [currentTier, billingCycle]);

  return (
    <View style={styles.container}>
      <AppHeader title="Premium" onOpenDrawer={onOpenDrawer} />

      <ScrollView
        ref={scrollRef}
        style={styles.content}
        scrollEventThrottle={16}
      >
        {/* X Logo */}
        <View style={styles.logoSection}>
          <Text style={styles.logo}>𝕏</Text>
          <Text style={styles.titleText}>
            {currentTier.title}
            {currentTier.discount && <Text style={styles.discountBadge}> {currentTier.discount}</Text>}
          </Text>
        </View>

        {/* Tier Tabs */}
        <View style={styles.tabsContainer}>
          {Object.values(TIERS).map((tier) => (
            <TouchableOpacity
              key={tier.id}
              style={[
                styles.tab,
                selectedTier === tier.id && styles.tabActive,
              ]}
              onPress={() => handleTierChange(tier.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabLabel,
                  selectedTier === tier.id && styles.tabLabelActive,
                ]}
              >
                {tier.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Features List */}
        <Animated.View style={[styles.featuresSection, { opacity: fadeAnim }]}>
          {currentTier.features.map((feature, index) => (
            <FeatureItem
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              badge={feature.badge}
              expandable={feature.expandable}
            />
          ))}
        </Animated.View>

        {/* Billing Cycle Toggle */}
        <View style={styles.billingToggleContainer}>
          <TouchableOpacity
            style={[
              styles.billingOption,
              billingCycle === 'monthly' && styles.billingOptionActive,
            ]}
            onPress={() => handleBillingCycleChange('monthly')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.billingLabel,
                billingCycle === 'monthly' && styles.billingLabelActive,
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.billingOption,
              billingCycle === 'annual' && styles.billingOptionActive,
            ]}
            onPress={() => handleBillingCycleChange('annual')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.billingLabel,
                billingCycle === 'annual' && styles.billingLabelActive,
              ]}
            >
              Annual
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pricing Card */}
        {pricing && (
        <View style={styles.pricingCard}>
          <View style={styles.priceRow}>
            {pricing && pricing.strikethrough && (
              <Text style={styles.strikethrough}>
                {pricing.currency}{pricing.strikethrough}
              </Text>
            )}
            {pricing && pricing.price && <Text style={styles.price}>
              {pricing.currency}{pricing.price}
            </Text>}
          </View>

          {pricing.duration && (
            <Text style={styles.duration}>{pricing.duration}</Text>
          )}
          {pricing.thenPrice && (
            <Text style={styles.thenPrice}>Then {pricing.currency}{pricing.thenPrice} / month</Text>
          )}
          {pricing.perMonth && (
            <Text style={styles.perMonthText}>{pricing.currency}{pricing.perMonth} / month</Text>
          )}
          {billingCycle === 'annual' && pricing.perMonth && (
            <Text style={styles.annualPerMonth}>{pricing.currency}{pricing.perMonth} / month</Text>
          )}
        </View>
        )}

        {/* Subscribe Button */}
        <TouchableOpacity style={styles.subscribeButton} activeOpacity={0.8}>
          <Text style={styles.subscribeButtonText}>Subscribe & pay</Text>
        </TouchableOpacity>

        {/* Terms */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By subscribing, you agree to our{' '}
            <Text style={styles.termsLink}>Purchaser Terms</Text>, and that subscriptions auto-renew until
            you cancel.{' '}
            <Text style={styles.termsLink}>Cancel anytime</Text>, at least 24 hours prior to
            renewal to avoid additional charges. Price subject to change.{' '}
            <Text style={styles.termsLink}>Manage your subscription</Text> through the platform you subscribed on.
          </Text>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  logoSection: {
    alignItems: 'center',
    marginVertical: 32,
  },
  logo: {
    fontSize: 64,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 16,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  discountBadge: {
    color: '#31a24c',
    fontWeight: '700',
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#536471',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  tabActive: {
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  tabLabelActive: {
    color: '#000',
  },
  featuresSection: {
    marginBottom: 32,
    gap: 20,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2f3336',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#192734',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    flexShrink: 0,
  },
  featureContent: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  featureDescription: {
    fontSize: 14,
    color: '#71767b',
    lineHeight: 20,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f91880',
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  expandIcon: {
    fontSize: 20,
    color: '#71767b',
    marginTop: 8,
  },
  billingToggleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  billingOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#536471',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  billingOptionActive: {
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  billingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  billingLabelActive: {
    color: '#000',
  },
  pricingCard: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    marginBottom: 20,
    gap: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  strikethrough: {
    fontSize: 18,
    color: '#71767b',
    textDecorationLine: 'line-through',
  },
  duration: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  thenPrice: {
    fontSize: 14,
    color: '#71767b',
  },
  perMonthText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  annualPerMonth: {
    fontSize: 13,
    color: '#71767b',
  },
  subscribeButton: {
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: 20,
  },
  subscribeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
  termsContainer: {
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  termsText: {
    fontSize: 12,
    color: '#71767b',
    lineHeight: 18,
  },
  termsLink: {
    color: '#1d9bf0',
    textDecorationLine: 'underline',
  },
  spacer: {
    height: 20,
  },
});
