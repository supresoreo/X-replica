import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export const UserAvatar = ({
  imageUri,
  fallbackText,
  size = 40,
  backgroundColor = '#000000',
  textSize,
  style,
  borderWidth = 0,
  borderColor = '#ffffff',
  onPress, // 👈 add this
}) => {
  const resolvedTextSize = textSize || Math.max(14, Math.floor(size * 0.4));
  const radius = size / 2;

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
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
        <Image
          key={imageUri}
          source={{ uri: imageUri, cache: 'reload' }}
          style={{
            width: size - borderWidth * 2,
            height: size - borderWidth * 2,
            borderRadius: radius,
          }}
        />
      ) : (
        <Text style={[styles.fallbackText, { fontSize: resolvedTextSize }]}>
          {fallbackText || 'U'}
        </Text>
      )}
    </Container>
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