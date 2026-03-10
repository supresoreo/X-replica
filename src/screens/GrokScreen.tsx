import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Sparkles } from 'lucide-react-native/icons';

export const GrokScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Grok</Text>
      </View>
      
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
