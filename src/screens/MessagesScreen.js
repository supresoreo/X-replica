import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
} from 'react-native';
import { ArrowLeft, Send } from 'lucide-react-native/icons';
import { useAppStore } from '../store/appStore';

export const MessagesScreen = () => {
  const conversations = useAppStore((state) => state.conversations);
  const messages = useAppStore((state) => state.messages);
  const sendMessage = useAppStore((state) => state.sendMessage);
  
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>
      
      <ScrollView style={styles.conversationsList}>
        {conversations.map((conv) => (
          <TouchableOpacity
            key={conv.id}
            style={styles.conversation}
            onPress={() => setSelectedConversation(conv.id)}
          >
            <View style={styles.conversationAvatar}>
              <Text style={styles.conversationAvatarText}>{conv.displayName[0]}</Text>
            </View>
            <View style={styles.conversationContent}>
              <View style={styles.conversationHeader}>
                <Text style={styles.conversationName}>{conv.displayName}</Text>
                <Text style={styles.conversationTime}>{conv.timestamp}</Text>
              </View>
              <View style={styles.conversationFooter}>
                <Text
                  style={[
                    styles.conversationMessage,
                    conv.unread && styles.unreadMessage,
                  ]}
                  numberOfLines={1}
                >
                  {conv.lastMessage}
                </Text>
                {conv.unread && <View style={styles.unreadBadge} />}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={selectedConversation !== null}
        animationType="slide"
        onRequestClose={() => setSelectedConversation(null)}
      >
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setSelectedConversation(null)}>
              <ArrowLeft size={24} color="#0f1419" />
            </TouchableOpacity>
            <View style={styles.chatAvatar}>
              <Text style={styles.chatAvatarText}>{selectedConv?.displayName[0]}</Text>
            </View>
            <View style={styles.chatHeaderText}>
              <Text style={styles.chatName}>{selectedConv?.displayName}</Text>
              <Text style={styles.chatUsername}>{selectedConv?.username}</Text>
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
                    ]}
                  >
                    <Text style={[styles.messageText, isCurrentUser && styles.messageTextRight]}>
                      {msg.content}
                    </Text>
                  </View>
                  <Text style={styles.messageTime}>{msg.timestamp}</Text>
                </View>
              );
            })}
          </ScrollView>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Start a new message"
              placeholderTextColor="#657786"
              value={messageText}
              onChangeText={setMessageText}
              multiline
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <Send size={20} color="#fff" />
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
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f1419',
  },
  conversationsList: {
    flex: 1,
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
