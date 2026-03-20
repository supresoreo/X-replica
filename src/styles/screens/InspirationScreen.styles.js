import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
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
  timePeriodsWrap: {
    borderBottomWidth: 1,
    borderBottomColor: '#2f3336',
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  timeTab: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginRight: 24,
  },
  timeTabActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#1d9bf0',
  },
  timeTabLabel: {
    color: '#71767b',
    fontSize: 38 / 2,
    fontWeight: '600',
  },
  timeTabLabelActive: {
    color: '#f2f2f2',
  },
  timeTabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#1d9bf0',
    borderRadius: 999,
  },
  contentTypesWrap: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  contentTypePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2f3336',
    backgroundColor: 'transparent',
  },
  contentTypePillActive: {
    backgroundColor: '#1d9bf0',
    borderColor: '#1d9bf0',
  },
  pillIcon: {
    marginRight: 6,
  },
  pillLabel: {
    color: '#71767b',
    fontSize: 38 / 2,
    fontWeight: '700',
  },
  pillLabelActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 80,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f2f2f2',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#71767b',
    textAlign: 'center',
    maxWidth: 280,
  },
});
