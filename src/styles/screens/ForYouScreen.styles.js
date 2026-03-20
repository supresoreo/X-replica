import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  feed: {
    flex: 1,
  },
  feedTabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  feedTabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 10,
  },
  feedTabText: {
    fontSize: 16,
    color: '#536471',
    fontWeight: '600',
  },
  feedTabTextActive: {
    color: '#0f1419',
    fontWeight: '800',
  },
  feedTabIndicator: {
    marginTop: 8,
    width: 54,
    height: 3,
    borderRadius: 3,
    backgroundColor: '#1d9bf0',
  },
  emptyState: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f1419',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#536471',
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1d9bf0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
