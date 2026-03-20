import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  RefreshControl,
  useColorScheme,
} from 'react-native';
import { ArrowLeft, Send } from 'lucide-react-native/icons';
import { useAppStore } from '../store/appStore';
import { AppHeader } from '../components/AppHeader';
import { UserAvatar } from '../components/UserAvatar';
import { styles } from '../styles/screens/MessagesScreen.styles';

export const MessagesScreen = ({ onOpenDrawer }) => {
  const conversations = useAppStore((state) => state.conversations);
  const messages = useAppStore((state) => state.messages);
  const currentUser = useAppStore((state) => state.currentUser); // Added this to the state selector
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
              <UserAvatar
                imageUri={conv.avatarImage}
                fallbackText={conv.avatar || conv.displayName?.charAt(0) || 'U'}
                backgroundColor={conv.averageColor || '#000000'}
                size={48}
                style={styles.conversationAvatar}
              />
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
            <UserAvatar
              imageUri={selectedConv?.avatarImage}
              fallbackText={selectedConv?.avatar || selectedConv?.displayName?.charAt(0) || 'U'}
              backgroundColor={selectedConv?.averageColor || '#000000'}
              size={36}
              style={styles.chatAvatar}
            />
            <View style={styles.chatHeaderText}>
              <Text style={[styles.chatName, { color: palette.title, fontSize: 16 * textScale }]}>{selectedConv?.displayName}</Text>
              <Text style={[styles.chatUsername, { color: palette.body, fontSize: 14 * textScale }]}>{selectedConv?.username || ''}</Text>
            </View>
          </View>
          
          <ScrollView style={styles.messagesContainer}>
            {conversationMessages.map((msg) => {
              // Logic fix: Determine if current user is the sender based on the app store's user state
              const isCurrentUser = msg.sender === currentUser?.username;
              
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

