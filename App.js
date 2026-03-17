/**
 * Twitter/X Clone App
 * A full-featured social media app with Zustand state management
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ForYouScreen } from './src/screens/ForYouScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { MessagesScreen } from './src/screens/MessagesScreen';
import { BookmarksScreen } from './src/screens/BookmarksScreen';
import { GrokScreen } from './src/screens/GrokScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { CreatePostModal } from './src/components/CreatePostModal';
import { TabBar } from './src/components/TabBar';
import { SideNavigation } from './src/components/SideNavigation';
import { useAppStore } from './src/store/appStore';
import { MainAuthScreen } from './src/screens/auth/MainAuthScreen';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { RegisterScreen } from './src/screens/auth/RegisterScreen';
import { CreatePasswordScreen } from './src/screens/auth/CreatePasswordScreen';

function App() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const authLoading = useAppStore((state) => state.authLoading);
  const authError = useAppStore((state) => state.authError);
  const login = useAppStore((state) => state.login);
  const register = useAppStore((state) => state.register);
  const switchAccount = useAppStore((state) => state.switchAccount);
  const hydrateAuth = useAppStore((state) => state.hydrateAuth);
  const clearAuthError = useAppStore((state) => state.clearAuthError);
  const currentUser = useAppStore((state) => state.currentUser);
  const currentUserId = useAppStore((state) => state.currentUserId);
  const deviceAccounts = useAppStore((state) => state.deviceAccounts);

  const [authStep, setAuthStep] = useState('main');
  const [accountDraft, setAccountDraft] = useState(null);
  const [showAccountAuthFlow, setShowAccountAuthFlow] = useState(false);

  const [activeTab, setActiveTab] = useState('forYou');
  const [selectedProfileUserId, setSelectedProfileUserId] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showSideNavigation, setShowSideNavigation] = useState(false);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  const navigateAuth = (nextStep) => {
    clearAuthError();
    setAuthStep(nextStep);
  };

  const handleLogin = async ({ email, password }) => {
    const result = await login({ email, password });
    if (result.ok && showAccountAuthFlow) {
      setShowAccountAuthFlow(false);
      setAuthStep('main');
      setAccountDraft(null);
    }
  };

  const handleCreateAccount = async ({ fullName, username, email, birthday, password }) => {
    const result = await register({
      fullName,
      username,
      email,
      birthday,
      password,
    });

    if (result.ok) {
      setAccountDraft(null);
      setAuthStep('main');
      if (showAccountAuthFlow) {
        setShowAccountAuthFlow(false);
      }
    }
  };

  const handleOpenAddAccount = () => {
    clearAuthError();
    setShowSideNavigation(false);
    setAccountDraft(null);
    setAuthStep('main');
    setShowAccountAuthFlow(true);
  };

  const handleSwitchAccount = async (accountId) => {
    const result = await switchAccount(accountId);
    if (result.ok) {
      setShowSideNavigation(false);
      setSelectedProfileUserId(null);
      setActiveTab('profile');
    }
  };

  const handleOpenProfileFromTweet = (userId) => {
    if (!userId) {
      return;
    }

    setSelectedProfileUserId(userId);
    setActiveTab('profile');
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'forYou':
        return (
          <ForYouScreen
            onCreatePost={() => setShowCreatePost(true)}
            onOpenDrawer={() => setShowSideNavigation(true)}
            onOpenProfile={handleOpenProfileFromTweet}
          />
        );
      case 'search':
        return <SearchScreen onOpenDrawer={() => setShowSideNavigation(true)} />;
      case 'grok':
        return <GrokScreen onOpenDrawer={() => setShowSideNavigation(true)} />;
      case 'notifications':
        return <NotificationsScreen onOpenDrawer={() => setShowSideNavigation(true)} />;
      case 'messages':
        return <MessagesScreen onOpenDrawer={() => setShowSideNavigation(true)} />;
      case 'profile':
        return (
          <ProfileScreen
            onOpenDrawer={() => setShowSideNavigation(true)}
            profileUserId={selectedProfileUserId}
          />
        );
      case 'bookmarks':
        return <BookmarksScreen onOpenDrawer={() => setShowSideNavigation(true)} />;
      default:
        return (
          <ForYouScreen
            onCreatePost={() => setShowCreatePost(true)}
            onOpenDrawer={() => setShowSideNavigation(true)}
            onOpenProfile={handleOpenProfileFromTweet}
          />
        );
    }
  };

  if (!isAuthenticated || showAccountAuthFlow) {
    const renderAuthScreen = () => {
      switch (authStep) {
        case 'login':
          return (
            <LoginScreen
              onBack={() => navigateAuth('main')}
              onLogin={handleLogin}
              loading={authLoading}
              error={authError}
            />
          );
        case 'register':
          return (
            <RegisterScreen
              onBack={() => navigateAuth('main')}
              onContinue={(data) => {
                setAccountDraft(data);
                navigateAuth('password');
              }}
            />
          );
        case 'password':
          return (
            <CreatePasswordScreen
              onBack={() => navigateAuth('register')}
              onCreateAccount={handleCreateAccount}
              loading={authLoading}
              error={authError}
              accountInfo={accountDraft}
            />
          );
        case 'main':
        default:
          return (
            <MainAuthScreen
              onClose={showAccountAuthFlow ? () => setShowAccountAuthFlow(false) : undefined}
              onLogin={() => navigateAuth('login')}
              onRegister={() => navigateAuth('register')}
            />
          );
      }
    };

    return (
      <SafeAreaProvider>
        {renderAuthScreen()}
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        {renderScreen()}
        <TabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <SideNavigation
          visible={showSideNavigation}
          currentUser={currentUser}
          currentUserId={currentUserId}
          deviceAccounts={deviceAccounts}
          onClose={() => setShowSideNavigation(false)}
          onAddAccount={handleOpenAddAccount}
          onSwitchAccount={handleSwitchAccount}
          onNavigate={(tab) => {
            if (tab === 'profile') {
              setSelectedProfileUserId(null);
            }
            setActiveTab(tab);
            setShowSideNavigation(false);
          }}
        />
        <CreatePostModal
          visible={showCreatePost}
          onClose={() => setShowCreatePost(false)}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
