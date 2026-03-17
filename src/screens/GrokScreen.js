import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Sparkles } from 'lucide-react-native/icons';
import { AppHeader } from '../components/AppHeader';

export const GrokScreen = ({ onOpenDrawer }) => {
  return (
    <View style={styles.container}>
      <AppHeader title="Grok" onOpenDrawer={onOpenDrawer} />
      
      <ScrollView style={styles.content}>
        <View style={styles.emptyState}>
          <Sparkles size={60} color="#0f1419" strokeWidth={1.5} />
          <Text style={styles.emptyStateTitle}>Welcome to Grok</Text>
          <Text style={styles.emptyStateText}>
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
