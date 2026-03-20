import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff3f4',
    margin: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0f1419',
  },
  results: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: '#536471',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f1419',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#536471',
    textAlign: 'center',
  },
  section: {
    paddingTop: 6,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15,
  },
  clearHistoryText: {
    color: '#1d9bf0',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f1419',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  historyText: {
    color: '#0f1419',
    fontSize: 15,
    fontWeight: '500',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f1419',
  },
  userHandle: {
    fontSize: 14,
    color: '#536471',
    marginBottom: 4,
  },
  userBio: {
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
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f1419',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#536471',
    textAlign: 'center',
  },
});
