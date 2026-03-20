import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerWrap: {
    position: 'relative',
  },
  headerActions: {
    position: 'absolute',
    right: 14,
    bottom: 9,
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#2f3336',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  tabLabel: {
    color: '#71767b',
    fontSize: 18,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: '#e7e9ea',
  },
  tabIndicator: {
    marginTop: 7,
    height: 3,
    width: 84,
    borderRadius: 999,
    backgroundColor: '#1d9bf0',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingBottom: 30,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  filterRow: {
    flexDirection: 'row',
  },
  trendingChip: {
    borderWidth: 1,
    borderColor: '#2f3336',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#0b0f16',
  },
  trendingChipText: {
    color: '#e7e9ea',
    fontSize: 14,
    fontWeight: '700',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#e7e9ea',
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
    flex: 1,
  },
  muted: {
    color: '#71767b',
    fontSize: 22,
    fontWeight: '700',
  },
  communityCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#16181c',
    paddingBottom: 13,
  },
  communityAvatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#12171f',
    borderWidth: 1,
    borderColor: '#2f3336',
    alignItems: 'center',
    justifyContent: 'center',
  },
  communityAvatarText: {
    color: '#e7e9ea',
    fontSize: 20,
    fontWeight: '700',
  },
  communityMeta: {
    flex: 1,
  },
  communityName: {
    color: '#e7e9ea',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  communityMembers: {
    color: '#71767b',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  communityCategory: {
    color: '#8b98a5',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  communityDescription: {
    color: '#8b98a5',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  joinWrap: {
    paddingTop: 4,
  },
  joinButton: {
    borderWidth: 1,
    borderColor: '#2f3336',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#fff',
  },
  joinButtonText: {
    color: '#0f1419',
    fontSize: 13,
    fontWeight: '700',
  },
  linkButton: {
    paddingTop: 4,
  },
  linkText: {
    color: '#1d9bf0',
    fontSize: 16,
    fontWeight: '500',
  },
  tagRow: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 4,
  },
  tagChip: {
    borderWidth: 1,
    borderColor: '#2f3336',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#000',
  },
  tagChipActive: {
    borderColor: '#1d9bf0',
    backgroundColor: 'rgba(29, 155, 240, 0.14)',
  },
  tagText: {
    color: '#e7e9ea',
    fontSize: 14,
    fontWeight: '700',
  },
  tagTextActive: {
    color: '#bfe2ff',
  },
  placeholderPost: {
    borderWidth: 1,
    borderColor: '#2f3336',
    borderRadius: 14,
    padding: 16,
    backgroundColor: '#0b0f16',
  },
  placeholderTitle: {
    color: '#e7e9ea',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  placeholderText: {
    color: '#71767b',
    fontSize: 14,
    lineHeight: 20,
  },
});
