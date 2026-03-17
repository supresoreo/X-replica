import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { House, Search, Sparkles, Bell, Mail } from 'lucide-react-native/icons';

export const TabBar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'forYou', icon: House, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'grok', icon: Sparkles, label: 'Grok' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'messages', icon: Mail, label: 'Messages' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabChange(tab.id)}
          >
            <Icon 
              size={24} 
              color={isActive ? '#0f1419' : '#536471'}
              strokeWidth={isActive ? 2 : 2}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eff3f4',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
