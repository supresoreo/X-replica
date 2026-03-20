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
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 110,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    color: '#767d84',
    fontSize: 39 / 2,
    fontWeight: '700',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowTextWrap: {
    marginLeft: 14,
    flex: 1,
  },
  iconFallback: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#4f555b',
  },
  rowTitle: {
    color: '#f2f2f2',
    fontSize: 42 / 2,
    fontWeight: '700',
    marginBottom: 1,
  },
  rowSubtitle: {
    color: '#757c83',
    fontSize: 37 / 2,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    backgroundColor: '#232323',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: {
    color: '#dfdfdf',
    fontSize: 17,
    fontWeight: '700',
  },
});
