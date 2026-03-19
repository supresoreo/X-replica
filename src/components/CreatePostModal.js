import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Image, ChartBar, Smile, MapPin, X } from 'lucide-react-native/icons';
import { useAppStore } from '../store/appStore';
import { UserAvatar } from './UserAvatar';
import { transformNodeForDisplay } from '../utils/themeTransform';

export const CreatePostModal = ({ visible, onClose }) => {

  const [postText, setPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const addTweet = useAppStore((state) => state.addTweet);
  const currentUser = useAppStore((state) => state.currentUser);
  const displayMode = useAppStore((state) => state.displayMode);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const systemScheme = useColorScheme();
  const isDark = displayMode === 'night' || (displayMode === 'system' && systemScheme === 'dark');
  const textScale = [0.92, 1, 1.08, 1.16][fontScaleLevel] || 1;
  const iconScale = [0.9, 1, 1.1, 1.2][fontScaleLevel] || 1;

  const pickImage = async () => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    quality: 0.8,
  });

  if (!result.didCancel && result.assets && result.assets.length > 0) {
    setSelectedImage(result.assets[0].uri);
  }
};

  const handlePost = () => {
  if (postText.trim() || selectedImage) {
    addTweet({
      content: postText,
      image: selectedImage,
    });

    setPostText('');
    setSelectedImage(null);
    onClose();
  }
};
  const characterCount = postText.length;
  const maxCharacters = 280;
  const canPost = postText.trim().length > 0 && characterCount <= maxCharacters;

  const contentNode = (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={false}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#0f1419" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.postButton, !canPost && styles.postButtonDisabled]}
            onPress={handlePost}
            disabled={!canPost}
          >
            <Text style={[styles.postButtonText, !canPost && styles.postButtonTextDisabled]}>
              Post
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.userInfo}>
            <UserAvatar
              imageUri={currentUser?.avatarImage}
              fallbackText={currentUser?.avatar || currentUser?.displayName?.[0]}
              backgroundColor={currentUser?.averageColor || '#000000'}
              size={40}
              style={styles.avatarCircle}
            />
            <View style={styles.userDetails}>
              <Text style={styles.displayName}>{currentUser.displayName}</Text>
              <Text style={styles.username}>{currentUser.username}</Text>
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder="What's happening?"
            placeholderTextColor="#657786"
            multiline
            value={postText}
            onChangeText={setPostText}
            autoFocus
            maxLength={maxCharacters}
          />

          {selectedImage && (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.imagePreview}
              />
            </View>
          )}

          <View style={styles.footer}>
            <View style={styles.options}>
              <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
                <Image size={20} color="#1d9bf0" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton}>
                <ChartBar size={20} color="#1d9bf0" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton}>
                <Smile size={20} color="#1d9bf0" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton}>
                <MapPin size={20} color="#1d9bf0" />
              </TouchableOpacity>
            </View>           
            <View style={styles.characterCount}>
              <Text
                style={[
                  styles.characterCountText,
                  characterCount > maxCharacters && styles.characterCountError,
                ]}
              >
                {characterCount} / {maxCharacters}
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return transformNodeForDisplay(contentNode, isDark, textScale, iconScale);
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  postButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: {
    backgroundColor: '#cfd9de',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  postButtonTextDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  userInfo: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  avatarCircle: {
    marginRight: 10,
  },
  userDetails: {
    justifyContent: 'center',
  },
  displayName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#0f1419',
  },
  username: {
    fontSize: 14,
    color: '#536471',
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#0f1419',
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eff3f4',
  },
  options: {
    flexDirection: 'row',
    gap: 15,
  },
  optionButton: {
    padding: 5,
  },
  characterCount: {
    marginLeft: 'auto',
  },
  characterCountText: {
    fontSize: 13,
    color: '#536471',
  },
  characterCountError: {
    color: '#f91880',
  },

  imagePreviewContainer: {
  marginTop: 10,
},
imagePreview: {
  width: '100%',
  height: 200,
  borderRadius: 10,
},
});