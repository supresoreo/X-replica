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
    borderRadius: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0f1419',
  },
  results: {
    flex: 1,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#536471',
    fontWeight: '500',
  },
  errorTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f91880',
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: '#536471',
    textAlign: 'center',
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f1419',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: '#536471',
    textAlign: 'center',
    maxWidth: 280,
  },
  section: {
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f1419',
    marginTop: 20,
    marginBottom: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  userDetails: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f1419',
  },
  userHandle: {
    fontSize: 13,
    color: '#536471',
    marginTop: 2,
  },
  userBio: {
    fontSize: 13,
    color: '#536471',
    marginTop: 4,
  },
  followButton: {
    backgroundColor: '#0f1419',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 8,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  unfollowButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cfd9de',
  },
  unfollowButtonText: {
    color: '#0f1419',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  clearHistoryText: {
    fontSize: 14,
    color: '#1d9bf0',
    fontWeight: '600',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  historyText: {
    fontSize: 15,
    color: '#536471',
    marginLeft: 16,
  },
});
