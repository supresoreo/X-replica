/**
 * Twitter/X Clone App
 * A full-featured social media app with Zustand state management
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
// 1. Import SafeAreaView and SafeAreaProvider
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { ForYouScreen } from './src/screens/ForYouScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { MessagesScreen } from './src/screens/MessagesScreen';
import { BookmarksScreen } from './src/screens/BookmarksScreen';
import { GrokScreen } from './src/screens/GrokScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { PremiumScreen } from './src/screens/PremiumScreen';
import { CommunitiesScreen } from './src/screens/CommunitiesScreen';
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

  const handleAuthBack = () => {
    clearAuthError();

    if (showAccountAuthFlow) {
      setShowAccountAuthFlow(false);
      setAuthStep('main');
      setAccountDraft(null);
      return;
    }

    switch (authStep) {
      case 'login':
      case 'register':
        setAuthStep('main');
        break;

      case 'password':
        setAuthStep('register');
        break;

      default:
        setAuthStep('main');
        break;
    }
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

  const handleOpenDrawer = () => {
    setShowSideNavigation(true);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'forYou':
        return (
          <ForYouScreen
            onCreatePost={() => setShowCreatePost(true)}
            onOpenDrawer={handleOpenDrawer}
            onOpenProfile={handleOpenProfileFromTweet}
          />
        );
      case 'search':
        return <SearchScreen onOpenDrawer={handleOpenDrawer} />;
      case 'grok':
        return <GrokScreen onOpenDrawer={handleOpenDrawer} />;
      case 'notifications':
        return <NotificationsScreen onOpenDrawer={handleOpenDrawer} />;
      case 'messages':
        return <MessagesScreen onOpenDrawer={handleOpenDrawer} />;
      case 'profile':
        return (
          <ProfileScreen
            onOpenDrawer={handleOpenDrawer}
            profileUserId={selectedProfileUserId}
            onSelectProfile={(userId, targetTab) => {
              if (targetTab === 'messages') {
                setSelectedProfileUserId(null);
                setActiveTab('messages');
              } else {
                setSelectedProfileUserId(userId);
                setActiveTab('profile');
              }
            }}
          />
        );
      case 'bookmarks':
        return <BookmarksScreen onOpenDrawer={handleOpenDrawer} />;
      case 'premium':
        return <PremiumScreen onOpenDrawer={handleOpenDrawer} />;
      case 'communities':
        return <CommunitiesScreen onOpenDrawer={handleOpenDrawer} />;
      default:
        return (
          <ForYouScreen
            onCreatePost={() => setShowCreatePost(true)}
            onOpenDrawer={handleOpenDrawer}
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
              onBack={handleAuthBack}
              onLogin={handleLogin}
              loading={authLoading}
              error={authError}
            />
          );
        case 'register':
          return (
            <RegisterScreen
              onBack={handleAuthBack}
              onContinue={(data) => {
                setAccountDraft(data);
                navigateAuth('password');
              }}
            />
          );
        case 'password':
          return (
            <CreatePasswordScreen
              onBack={handleAuthBack}
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
        {/* Added SafeAreaView for Auth with black background */}
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }} edges={['top', 'bottom']}>
          {renderAuthScreen()}
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      {/* Added SafeAreaView for Main app with white background */}
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
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
            onSelectProfile={(userId) => {
              setSelectedProfileUserId(userId);
              setActiveTab('profile');
            }}
          />
          <CreatePostModal
            visible={showCreatePost}
            onClose={() => setShowCreatePost(false)}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;