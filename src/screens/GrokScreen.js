import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { Sparkles } from 'lucide-react-native/icons';
import { AppHeader } from '../components/AppHeader';
import { useAppStore } from '../store/appStore';

export const GrokScreen = ({ onOpenDrawer }) => {
  const displayMode = useAppStore((state) => state.displayMode);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const systemScheme = useColorScheme();
  const isDark = displayMode === 'night' || (displayMode === 'system' && systemScheme === 'dark');
  const textScale = [0.92, 1, 1.08, 1.16][fontScaleLevel] || 1;
  const iconScale = [0.9, 1, 1.1, 1.2][fontScaleLevel] || 1;

  const palette = isDark
    ? { bg: '#000000', title: '#f2f2f2', body: '#8b98a5' }
    : { bg: '#ffffff', title: '#0f1419', body: '#536471' };

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <AppHeader title="Grok" onOpenDrawer={onOpenDrawer} />
      
      <ScrollView style={styles.content}>
        <View style={styles.emptyState}>
          <Sparkles size={60 * iconScale} color={palette.title} strokeWidth={1.5} />
          <Text style={[styles.emptyStateTitle, { color: palette.title, fontSize: 24 * textScale }]}>Welcome to Grok</Text>
          <Text style={[styles.emptyStateText, { color: palette.body, fontSize: 15 * textScale }]}> 
            Your AI assistant for X
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 100,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f1419',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#536471',
    textAlign: 'center',
  },
});
