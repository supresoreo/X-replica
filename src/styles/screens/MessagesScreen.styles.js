import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  conversationsList: {
    flex: 1,
  },
  emptyState: {
    marginTop: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f1419',
    marginBottom: 8,
  },
  emptyStateText: {
    color: '#536471',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  conversation: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  conversationAvatar: {
    marginRight: 10,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  conversationName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#0f1419',
  },
  conversationTime: {
    fontSize: 13,
    color: '#536471',
  },
  conversationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  conversationMessage: {
    fontSize: 15,
    color: '#536471',
    flex: 1,
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#0f1419',
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
    marginLeft: 10,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
    backgroundColor: '#fff',
  },
  chatAvatar: {
    marginRight: 10,
  },
  chatHeaderText: {
    flex: 1,
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0f1419',
  },
  chatUsername: {
    fontSize: 14,
    color: '#536471',
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  message: {
    marginBottom: 15,
  },
  messageLeft: {
    alignItems: 'flex-start',
  },
  messageRight: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 20,
  },
  messageBubbleLeft: {
    backgroundColor: '#eff3f4',
  },
  messageBubbleRight: {
    backgroundColor: '#000',
  },
  messageText: {
    fontSize: 15,
    color: '#0f1419',
  },
  messageTextRight: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 12,
    color: '#536471',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eff3f4',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#eff3f4',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0f1419',
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
});
