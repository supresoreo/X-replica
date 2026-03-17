import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native/icons';
import { useAppStore } from '../store/appStore';
import { Tweet } from '../components/Tweet';

export const SearchScreen = () => {
  const searchQuery = useAppStore((state) => state.searchQuery);
  const searchResults = useAppStore((state) => state.searchResults);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearch = (text) => {
    setLocalQuery(text);
    setSearchQuery(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>
      
      <View style={styles.searchBox}>
        <Search size={18} color="#536471" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#536471"
          value={localQuery}
          onChangeText={handleSearch}
        />
      </View>
      
      <ScrollView style={styles.results}>
        {searchResults.length > 0 ? (
          searchResults.map((tweet) => (
            <Tweet key={tweet.id} tweet={tweet} />
          ))
        ) : localQuery.trim() !== '' ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No results found</Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Search size={60} color="#536471" strokeWidth={1.5} />
            <Text style={styles.emptyStateTitle}>Search X</Text>
            <Text style={styles.emptyStateText}>
              Find posts and accounts
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
