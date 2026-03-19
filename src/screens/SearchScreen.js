import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, useColorScheme } from 'react-native';
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
  const displayMode = useAppStore((state) => state.displayMode);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const systemScheme = useColorScheme();
  const isDark = displayMode === 'night' || (displayMode === 'system' && systemScheme === 'dark');
  const textScale = [0.92, 1, 1.08, 1.16][fontScaleLevel] || 1;
  const iconScale = [0.9, 1, 1.1, 1.2][fontScaleLevel] || 1;
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const searchTimeoutRef = useRef(null);

  const userResults = searchResults?.users || [];
  const isLoading = searchState === 'loading';
  const hasError = searchState === 'error';
  const isEmpty = searchState === 'empty';
  const isSearching = localQuery.trim() !== '';

  const palette = isDark
    ? {
        bg: '#000000',
        panel: '#16181c',
        border: '#1f2428',
        title: '#f2f2f2',
        body: '#8b98a5',
        buttonBg: '#f2f2f2',
        buttonText: '#0f1419',
        unfollowBg: '#000000',
        unfollowText: '#f2f2f2',
        unfollowBorder: '#2f3336',
      }
    : {
        bg: '#ffffff',
        panel: '#eff3f4',
        border: '#eff3f4',
        title: '#0f1419',
        body: '#536471',
        buttonBg: '#0f1419',
        buttonText: '#ffffff',
        unfollowBg: '#ffffff',
        unfollowText: '#0f1419',
        unfollowBorder: '#cfd9de',
      };

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
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <AppHeader title="Search" onOpenDrawer={onOpenDrawer} />
      
      <View style={[styles.searchBox, { backgroundColor: palette.panel }]}>
        <Search size={18 * iconScale} color={palette.body} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: palette.title, fontSize: 15 * textScale }]}
          placeholder="Search"
          placeholderTextColor={palette.body}
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
            <Text style={[styles.loadingText, { color: palette.body, fontSize: 15 * textScale }]}>Searching...</Text>
          </View>
        ) : hasError ? (
          <View style={styles.centerContainer}>
            <CircleAlert size={60 * iconScale} color="#e0245e" strokeWidth={1.5} />
            <Text style={[styles.errorTitle, { color: palette.title, fontSize: 18 * textScale }]}>Search Error</Text>
            <Text style={[styles.errorText, { color: palette.body, fontSize: 14 * textScale }]}>{searchError}</Text>
          </View>
        ) : isEmpty && isSearching ? (
          <View style={styles.centerContainer}>
            <Search size={60 * iconScale} color={palette.body} strokeWidth={1.5} />
            <Text style={[styles.emptyStateTitle, { color: palette.title, fontSize: 24 * textScale }]}>No results found</Text>
            <Text style={[styles.emptyStateText, { color: palette.body, fontSize: 15 * textScale }]}>Try searching for different people</Text>
          </View>
        ) : userResults.length > 0 ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: palette.title, fontSize: 18 * textScale }]}>People</Text>
            {userResults.map((user) => {
              const isFollowing = isFollowingUser(user.id);
              return (
                <View key={user.id} style={[styles.userRow, { borderBottomColor: palette.border }]}>
                  <UserAvatar
                    imageUri={user.avatarImage}
                    fallbackText={user.avatar || user.displayName?.charAt(0)}
                    backgroundColor={user.averageColor || '#000000'}
                    size={48}
                  />
                  <View style={styles.userDetails}>
                    <Text style={[styles.userName, { color: palette.title, fontSize: 16 * textScale }]}>{user.displayName}</Text>
                    <Text style={[styles.userHandle, { color: palette.body, fontSize: 14 * textScale }]}>{user.username}</Text>
                    {!!user.bio && (
                      <Text style={[styles.userBio, { color: palette.title, fontSize: 14 * textScale, lineHeight: 20 * textScale }]} numberOfLines={2}>
                        {user.bio}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.followButton,
                      { backgroundColor: palette.buttonBg },
                      isFollowing && [
                        styles.unfollowButton,
                        { backgroundColor: palette.unfollowBg, borderColor: palette.unfollowBorder },
                      ],
                    ]}
                    onPress={() => (isFollowing ? unfollowUser(user.id) : followUser(user.id))}
                  >
                    <Text
                      style={[
                        styles.followButtonText,
                        { color: palette.buttonText, fontSize: 14 * textScale },
                        isFollowing && [styles.unfollowButtonText, { color: palette.unfollowText }],
                      ]}
                    >
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
              <Text style={[styles.sectionTitle, { color: palette.title, fontSize: 18 * textScale }]}>Recent searches</Text>
              <TouchableOpacity onPress={clearSearchHistory} activeOpacity={0.8}>
                <Text style={[styles.clearHistoryText, { fontSize: 14 * textScale }]}>Clear</Text>
              </TouchableOpacity>
            </View>
            {searchHistory.map((entry) => (
              <TouchableOpacity
                key={entry}
                style={[styles.historyRow, { borderBottomColor: palette.border }]}
                activeOpacity={0.8}
                onPress={() => handleSelectHistory(entry)}
              >
                <Search size={16 * iconScale} color={palette.body} />
                <Text style={[styles.historyText, { color: palette.title, fontSize: 15 * textScale }]}>{entry}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.centerContainer}>
            <Search size={60 * iconScale} color={palette.body} strokeWidth={1.5} />
            <Text style={[styles.emptyStateTitle, { color: palette.title, fontSize: 24 * textScale }]}>Search X</Text>
            <Text style={[styles.emptyStateText, { color: palette.body, fontSize: 15 * textScale }]}>Find people</Text>
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
