import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native/icons';
import { useAppStore } from '../store/appStore';
import { UserAvatar } from './UserAvatar';

export const ComposeReplyModal = ({ visible, tweet, currentUser, onClose, onSubmit }) => {
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const insets = useSafeAreaInsets();
  const displayMode = useAppStore((state) => state.displayMode);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const systemScheme = useColorScheme();

  const isDark = displayMode === 'night' || (displayMode === 'system' && systemScheme === 'dark');
  const textScale = [0.92, 1, 1.08, 1.16][fontScaleLevel] || 1;

  const palette = isDark
    ? {
        bg: '#000000',
        border: '#1f2428',
        textPrimary: '#f2f2f2',
        textSecondary: '#8b98a5',
        inputBg: '#0f1215',
        inputBorder: '#1f2428',
        buttonBg: '#1d9bf0',
        buttonText: '#ffffff',
        divider: '#2f3336',
      }
    : {
        bg: '#ffffff',
        border: '#eff3f4',
        textPrimary: '#0f1419',
        textSecondary: '#536471',
        inputBg: '#f7f9fb',
        inputBorder: '#e6ecf0',
        buttonBg: '#1d9bf0',
        buttonText: '#ffffff',
        divider: '#e6ecf0',
      };

  const handleClose = () => {
    setReplyText('');
    setIsSubmitting(false);
    onClose?.();
  };

  const handleSubmit = async () => {
    if (!replyText.trim() || !tweet || !currentUser) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        content: replyText.trim(),
        tweetId: tweet.id,
      });
      setReplyText('');
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = replyText.trim().length > 0 && !isSubmitting;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: palette.bg }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View
            style={[
              styles.header,
              { paddingTop: insets.top + 8, borderBottomColor: palette.border },
            ]}
          >
            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.7}
              onPress={handleClose}
            >
              <X size={24} color={palette.textPrimary} />
            </TouchableOpacity>
            <View style={styles.headerSpacer} />
            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  backgroundColor: canSubmit ? palette.buttonBg : '#536471',
                },
              ]}
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={!canSubmit}
            >
              <Text
                style={[
                  styles.submitButtonText,
                  { color: palette.buttonText, fontSize: 15 * textScale },
                ]}
              >
                Reply
              </Text>
            </TouchableOpacity>
          </View>

          {/* Original Tweet Preview */}
          {tweet && (
            <View style={[styles.previewWrap, { borderBottomColor: palette.divider }]}>
              <View style={styles.previewContent}>
                <Text style={[styles.previewLabel, { color: palette.textSecondary, fontSize: 14 * textScale }]}>
                  Replying to{' '}
                  <Text style={{ color: palette.buttonBg }}>@{tweet.username}</Text>
                </Text>
                <Text
                  style={[
                    styles.previewText,
                    { color: palette.textPrimary, fontSize: 15 * textScale },
                  ]}
                  numberOfLines={3}
                >
                  {tweet.content}
                </Text>
              </View>
            </View>
          )}

          {/* Compose Area */}
          <View style={styles.composeArea}>
            <View style={styles.composeHeader}>
              <UserAvatar
                imageUri={currentUser?.avatarImage}
                fallbackText={currentUser?.avatar || currentUser?.displayName?.[0] || 'U'}
                backgroundColor={currentUser?.averageColor || '#000000'}
                size={40}
              />
            </View>

            <View style={styles.inputWrap}>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: palette.textPrimary,
                    fontSize: 17 * textScale,
                  },
                ]}
                placeholder="Post your reply"
                placeholderTextColor={palette.textSecondary}
                multiline
                maxLength={280}
                value={replyText}
                onChangeText={setReplyText}
                editable={!isSubmitting}
              />
              <Text
                style={[
                  styles.charCount,
                  {
                    color:
                      replyText.length > 260
                        ? '#f91880'
                        : palette.textSecondary,
                    fontSize: 14 * textScale,
                  },
                ]}
              >
                {replyText.length}/280
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: {
    flex: 1,
  },
  submitButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontWeight: '700',
    fontSize: 15,
  },
  previewWrap: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  previewContent: {
    gap: 6,
  },
  previewLabel: {
    fontSize: 14,
  },
  previewText: {
    fontSize: 15,
    lineHeight: 20,
  },
  composeArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  composeHeader: {
    marginBottom: 12,
  },
  inputWrap: {
    flex: 1,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 17,
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 14,
    textAlign: 'right',
  },
});
