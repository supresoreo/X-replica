import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: '#f2f2f2',
    fontSize: 40 / 2,
    fontWeight: '800',
  },
  username: {
    color: '#6f7a83',
    fontSize: 16,
    marginTop: 2,
  },
  rightSpacer: {
    width: 36,
  },
  searchWrap: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 24,
    height: 48,
    backgroundColor: '#1b1f2a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8,
  },
  searchText: {
    color: '#77818b',
    fontSize: 35 / 2,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: 14,
    paddingBottom: 110,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  itemTextWrap: {
    flex: 1,
  },
  itemTitle: {
    color: '#f2f2f2',
    fontSize: 37 / 2,
    fontWeight: '700',
    marginBottom: 2,
  },
  itemDescription: {
    color: '#6e7680',
    fontSize: 33 / 2,
    lineHeight: 22,
  },
  accountField: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e6ecf0',
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f1419',
    marginBottom: 6,
  },
  fieldValue: {
    fontSize: 15,
    color: '#536471',
  },
  logoutButton: {
    marginTop: 20,
    marginHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#f04a44',
  },
});
