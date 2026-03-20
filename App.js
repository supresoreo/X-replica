import React, { useEffect, useState } from 'react';
import { Animated, Easing, StatusBar, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ForYouScreen } from './src/screens/ForYouScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { MessagesScreen } from './src/screens/MessagesScreen';
import { BookmarksScreen } from './src/screens/BookmarksScreen';
import { GrokScreen } from './src/screens/GrokScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { PremiumScreen } from './src/screens/PremiumScreen';
import { CommunitiesScreen } from './src/screens/CommunitiesScreen';
import { ListsScreen } from './src/screens/ListsScreens';
import { SpacesScreen } from './src/screens/SpacesScreen';
import { CreatorStudioScreen } from './src/screens/CreatorStudioScreen';
import { CreatorProgramScreen } from './src/screens/CreatorProgramScreen';
import { InspirationScreen } from './src/screens/InspirationScreen';
import { SettingsScreen, YourAccountScreen, AccountInformationScreen } from './src/screens/SettingsScreens';
import { TweetDetailScreen } from './src/screens/TweetDetailScreen';
import {
  AccessibilityDisplayLanguagesScreen,
  AccessibilitySettingsScreen,
  DataUsageSettingsScreen,
  DisplaySettingsScreen,
  LanguagesSettingsScreen,
} from './src/screens/AccessibilityDisplayLanguagesScreen';
import { CreatePostModal } from './src/components/CreatePostModal';
import { TabBar } from './src/components/TabBar';
import { SideNavigation } from './src/components/SideNavigation';
import { useAppStore } from './src/store/appStore';
import { MainAuthScreen } from './src/screens/auth/MainAuthScreen';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { RegisterScreen } from './src/screens/auth/RegisterScreen';
import { CreatePasswordScreen } from './src/screens/auth/CreatePasswordScreen';

const LIGHT_BG_VALUES = new Set(['#fff', '#ffffff', '#f7f9fb', '#eff3f4']);
const LIGHT_BORDER_VALUES = new Set(['#e6ecf0', '#eff3f4', '#d8e0e5']);
const DARK_TEXT_VALUES = new Set(['#000', '#000000', '#0f1419', '#111111']);
const LIGHT_MUTED_TEXT_VALUES = new Set(['#536471', '#657786', '#5b7083']);
const LAST_ACTIVE_TAB_KEY = '@xclone_last_active_tab';
const RESTORABLE_TABS = new Set([
  'forYou',
  'search',
  'grok',
  'notifications',
  'messages',
  'profile',
  'bookmarks',
  'premium',
  'communities',
  'lists',
  'spaces',
  'creatorStudio',
  'creatorRevenueSharing',
  'creatorSubscriptions',
  'inspiration',
  'settings',
  'settingsAccessibilityDisplayLanguages',
  'settingsAccessibility',
  'settingsDisplay',
  'settingsLanguages',
  'settingsDataUsage',
]);

const MAIN_TABS = new Set([
  'forYou',
  'search',
  'grok',
  'notifications',
  'messages',
  'profile',
  'bookmarks',
  'premium',
  'communities',
  'lists',
  'spaces',
  'creatorStudio',
  'creatorRevenueSharing',
  'creatorSubscriptions',
  'inspiration',
  'settings',
  'settingsAccessibilityDisplayLanguages',
  'settingsAccessibility',
  'settingsDisplay',
  'settingsLanguages',
  'settingsDataUsage',
]);

const normalizeColorValue = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  return value.trim().toLowerCase();
};

const adaptColorByKey = (styleKey, styleValue, isDark) => {
  if (typeof styleValue !== 'string' || !styleValue.startsWith('#')) {
    return styleValue;
  }

  const normalized = normalizeColorValue(styleValue);
  const normalizedKey = (styleKey || '').toLowerCase();
  const isBackgroundKey = normalizedKey.includes('backgroundcolor');
  const isBorderKey = normalizedKey.includes('border') && normalizedKey.includes('color');
  const isTextColorKey = normalizedKey === 'color' || normalizedKey.includes('textcolor') || normalizedKey.includes('placeholdertextcolor');
  const isVectorColorKey = normalizedKey === 'fill' || normalizedKey === 'stroke' || normalizedKey.includes('tintcolor');

  if (isBackgroundKey) {
    if (isDark && LIGHT_BG_VALUES.has(normalized)) {
      return '#000000';
    }
    return styleValue;
  }

  if (isBorderKey) {
    if (isDark && LIGHT_BORDER_VALUES.has(normalized)) {
      return '#2f3336';
    }
    return styleValue;
  }

  if (isTextColorKey || isVectorColorKey) {
    if (isDark && DARK_TEXT_VALUES.has(normalized)) {
      return '#f2f2f2';
    }
    if (isDark && LIGHT_MUTED_TEXT_VALUES.has(normalized)) {
      return '#8b98a5';
    }
    return styleValue;
  }

  return styleValue;
};

const transformStyleObject = (style, isDark, textScale) => {
  if (!style) {
    return style;
  }

  if (Array.isArray(style)) {
    return style.map((entry) => transformStyleObject(entry, isDark, textScale));
  }

  if (typeof style === 'number') {
    return transformStyleObject(StyleSheet.flatten(style), isDark, textScale);
  }

  if (typeof style !== 'object') {
    return style;
  }

  const next = { ...style };

  Object.keys(next).forEach((key) => {
    next[key] = adaptColorByKey(key, next[key], isDark);
  });

  if (typeof next.fontSize === 'number') {
    next.fontSize = next.fontSize * textScale;
  }

  if (typeof next.lineHeight === 'number') {
    next.lineHeight = next.lineHeight * textScale;
  }

  return next;
};

const transformScreenTree = (node, isDark, textScale, iconScale) => {
  if (!React.isValidElement(node)) {
    return node;
  }

  const nextProps = {};
  const originalStyle = node.props?.style;

  if (originalStyle) {
    nextProps.style = transformStyleObject(originalStyle, isDark, textScale);
  }

  if (typeof node.props?.size === 'number') {
    nextProps.size = node.props.size * iconScale;
  }

  if (typeof node.props?.color === 'string') {
    nextProps.color = adaptColorByKey('color', node.props.color, isDark);
  }

  if (typeof node.props?.fill === 'string') {
    nextProps.fill = adaptColorByKey('fill', node.props.fill, isDark);
  }

  if (typeof node.props?.stroke === 'string') {
    nextProps.stroke = adaptColorByKey('stroke', node.props.stroke, isDark);
  }

  if (typeof node.props?.placeholderTextColor === 'string') {
    nextProps.placeholderTextColor = adaptColorByKey('placeholderTextColor', node.props.placeholderTextColor, isDark);
  }

  if (node.type === Text || node.type === TextInput) {
    const baseTextStyle = originalStyle ? transformStyleObject(originalStyle, isDark, textScale) : {};
    nextProps.style = [baseTextStyle, !originalStyle ? { fontSize: 16 * textScale } : null];
  }

  if (node.props?.children) {
    nextProps.children = React.Children.map(node.props.children, (child) =>
      transformScreenTree(child, isDark, textScale, iconScale)
    );
  }

  return React.cloneElement(node, nextProps);
};

function App() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const authLoading = useAppStore((state) => state.authLoading);
  const authError = useAppStore((state) => state.authError);
  const login = useAppStore((state) => state.login);
  const register = useAppStore((state) => state.register);
  const switchAccount = useAppStore((state) => state.switchAccount);
  const hydrateAuth = useAppStore((state) => state.hydrateAuth);
  const clearAuthError = useAppStore((state) => state.clearAuthError);
  const logout = useAppStore((state) => state.logout);
  const currentUser = useAppStore((state) => state.currentUser);
  const currentUserId = useAppStore((state) => state.currentUserId);
  const deviceAccounts = useAppStore((state) => state.deviceAccounts);
  const displayMode = useAppStore((state) => state.displayMode);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const tweets = useAppStore((state) => state.tweets);
  const systemColorScheme = useColorScheme();

  const [authStep, setAuthStep] = useState('main');
  const [accountDraft, setAccountDraft] = useState(null);
  const [showAccountAuthFlow, setShowAccountAuthFlow] = useState(false);

  const [activeTab, setActiveTab] = useState('forYou');
  const [selectedProfileUserId, setSelectedProfileUserId] = useState(null);
  const [selectedTweetId, setSelectedTweetId] = useState(null);
  const [tweetReturnTab, setTweetReturnTab] = useState('forYou');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showSideNavigation, setShowSideNavigation] = useState(false);
  const [settingsScreen, setSettingsScreen] = useState('settings');
  const [screenAnim] = useState(() => new Animated.Value(1));
  const [showStartupSplash, setShowStartupSplash] = useState(true);
  const [startupTabReady, setStartupTabReady] = useState(false);
  const [splashScale] = useState(() => new Animated.Value(1));
  const [splashOpacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    let isMounted = true;

    const bootstrapApp = async () => {
      const startupTime = Date.now();

      await hydrateAuth();

      try {
        const savedTab = await AsyncStorage.getItem(LAST_ACTIVE_TAB_KEY);
        if (isMounted && savedTab && RESTORABLE_TABS.has(savedTab)) {
          setActiveTab(savedTab);
        }
      } catch {
        // Ignore storage restore issues and keep default home tab.
      } finally {
        if (isMounted) {
          setStartupTabReady(true);
        }
      }

      const elapsed = Date.now() - startupTime;
      const minimumSplashMs = 550;
      if (elapsed < minimumSplashMs) {
        await new Promise((resolve) => setTimeout(resolve, minimumSplashMs - elapsed));
      }

      if (!isMounted) {
        return;
      }

      Animated.parallel([
        Animated.timing(splashScale, {
          toValue: 16,
          duration: 900,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(splashOpacity, {
          toValue: 0,
          duration: 760,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (isMounted) {
          setShowStartupSplash(false);
        }
      });
    };

    bootstrapApp();

    return () => {
      isMounted = false;
    };
  }, [hydrateAuth, splashOpacity, splashScale]);

  useEffect(() => {
    if (!startupTabReady) {
      return;
    }

    AsyncStorage.setItem(LAST_ACTIVE_TAB_KEY, activeTab).catch(() => {
      // Ignore storage write issues for navigation restore.
    });
  }, [activeTab, startupTabReady]);

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
    if (nextTab !== 'settings') {
      setSettingsScreen('settings');
    }
  };

  const isDarkScreen =
    displayMode === 'night' ||
    (displayMode === 'system' && systemColorScheme === 'dark');

  const textScale = [0.92, 1, 1.08, 1.16][fontScaleLevel] || 1;
  const iconScale = [0.9, 1, 1.1, 1.2][fontScaleLevel] || 1;

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

  const handleOpenTweet = (tweet) => {
    const tweetId = tweet?.id;
    if (!tweetId) {
      return;
    }

    if (MAIN_TABS.has(activeTab)) {
      setTweetReturnTab(activeTab);
    }

    setSelectedTweetId(tweetId);
    handleTabChange('tweetDetail');
  };

  const handleCloseTweetDetail = () => {
    setSelectedTweetId(null);
    handleTabChange(tweetReturnTab || 'forYou');
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
            onOpenTweet={handleOpenTweet}
          />
        );
      case 'search':
        return <SearchScreen onOpenDrawer={handleOpenDrawer} />;
      case 'grok':
        return <GrokScreen onOpenDrawer={handleOpenDrawer} />;
      case 'notifications':
        return (
          <NotificationsScreen
            onOpenDrawer={handleOpenDrawer}
            onOpenTweet={handleOpenTweet}
            onSelectProfile={(userId) => {
              setSelectedProfileUserId(userId);
              handleTabChange('profile');
            }}
          />
        );
      case 'messages':
        return <MessagesScreen onOpenDrawer={handleOpenDrawer} />;
      case 'profile':
        return (
          <ProfileScreen
            onOpenDrawer={handleOpenDrawer}
            profileUserId={selectedProfileUserId}
            onOpenTweet={handleOpenTweet}
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
        return (
          <BookmarksScreen
            onOpenDrawer={handleOpenDrawer}
            onOpenProfile={handleOpenProfileFromTweet}
            onOpenTweet={handleOpenTweet}
          />
        );
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
            onOpenProfile={handleOpenProfileFromTweet}
            onOpenTweet={handleOpenTweet}
          />
        );
      case 'tweetDetail': {
        const selectedTweet = tweets.find((tweet) => tweet.id === selectedTweetId) || null;
        return (
          <TweetDetailScreen
            tweet={selectedTweet}
            onBack={handleCloseTweetDetail}
            onOpenProfile={handleOpenProfileFromTweet}
          />
        );
      }
      case 'settings':
        if (settingsScreen === 'your-account') {
          return (
            <YourAccountScreen
              onBack={() => setSettingsScreen('settings')}
              onSelectAccountInfo={() => setSettingsScreen('account-information')}
            />
          );
        } else if (settingsScreen === 'account-information') {
          return (
            <AccountInformationScreen
              onBack={() => setSettingsScreen('your-account')}
              logout={async () => {
                await logout();
                handleTabChange('forYou');
                setSettingsScreen('settings');
              }}
            />
          );
        }
        return (
          <SettingsScreen
            onBack={() => handleTabChange('forYou')}
            onOpenAccessibilityDisplayLanguages={() => handleTabChange('settingsAccessibilityDisplayLanguages')}
            onOpenYourAccount={() => setSettingsScreen('your-account')}
          />
        );
      case 'settingsAccessibilityDisplayLanguages':
        return (
          <AccessibilityDisplayLanguagesScreen
            onBack={() => handleTabChange('settings')}
            onOpenAccessibility={() => handleTabChange('settingsAccessibility')}
            onOpenDisplay={() => handleTabChange('settingsDisplay')}
            onOpenLanguages={() => handleTabChange('settingsLanguages')}
            onOpenDataUsage={() => handleTabChange('settingsDataUsage')}
          />
        );
      case 'settingsAccessibility':
        return (
          <AccessibilitySettingsScreen
            onBack={() => handleTabChange('settingsAccessibilityDisplayLanguages')}
          />
        );
      case 'settingsDisplay':
        return (
          <DisplaySettingsScreen
            onBack={() => handleTabChange('settingsAccessibilityDisplayLanguages')}
          />
        );
      case 'settingsLanguages':
        return (
          <LanguagesSettingsScreen
            onBack={() => handleTabChange('settingsAccessibilityDisplayLanguages')}
          />
        );
      case 'settingsDataUsage':
        return (
          <DataUsageSettingsScreen
            onBack={() => handleTabChange('settingsAccessibilityDisplayLanguages')}
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

  const appContent = (!isAuthenticated || showAccountAuthFlow) ? (
    transformScreenTree(renderAuthScreen(), isDarkScreen, textScale, iconScale)
  ) : (
    <View style={[styles.container, isDarkScreen ? styles.containerDark : styles.containerLight]}>
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
        {transformScreenTree(renderScreen(), isDarkScreen, textScale, iconScale)}
      </Animated.View>
      {MAIN_TABS.has(activeTab) ? (
        <TabBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          dark={isDarkScreen}
        />
      ) : null}
      <SideNavigation
        visible={showSideNavigation}
        dark={isDarkScreen}
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
  );

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkScreen ? 'light-content' : 'dark-content'} backgroundColor={isDarkScreen ? '#000' : '#fff'} />
      {appContent}
      {showStartupSplash ? (
        <Animated.View
          style={[
            styles.startupSplash,
            {
              opacity: splashOpacity,
            },
          ]}
          pointerEvents="none"
        >
          <Animated.Text
            style={[
              styles.startupLogo,
              {
                transform: [{ scale: splashScale }],
              },
            ]}
          >
            𝕏
          </Animated.Text>
        </Animated.View>
      ) : null}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#000',
  },
  screenWrap: {
    flex: 1,
  },
  startupSplash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  startupLogo: {
    color: '#ffffff',
    fontSize: 86,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});

export default App;