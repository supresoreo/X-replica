import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { House, Search, Sparkles, Bell, Mail } from 'lucide-react-native/icons';
import { useAppStore } from '../store/appStore';

export const TabBar = ({ activeTab, onTabChange, dark = false }) => {
  const unreadNotifications = useAppStore((state) => state.getUnreadNotificationCount());
  const unreadMessages = useAppStore((state) => state.getUnreadMessageCount());
  const tabs = [
    { id: 'forYou', icon: House, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'grok', icon: Sparkles, label: 'Grok' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'messages', icon: Mail, label: 'Messages' },
  ];

  return (
    <View style={[styles.container, dark && styles.containerDark]}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const badgeCount = tab.id === 'notifications' ? unreadNotifications : tab.id === 'messages' ? unreadMessages : 0;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabChange(tab.id)}
          >
            <View style={styles.iconWrap}>
              <Icon
                size={24}
                color={
                  dark
                    ? isActive
                      ? '#f2f2f2'
                      : '#6f7a83'
                    : isActive
                      ? '#0f1419'
                      : '#536471'
                }
                strokeWidth={isActive ? 2 : 2}
              />
              {badgeCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badgeCount > 99 ? '99+' : badgeCount}</Text>
                </View>
              ) : null}
            </View>
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
  containerDark: {
    backgroundColor: '#000',
    borderTopColor: '#1f2428',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  iconWrap: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -7,
    right: -12,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: '#f91880',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
