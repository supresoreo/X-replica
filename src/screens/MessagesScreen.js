import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  RefreshControl,
  useColorScheme,
} from 'react-native';
import { ArrowLeft, Send } from 'lucide-react-native/icons';
import { useAppStore } from '../store/appStore';
import { AppHeader } from '../components/AppHeader';

export const MessagesScreen = ({ onOpenDrawer }) => {
  const conversations = useAppStore((state) => state.conversations);
  const messages = useAppStore((state) => state.messages);
  const sendMessage = useAppStore((state) => state.sendMessage);
  const refreshAppData = useAppStore((state) => state.refreshAppData);
  const markAllMessagesAsRead = useAppStore((state) => state.markAllMessagesAsRead);
  const displayMode = useAppStore((state) => state.displayMode);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const systemScheme = useColorScheme();
  const isDark = displayMode === 'night' || (displayMode === 'system' && systemScheme === 'dark');
  const textScale = [0.92, 1, 1.08, 1.16][fontScaleLevel] || 1;
  const iconScale = [0.9, 1, 1.1, 1.2][fontScaleLevel] || 1;

  const palette = isDark
    ? {
        bg: '#000000',
        panel: '#16181c',
        border: '#1f2428',
        title: '#f2f2f2',
        body: '#8b98a5',
        bubbleLeft: '#1f2428',
        bubbleRight: '#f2f2f2',
        bubbleRightText: '#0f1419',
        chipBg: '#2f3336',
        chipText: '#f2f2f2',
      }
    : {
        bg: '#ffffff',
        panel: '#eff3f4',
        border: '#eff3f4',
        title: '#0f1419',
        body: '#536471',
        bubbleLeft: '#eff3f4',
        bubbleRight: '#000000',
        bubbleRightText: '#ffffff',
        chipBg: '#000000',
        chipText: '#ffffff',
      };
  
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    markAllMessagesAsRead();
  }, [markAllMessagesAsRead]);

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversation) {
      sendMessage(selectedConversation, messageText);
      setMessageText('');
    }
  };

  const selectedConv = conversations.find((c) => c.id === selectedConversation);
  const conversationMessages = selectedConversation
    ? messages[selectedConversation] || []
    : [];

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshAppData();
    } finally {
      setRefreshing(false);
    }
  }, [refreshAppData]);

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}> 
      <AppHeader title="Messages" onOpenDrawer={onOpenDrawer} />
      
      <ScrollView
        style={styles.conversationsList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {conversations.length ? (
          conversations.map((conv) => (
            <TouchableOpacity
              key={conv.id}
              style={[styles.conversation, { borderBottomColor: palette.border }]}
              onPress={() => setSelectedConversation(conv.id)}
            >
              <View style={[styles.conversationAvatar, { backgroundColor: palette.chipBg }]}> 
                <Text style={[styles.conversationAvatarText, { color: palette.chipText, fontSize: 16 * textScale }]}>{conv.displayName[0]}</Text>
              </View>
              <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                  <Text style={[styles.conversationName, { color: palette.title, fontSize: 15 * textScale }]}>{conv.displayName}</Text>
                  <Text style={[styles.conversationTime, { color: palette.body, fontSize: 13 * textScale }]}>{conv.timestamp}</Text>
                </View>
                <View style={styles.conversationFooter}>
                  <Text
                    style={[
                      styles.conversationMessage,
                      { color: palette.body, fontSize: 15 * textScale },
                      conv.unread && styles.unreadMessage,
                      conv.unread && { color: palette.title },
                    ]}
                    numberOfLines={1}
                  >
                    {conv.lastMessage}
                  </Text>
                  {conv.unread && <View style={[styles.unreadBadge, { backgroundColor: palette.title }]} />}
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateTitle, { color: palette.title, fontSize: 24 * textScale }]}>No messages yet</Text>
            <Text style={[styles.emptyStateText, { color: palette.body, fontSize: 15 * textScale, lineHeight: 22 * textScale }]}> 
              Your conversations with real users will appear here.
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={selectedConversation !== null}
        animationType="slide"
        onRequestClose={() => setSelectedConversation(null)}
      >
        <View style={[styles.chatContainer, { backgroundColor: palette.bg }]}>
          <View style={[styles.chatHeader, { borderBottomColor: palette.border, backgroundColor: palette.bg }]}> 
            <TouchableOpacity onPress={() => setSelectedConversation(null)}>
              <ArrowLeft size={24 * iconScale} color={palette.title} />
            </TouchableOpacity>
            <View style={[styles.chatAvatar, { backgroundColor: palette.chipBg }]}> 
              <Text style={[styles.chatAvatarText, { color: palette.chipText, fontSize: 12 * textScale }]}>{selectedConv?.displayName[0]}</Text>
            </View>
            <View style={styles.chatHeaderText}>
              <Text style={[styles.chatName, { color: palette.title, fontSize: 16 * textScale }]}>{selectedConv?.displayName}</Text>
              <Text style={[styles.chatUsername, { color: palette.body, fontSize: 14 * textScale }]}>{selectedConv?.username}</Text>
            </View>
          </View>
          
          <ScrollView style={styles.messagesContainer}>
            {conversationMessages.map((msg) => {
              const currentUser = useAppStore.getState().currentUser;
              const isCurrentUser = msg.sender === currentUser.username;
              
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.message,
                    isCurrentUser ? styles.messageRight : styles.messageLeft,
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      isCurrentUser ? styles.messageBubbleRight : styles.messageBubbleLeft,
                      { backgroundColor: isCurrentUser ? palette.bubbleRight : palette.bubbleLeft },
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        { color: palette.title, fontSize: 15 * textScale },
                        isCurrentUser && [styles.messageTextRight, { color: palette.bubbleRightText }],
                      ]}
                    >
                      {msg.content}
                    </Text>
                  </View>
                  <Text style={[styles.messageTime, { color: palette.body, fontSize: 12 * textScale }]}>{msg.timestamp}</Text>
                </View>
              );
            })}
          </ScrollView>
          
          <View style={[styles.inputContainer, { borderTopColor: palette.border }]}> 
            <TextInput
              style={[styles.input, { backgroundColor: palette.panel, color: palette.title, fontSize: 15 * textScale }]}
              placeholder="Start a new message"
              placeholderTextColor={palette.body}
              value={messageText}
              onChangeText={setMessageText}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: palette.chipBg }]}
              onPress={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <Send size={20 * iconScale} color={palette.chipText} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#000',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatAvatarText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
