import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/appStore';
import { UserAvatar } from './UserAvatar';

export const AppHeader = ({ title, centered = false, onOpenDrawer }) => {
  const currentUser = useAppStore((state) => state.currentUser);
  const insets = useSafeAreaInsets();
  const avatarText = currentUser?.avatar || currentUser?.displayName?.charAt(0) || 'U';

  return (
    <View style={[styles.container, { paddingTop: insets.top, height: 60 + insets.top }]}>
      <TouchableOpacity
        style={styles.avatarButton}
        onPress={() => onOpenDrawer?.()}
        activeOpacity={0.8}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <UserAvatar
          imageUri={currentUser?.avatarImage}
          fallbackText={avatarText}
          backgroundColor={currentUser?.averageColor || '#000000'}
          size={32}
        />
      </TouchableOpacity>

      {!centered ? (
        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
      ) : null}

      {centered ? (
        <View pointerEvents="none" style={styles.centeredTitleWrap}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
      ) : null}

      <View style={styles.trailingSpacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  avatarButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleWrap: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f1419',
  },
  centeredTitleWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trailingSpacer: {
    width: 40,
  },
});