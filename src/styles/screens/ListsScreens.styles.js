import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },
  topIconButton: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1d222e',
    borderRadius: 28,
    paddingHorizontal: 18,
    height: 52,
    gap: 10,
  },
  searchPlaceholder: {
    color: '#6d7b84',
    fontSize: 40 / 2,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingTop: 22,
    paddingBottom: 120,
  },
  sectionTitle: {
    color: '#e8eaed',
    fontSize: 50 / 2,
    fontWeight: '800',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listIcon: {
    width: 58,
    height: 58,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconGlyph: {
    width: 26,
    height: 34,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'rgba(32, 87, 118, 0.35)',
  },
  listMetaWrap: {
    flex: 1,
    marginLeft: 13,
    marginRight: 12,
  },
  listTitle: {
    color: '#f3f5f6',
    fontSize: 39 / 2,
    fontWeight: '700',
  },
  listMetaMuted: {
    color: '#7f8a91',
    fontWeight: '500',
  },
  followersRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  miniAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#000',
  },
  followersText: {
    color: '#6f7a83',
    fontSize: 34 / 2,
    flex: 1,
  },
  followButton: {
    backgroundColor: '#f7f9f9',
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 10,
  },
  followButtonText: {
    color: '#0f1419',
    fontSize: 19,
    fontWeight: '700',
  },
  showMoreButton: {
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  showMoreText: {
    color: '#1d9bf0',
    fontSize: 38 / 2,
    fontWeight: '500',
  },
  sectionDivider: {
    borderTopWidth: 1,
    borderTopColor: '#1f2428',
    marginBottom: 14,
  },
  privateTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#1d9bf0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
