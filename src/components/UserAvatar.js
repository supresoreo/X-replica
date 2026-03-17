import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export const UserAvatar = ({
  imageUri,
  fallbackText,
  size = 40,
  backgroundColor = '#000000',
  textSize,
  style,
  borderWidth = 0,
  borderColor = '#ffffff',
}) => {
  const resolvedTextSize = textSize || Math.max(14, Math.floor(size * 0.4));
  const radius = size / 2;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor,
          borderWidth,
          borderColor,
        },
        style,
      ]}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={{ width: size, height: size, borderRadius: radius }} />
      ) : (
        <Text style={[styles.fallbackText, { fontSize: resolvedTextSize }]}>
          {fallbackText || 'U'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fallbackText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
