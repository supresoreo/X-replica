import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Search, CircleAlert } from 'lucide-react-native/icons';
import { useAppStore } from '../store/appStore';
import { AppHeader } from '../components/AppHeader';
import { UserAvatar } from '../components/UserAvatar';

export const SearchScreen = ({ onOpenDrawer }) => {
  const searchQuery = useAppStore((state) => state.searchQuery);
  const searchResults = useAppStore((state) => state.searchResults);
  const searchHistory = useAppStore((state) => state.searchHistory);
  const searchState = useAppStore((state) => state.searchState);
  const searchError = useAppStore((state) => state.searchError);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const addSearchHistoryEntry = useAppStore((state) => state.addSearchHistoryEntry);
  const clearSearchHistory = useAppStore((state) => state.clearSearchHistory);
  const isFollowingUser = useAppStore((state) => state.isFollowingUser);
  const followUser = useAppStore((state) => state.followUser);
  const unfollowUser = useAppStore((state) => state.unfollowUser);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const searchTimeoutRef = useRef(null);

  const userResults = searchResults?.users || [];
  const isLoading = searchState === 'loading';
  const hasError = searchState === 'error';
  const isEmpty = searchState === 'empty';
  const isSearching = localQuery.trim() !== '';

  useEffect(() => {
    setLocalQuery(searchQuery || '');
  }, [searchQuery]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearch = (text) => {
    setLocalQuery(text);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search by 300ms
    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(text);
    }, 300);
  };

  const handleSubmitSearch = () => {
    if (!localQuery.trim()) {
      return;
    }

    addSearchHistoryEntry(localQuery);
  };

  const handleSelectHistory = (query) => {
    setLocalQuery(query);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
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
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#1d9bf0" />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : hasError ? (
          <View style={styles.centerContainer}>
            <CircleAlert size={60} color="#e0245e" strokeWidth={1.5} />
            <Text style={styles.errorTitle}>Search Error</Text>
            <Text style={styles.errorText}>{searchError}</Text>
          </View>
        ) : isEmpty && isSearching ? (
          <View style={styles.centerContainer}>
            <Search size={60} color="#536471" strokeWidth={1.5} />
            <Text style={styles.emptyStateTitle}>No results found</Text>
            <Text style={styles.emptyStateText}>Try searching for different people</Text>
          </View>
        ) : userResults.length > 0 ? (
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
        ) : searchHistory?.length && !isSearching ? (
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
          <View style={styles.centerContainer}>
            <Search size={60} color="#536471" strokeWidth={1.5} />
            <Text style={styles.emptyStateTitle}>Search X</Text>
            <Text style={styles.emptyStateText}>Find people</Text>
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: '#536471',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f1419',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#536471',
    textAlign: 'center',
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
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f1419',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#536471',
    textAlign: 'center',
  },
});
