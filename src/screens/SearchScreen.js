import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Search } from 'lucide-react-native/icons';
import { useAppStore } from '../store/appStore';
import { AppHeader } from '../components/AppHeader';
import { UserAvatar } from '../components/UserAvatar';

export const SearchScreen = ({ onOpenDrawer }) => {
  const searchQuery = useAppStore((state) => state.searchQuery);
  const searchResults = useAppStore((state) => state.searchResults);
  const searchHistory = useAppStore((state) => state.searchHistory);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const addSearchHistoryEntry = useAppStore((state) => state.addSearchHistoryEntry);
  const clearSearchHistory = useAppStore((state) => state.clearSearchHistory);
  const isFollowingUser = useAppStore((state) => state.isFollowingUser);
  const followUser = useAppStore((state) => state.followUser);
  const unfollowUser = useAppStore((state) => state.unfollowUser);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const userResults = searchResults?.users || [];
  const hasResults = userResults.length > 0;

  useEffect(() => {
    setLocalQuery(searchQuery || '');
  }, [searchQuery]);

  const handleSearch = (text) => {
    setLocalQuery(text);
    setSearchQuery(text);
  };

  const handleSubmitSearch = () => {
    if (!localQuery.trim()) {
      return;
    }

    addSearchHistoryEntry(localQuery);
  };

  const handleSelectHistory = (query) => {
    setLocalQuery(query);
    setSearchQuery(query);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Search" onOpenDrawer={onOpenDrawer} />
      
      <View style={styles.searchBox}>
        <Search size={18} color="#536471" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#536471"
          value={localQuery}
          onChangeText={handleSearch}
          returnKeyType="search"
          onSubmitEditing={handleSubmitSearch}
        />
      </View>
      
      <ScrollView style={styles.results}>
        {hasResults ? (
          <View>
            {userResults.length ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>People</Text>
                {userResults.map((user) => {
                  const isFollowing = isFollowingUser(user.id);
                  return (
                    <View key={user.id} style={styles.userRow}>
                      <UserAvatar
                        imageUri={user.avatarImage}
                        fallbackText={user.avatar || user.displayName?.charAt(0)}
                        backgroundColor={user.averageColor || '#000000'}
                        size={48}
                      />
                      <View style={styles.userDetails}>
                        <Text style={styles.userName}>{user.displayName}</Text>
                        <Text style={styles.userHandle}>{user.username}</Text>
                        {!!user.bio && (
                          <Text style={styles.userBio} numberOfLines={2}>
                            {user.bio}
                          </Text>
                        )}
                      </View>
                      <TouchableOpacity
                        style={[styles.followButton, isFollowing && styles.unfollowButton]}
                        onPress={() => (isFollowing ? unfollowUser(user.id) : followUser(user.id))}
                      >
                        <Text style={[styles.followButtonText, isFollowing && styles.unfollowButtonText]}>
                          {isFollowing ? 'Unfollow' : 'Follow'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ) : null}
          </View>
        ) : localQuery.trim() !== '' ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No results found</Text>
          </View>
        ) : searchHistory?.length ? (
          <View style={styles.section}>
            <View style={styles.historyHeader}>
              <Text style={styles.sectionTitle}>Recent searches</Text>
              <TouchableOpacity onPress={clearSearchHistory} activeOpacity={0.8}>
                <Text style={styles.clearHistoryText}>Clear</Text>
              </TouchableOpacity>
            </View>
            {searchHistory.map((entry) => (
              <TouchableOpacity
                key={entry}
                style={styles.historyRow}
                activeOpacity={0.8}
                onPress={() => handleSelectHistory(entry)}
              >
                <Search size={16} color="#536471" />
                <Text style={styles.historyText}>{entry}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Search size={60} color="#536471" strokeWidth={1.5} />
            <Text style={styles.emptyStateTitle}>Search X</Text>
            <Text style={styles.emptyStateText}>
              Find people
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff3f4',
    margin: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0f1419',
  },
  results: {
    flex: 1,
  },
  section: {
    paddingTop: 6,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15,
  },
  clearHistoryText: {
    color: '#1d9bf0',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f1419',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  historyText: {
    color: '#0f1419',
    fontSize: 15,
    fontWeight: '500',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f1419',
  },
  userHandle: {
    fontSize: 14,
    color: '#536471',
    marginBottom: 4,
  },
  userBio: {
    fontSize: 14,
    lineHeight: 20,
    color: '#0f1419',
  },
  followButton: {
    minWidth: 90,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#0f1419',
    alignItems: 'center',
  },
  unfollowButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cfd9de',
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  unfollowButtonText: {
    color: '#0f1419',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f1419',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#536471',
    textAlign: 'center',
  },
});
