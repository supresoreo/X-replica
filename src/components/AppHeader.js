import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/appStore';
import { UserAvatar } from './UserAvatar';

export const AppHeader = ({ title, centered = false, onOpenDrawer }) => {
  const currentUser = useAppStore((state) => state.currentUser);
  const displayMode = useAppStore((state) => state.displayMode);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const textScale = [0.92, 1, 1.08, 1.16][fontScaleLevel] || 1;
  const systemScheme = useColorScheme();
  const isDark = displayMode === 'night' || (displayMode === 'system' && systemScheme === 'dark');
  const insets = useSafeAreaInsets();
  const avatarText = currentUser?.avatar || currentUser?.displayName?.charAt(0) || 'U';
  const containerThemeStyle = {
    backgroundColor: isDark ? '#000' : '#fff',
    borderBottomColor: isDark ? '#1f2428' : '#eff3f4',
  };
  const titleThemeStyle = {
    color: isDark ? '#f2f2f2' : '#0f1419',
    fontSize: 20 * textScale,
  };

  return (
    <View
      style={[
        styles.container,
        containerThemeStyle,
        {
          paddingTop: insets.top,
          height: 60 + insets.top,
        },
      ]}
    >
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
          <Text style={[styles.title, titleThemeStyle]} numberOfLines={1}>
            {title}
          </Text>
        </View>
      ) : null}

      {centered ? (
        <View pointerEvents="none" style={styles.centeredTitleWrap}>
          <Text style={[styles.title, titleThemeStyle]} numberOfLines={1}>
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