import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
