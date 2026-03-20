import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: 12,
    paddingBottom: 22,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorTextWrap: {
    marginLeft: 10,
    flex: 1,
  },
  displayName: {
    fontWeight: '700',
    marginBottom: 2,
  },
  username: {},
  tweetText: {
    marginTop: 2,
  },
  focusedMediaWrap: {
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000000',
    minHeight: 280,
    justifyContent: 'center',
    position: 'relative',
  },
  focusedMedia: {
    width: '100%',
    minHeight: 280,
    aspectRatio: 16 / 9,
  },
  muteButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyText: {},
  repliesSpacer: {
    height: 1,
    marginVertical: 12,
    borderBottomWidth: 1,
  },
  repliesHeader: {
    fontWeight: '600',
    marginTop: 0,
    marginBottom: 12,
  },
  replyCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  replyAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#cccccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  replyText: {
    marginTop: 8,
    marginLeft: 44,
  },
  replyActions: {
    marginTop: 8,
    marginLeft: 44,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  replyLikeCount: {
    fontWeight: '500',
  },
});
