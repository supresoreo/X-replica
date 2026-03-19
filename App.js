/**
 * Twitter/X Clone App
 * A full-featured social media app with Zustand state management
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { Animated, Easing, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ForYouScreen } from './src/screens/ForYouScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { MessagesScreen } from './src/screens/MessagesScreen';
import { BookmarksScreen } from './src/screens/BookmarksScreen';
import { GrokScreen } from './src/screens/GrokScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { PremiumScreen } from './src/screens/PremiumScreen';
import { CommunitiesScreen } from './src/screens/CommunitiesScreen';
import { ListsScreen } from './src/screens/ListsScreen';
import { SpacesScreen } from './src/screens/SpacesScreen';
import { CreatorStudioScreen } from './src/screens/CreatorStudioScreen';
import { CreatorProgramScreen } from './src/screens/CreatorProgramScreen';
import { InspirationScreen } from './src/screens/InspirationScreen';
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
  const [screenAnim] = useState(() => new Animated.Value(1));

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    if (!isAuthenticated || showAccountAuthFlow) {
      setShowSideNavigation(false);
    }
  }, [isAuthenticated, showAccountAuthFlow]);

  useEffect(() => {
    screenAnim.stopAnimation();
    screenAnim.setValue(0);

    Animated.timing(screenAnim, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [activeTab, screenAnim]);

  const handleTabChange = (nextTab) => {
    setActiveTab(nextTab);
  };

  const isDarkScreen = [
    'communities',
    'lists',
    'spaces',
    'creatorStudio',
    'creatorRevenueSharing',
    'creatorSubscriptions',
    'inspiration',
  ].includes(activeTab);

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
      handleTabChange('profile');
    }
  };

  const handleOpenProfileFromTweet = (userId) => {
    if (!userId) {
      return;
    }

    setSelectedProfileUserId(userId);
    handleTabChange('profile');
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
                handleTabChange('messages');
              } else {
                setSelectedProfileUserId(userId);
                handleTabChange('profile');
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
      case 'lists':
        return <ListsScreen onBack={() => handleTabChange('forYou')} />;
      case 'spaces':
        return <SpacesScreen onBack={() => handleTabChange('forYou')} />;
      case 'creatorStudio':
        return (
          <CreatorStudioScreen
            onBack={() => handleTabChange('forYou')}
            onOpenRevenueSharing={() => handleTabChange('creatorRevenueSharing')}
            onOpenSubscriptions={() => handleTabChange('creatorSubscriptions')}
            onOpenInspiration={() => handleTabChange('inspiration')}
          />
        );
      case 'creatorRevenueSharing':
        return (
          <CreatorProgramScreen
            program="revenue"
            onBack={() => handleTabChange('creatorStudio')}
          />
        );
      case 'creatorSubscriptions':
        return (
          <CreatorProgramScreen
            program="subscriptions"
            onBack={() => handleTabChange('creatorStudio')}
          />
        );
      case 'inspiration':
        return (
          <InspirationScreen
            onBack={() => handleTabChange('creatorStudio')}
          />
        );
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
      <StatusBar barStyle={isDarkScreen ? 'light-content' : 'dark-content'} backgroundColor={isDarkScreen ? '#000' : '#fff'} />
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.screenWrap,
            {
              opacity: screenAnim,
              transform: [
                {
                  translateY: screenAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [14, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {renderScreen()}
        </Animated.View>
        <TabBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          dark={isDarkScreen}
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
            handleTabChange(tab);
            setShowSideNavigation(false);
          }}
          onSelectProfile={(userId) => {
            setSelectedProfileUserId(userId);
            handleTabChange('profile');
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
  screenWrap: {
    flex: 1,
  },
});

export default App;
