import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { styles } from '../styles/screens/SearchScreenUpdated.styles';
import { Search, AlertCircle } from 'lucide-react-native/icons';
import { useAppStore } from '../store/appStore';
import { AppHeader } from '../components/AppHeader';
import { UserAvatar } from '../components/UserAvatar';

export const SearchScreen = ({ onOpenDrawer }) => {
  const searchQuery = useAppStore((state) => state.searchQuery);
  const searchResults = useAppStore((state) => state.searchResults);
  const searchHistory = useAppStore((state) => state.searchHistory);
  const searchState = useAppStore((state) => state.searchState);
  const searchError = useAppStore((state) => state.searchError);
  const knownUsers = useAppStore((state) => state.knownUsers);
  const currentUserId = useAppStore((state) => state.currentUserId);
  
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const addSearchHistoryEntry = useAppStore((state) => state.addSearchHistoryEntry);
  const clearSearchHistory = useAppStore((state) => state.clearSearchHistory);
  const isFollowingUser = useAppStore((state) => state.isFollowingUser);
  const followUser = useAppStore((state) => state.followUser);
  const unfollowUser = useAppStore((state) => state.unfollowUser);
  
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const userResults = searchResults?.users || [];

  useEffect(() => {
    setLocalQuery(searchQuery || '');
  }, [searchQuery]);

  const handleSearch = useCallback((text) => {
    setLocalQuery(text);
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for search (debounce)
    const timeout = setTimeout(() => {
      if (text.trim()) {
        setSearchQuery(text);
      } else {
        setSearchQuery('');
      }
    }, 300);

    setSearchTimeout(timeout);
  }, [searchTimeout, setSearchQuery]);

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

  // Determine what to display
  const isSearching = localQuery.trim() !== '';
  const isLoading = searchState === 'loading';
  const hasError = searchState === 'error';
  const isEmpty = searchState === 'empty';
  const isSuccess = searchState === 'success';

  return (
    <View style={styles.container}>
      <AppHeader title="Search" onOpenDrawer={onOpenDrawer} />
      
      <View style={styles.searchBox}>
        <Search size={18} color="#536471" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search X by name or handle"
          placeholderTextColor="#536471"
          value={localQuery}
          onChangeText={handleSearch}
          returnKeyType="search"
          onSubmitEditing={handleSubmitSearch}
        />
      </View>
      
      <ScrollView style={styles.results} scrollEnabled={true}>
        {isLoading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#1d9bf0" />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        )}

        {hasError && (
          <View style={styles.centerContainer}>
            <AlertCircle size={48} color="#f91880" />
            <Text style={styles.errorTitle}>Search Error</Text>
            <Text style={styles.errorText}>{searchError || 'Failed to fetch results'}</Text>
          </View>
        )}

        {isEmpty && isSearching && (
          <View style={styles.centerContainer}>
            <Search size={48} color="#536471" />
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptyText}>
              Try searching for a different name or username
            </Text>
          </View>
        )}

        {isSuccess && userResults.length > 0 && (
          <View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>People ({userResults.length})</Text>
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
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.followButtonText, isFollowing && styles.unfollowButtonText]}>
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {!isSearching && searchHistory?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.historyHeader}>
              <Text style={styles.sectionTitle}>Recent searches</Text>
              <TouchableOpacity onPress={clearSearchHistory} activeOpacity={0.8}>
                <Text style={styles.clearHistoryText}>Clear</Text>
              </TouchableOpacity>
            </View>
            {searchHistory.map((entry, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.historyRow}
                activeOpacity={0.8}
                onPress={() => handleSelectHistory(entry)}
              >
                <Search size={16} color="#536471" />
                <Text style={styles.historyText}>{entry}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {!isSearching && (!searchHistory || searchHistory.length === 0) && (
          <View style={styles.centerContainer}>
            <Search size={60} color="#536471" strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>Search X</Text>
            <Text style={styles.emptyText}>
              Find people by name or username
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

