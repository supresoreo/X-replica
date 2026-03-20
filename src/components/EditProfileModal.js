import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { Camera, Pen } from 'lucide-react-native/icons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAppStore } from '../store/appStore';
import { UserAvatar } from './UserAvatar';
import { transformNodeForDisplay } from '../utils/themeTransform';

const AVATAR_COLORS = ['#000000', '#1DA1F2', '#FF0000', '#FFD700', '#00CC00', '#FF1493', '#8B008B', '#FF8C00'];
const BANNER_COLORS = ['#cfd9de', '#1DA1F2', '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#C9ADA7', '#9A8C98'];

const createDraft = (user) => ({
  name: user?.displayName || '',
  bio: user?.bio || '',
  location: user?.location || '',
  website: user?.website || '',
  birthDate: user?.birthday || '2001-01-01',
  averageColor: user?.averageColor || '#000000',
  banner: user?.banner || '#cfd9de',
  avatarImage: user?.avatarImage || '',
  bannerImage: user?.bannerImage || '',
});

export const EditProfileModal = ({ visible, onClose }) => {
  const currentUser = useAppStore((state) => state.currentUser);
  const updateUserProfile = useAppStore((state) => state.updateUserProfile);
  const displayMode = useAppStore((state) => state.displayMode);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const systemScheme = useColorScheme();
  const isDark = displayMode === 'night' || (displayMode === 'system' && systemScheme === 'dark');
  const textScale = [0.92, 1, 1.08, 1.16][fontScaleLevel] || 1;
  const iconScale = [0.9, 1, 1.1, 1.2][fontScaleLevel] || 1;
  const [draft, setDraft] = useState(() => createDraft(currentUser));
  const [tipsEnabled, setTipsEnabled] = useState(false);
  const [isProfessional, setIsProfessional] = useState(false);
  const [showAvatarColorPicker, setShowAvatarColorPicker] = useState(false);
  const [showBannerColorPicker, setShowBannerColorPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setDraft(createDraft(currentUser));
      setShowAvatarColorPicker(false);
      setShowBannerColorPicker(false);
    }
  }, [currentUser, visible]);

  const avatarFallback = useMemo(() => {
    return draft.name.trim().charAt(0).toUpperCase() || 'U';
  }, [draft.name]);

  const updateDraft = (field, value) => {
    setDraft((prevDraft) => ({
      ...prevDraft,
      [field]: value,
    }));
  };

  const pickImage = async (field) => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.85,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert('Image Picker Error', result.errorMessage || 'Unable to select image.');
        return;
      }

      const assetUri = result.assets?.[0]?.uri;
      if (assetUri) {
        updateDraft(field, assetUri);
      }
    } catch {
      Alert.alert('Image Picker Error', 'Unable to open the photo library.');
    }
  };

  const openAvatarOptions = () => {
    Alert.alert('Profile photo', 'Choose how you want to update your profile photo.', [
      { text: 'Choose photo', onPress: () => pickImage('avatarImage') },
      { text: 'Use color only', onPress: () => setShowAvatarColorPicker(true) },
      ...(draft.avatarImage ? [{ text: 'Remove photo', onPress: () => updateDraft('avatarImage', '') }] : []),
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openBannerOptions = () => {
    Alert.alert('Cover photo', 'Choose how you want to update your cover photo.', [
      { text: 'Choose photo', onPress: () => pickImage('bannerImage') },
      { text: 'Use color only', onPress: () => setShowBannerColorPicker(true) },
      ...(draft.bannerImage ? [{ text: 'Remove photo', onPress: () => updateDraft('bannerImage', '') }] : []),
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSave = () => {
    if (!draft.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    updateUserProfile({
      displayName: draft.name.trim(),
      bio: draft.bio.trim(),
      location: draft.location.trim(),
      website: draft.website.trim(),
      birthday: draft.birthDate,
      banner: draft.banner,
      bannerImage: draft.bannerImage,
      averageColor: draft.averageColor,
      avatarImage: draft.avatarImage,
      avatar: avatarFallback,
    });

    onClose();
  };

  const contentNode = (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit profile</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
          {draft.bannerImage ? (
            <ImageBackground source={{ uri: draft.bannerImage }} style={styles.banner} imageStyle={styles.bannerImage}>
              <TouchableOpacity style={styles.editBannerButton} onPress={openBannerOptions}>
                <Pen size={20} color="#ffffff" />
              </TouchableOpacity>
            </ImageBackground>
          ) : (
            <View style={[styles.banner, { backgroundColor: draft.banner }]}> 
              <TouchableOpacity style={styles.editBannerButton} onPress={openBannerOptions}>
                <Pen size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          )}

          {showBannerColorPicker ? (
            <View style={styles.colorPickerContainer}>
              <Text style={styles.colorPickerTitle}>Choose cover color</Text>
              <View style={styles.colorPicker}>
                {BANNER_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      draft.banner === color && styles.selectedColor,
                    ]}
                    onPress={() => {
                      updateDraft('banner', color);
                      updateDraft('bannerImage', '');
                      setShowBannerColorPicker(false);
                    }}
                  >
                    {draft.banner === color ? <Text style={styles.checkmark}>✓</Text> : null}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null}

          <View style={styles.editPhotoContainer}>
            <TouchableOpacity style={styles.editPhotoButton} onPress={openAvatarOptions}>
              <Camera size={20} color="#0f1419" />
              <Text style={styles.editPhotoText}>Edit Photo with Grok</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <TouchableOpacity style={styles.avatarWrap} onPress={openAvatarOptions}>
              <UserAvatar
                imageUri={draft.avatarImage}
                fallbackText={avatarFallback}
                backgroundColor={draft.averageColor}
                size={76}
                borderWidth={4}
                borderColor="#ffffff"
              />
              <View style={styles.editAvatarIcon}>
                <Pen size={12} color="#ffffff" />
              </View>
            </TouchableOpacity>
          </View>

          {showAvatarColorPicker ? (
            <View style={styles.colorPickerContainer}>
              <Text style={styles.colorPickerTitle}>Choose avatar color</Text>
              <View style={styles.colorPicker}>
                {AVATAR_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      draft.averageColor === color && styles.selectedColor,
                    ]}
                    onPress={() => {
                      updateDraft('averageColor', color);
                      setShowAvatarColorPicker(false);
                    }}
                  >
                    {draft.averageColor === color ? <Text style={styles.checkmark}>✓</Text> : null}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null}

          <View style={styles.formSection}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={draft.name}
                onChangeText={(value) => updateDraft('name', value)}
                placeholder="Enter your name"
                placeholderTextColor="#536471"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={draft.bio}
                onChangeText={(value) => updateDraft('bio', value)}
                placeholder="Add a bio to your profile"
                placeholderTextColor="#536471"
                multiline
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Location</Text>
              <TextInput
                style={styles.input}
                value={draft.location}
                onChangeText={(value) => updateDraft('location', value)}
                placeholder="Add your location"
                placeholderTextColor="#536471"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Website</Text>
              <TextInput
                style={styles.input}
                value={draft.website}
                onChangeText={(value) => updateDraft('website', value)}
                placeholder="Add your website"
                placeholderTextColor="#536471"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Birth date</Text>
              <TouchableOpacity style={styles.dateField}>
                <Text style={styles.dateFieldText}>{draft.birthDate}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.professionalButton} onPress={() => setIsProfessional((value) => !value)}>
              <Text style={styles.professionalButtonText}>
                {isProfessional ? 'Using Professional tools' : 'Switch to Professional'}
              </Text>
            </TouchableOpacity>

            <View style={styles.tipsRow}>
              <Text style={styles.tipsLabel}>Tips</Text>
              <View style={styles.tipsRight}>
                <Text style={styles.tipsStatus}>{tipsEnabled ? 'On' : 'Off'}</Text>
                <Switch
                  value={tipsEnabled}
                  onValueChange={setTipsEnabled}
                  trackColor={{ false: '#d8e0e5', true: '#1DA1F2' }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  return transformNodeForDisplay(contentNode, isDark, textScale, iconScale);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  cancelButton: {
    fontSize: 16,
    color: '#0f1419',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f1419',
  },
  saveButton: {
    fontSize: 16,
    color: '#1d9bf0',
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingBottom: 36,
  },
  banner: {
    height: 180,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 12,
  },
  bannerImage: {
    resizeMode: 'cover',
  },
  editBannerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(15, 20, 25, 0.58)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editPhotoContainer: {
    paddingHorizontal: 15,
    marginTop: 14,
    alignItems: 'center',
  },
  editPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d5dee4',
    backgroundColor: '#ffffff',
  },
  editPhotoText: {
    color: '#0f1419',
    fontSize: 14,
    fontWeight: '600',
  },
  profileInfo: {
    paddingHorizontal: 15,
    marginBottom: 18,
  },
  avatarWrap: {
    width: 76,
    marginTop: -38,
  },
  editAvatarIcon: {
    position: 'absolute',
    right: -2,
    bottom: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 20, 25, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPickerContainer: {
    marginHorizontal: 15,
    marginBottom: 16,
    padding: 14,
    backgroundColor: '#f7f9fa',
    borderRadius: 12,
  },
  colorPickerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f1419',
    marginBottom: 12,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#1d9bf0',
    borderWidth: 3,
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  formSection: {
    paddingHorizontal: 15,
  },
  fieldGroup: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  fieldLabel: {
    fontSize: 13,
    color: '#536471',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    padding: 0,
    fontSize: 16,
    color: '#0f1419',
  },
  bioInput: {
    minHeight: 72,
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  dateField: {
    paddingVertical: 4,
  },
  dateFieldText: {
    fontSize: 16,
    color: '#1d9bf0',
  },
  professionalButton: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  professionalButtonText: {
    fontSize: 16,
    color: '#0f1419',
    fontWeight: '500',
  },
  tipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  tipsLabel: {
    fontSize: 16,
    color: '#0f1419',
    fontWeight: '500',
  },
  tipsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tipsStatus: {
    fontSize: 14,
    color: '#536471',
  },
});