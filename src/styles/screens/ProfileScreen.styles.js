import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  banner: {
    height: 150,
    backgroundColor: '#cfd9de',
  },
  bannerImage: {
    resizeMode: 'cover',
  },
  profileInfo: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  avatarCircle: {
    marginTop: -38,
    marginBottom: 10,
  },
  editButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cfd9de',
  },
  actionButtonsGroup: {
    position: 'absolute',
    right: 15,
    top: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#cfd9de',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#0f1419',
    fontWeight: 'bold',
  },
  displayName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f1419',
  },
  username: {
    fontSize: 15,
    color: '#536471',
    marginBottom: 10,
  },
  bio: {
    fontSize: 15,
    color: '#0f1419',
    marginBottom: 10,
  },
  profileMeta: {
    marginBottom: 15,
    gap: 8,
  },
  metaItem: {
    fontSize: 14,
    color: '#536471',
  },
  stats: {
    flexDirection: 'row',
    gap: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#0f1419',
  },
  statLabel: {
    color: '#536471',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  tabText: {
    color: '#536471',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#0f1419',
    fontWeight: 'bold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '100%',
    backgroundColor: '#000',
  },
  suggestionsSection: {
    padding: 15,
    gap: 16,
  },
  suggestionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f1419',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  suggestionDetails: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f1419',
  },
  suggestionUsername: {
    fontSize: 14,
    color: '#536471',
    marginBottom: 4,
  },
  suggestionBio: {
    fontSize: 14,
    lineHeight: 20,
    color: '#0f1419',
  },
  followButton: {
    minWidth: 90,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#0f1419',
    alignItems: 'center',
  },
  unfollowButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cfd9de',
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  unfollowButtonText: {
    color: '#0f1419',
  },
});
