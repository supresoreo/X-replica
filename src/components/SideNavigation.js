import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AudioLines,
  BadgeCheck,
  Bookmark,
  CircleEllipsis,
  CircleQuestionMark,
  Clapperboard,
  Download,
  Rocket,
  Settings,
  UserRound,
  UsersRound,
  ClipboardList,
} from 'lucide-react-native/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/appStore';
import { UserAvatar } from './UserAvatar';
import { FollowListModal } from './FollowListModal';

const DRAWER_WIDTH = 310;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const OPEN_GUARD_MS = 250;

export const SideNavigation = ({
  visible,
  dark = false,
  currentUser,
  currentUserId,
  deviceAccounts = [],
  onClose,
  onNavigate,
  onAddAccount,
  onSwitchAccount,
  onSelectProfile = null,
}) => {
  const [mounted, setMounted] = useState(visible);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [followListMode, setFollowListMode] = useState(null);
  const insets = useSafeAreaInsets();
  const knownUsers = useAppStore((state) => state.knownUsers);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const textScale = [0.92, 1, 1.08, 1.16][fontScaleLevel] || 1;
  const iconScale = [0.9, 1, 1.1, 1.2][fontScaleLevel] || 1;
  const colors = dark
    ? {
        drawerBg: '#000',
        border: '#16181c',
        textPrimary: '#fff',
        textSecondary: '#71767b',
        textTertiary: '#e7e9ea',
        divider: '#2f3336',
        icon: '#fff',
        sheetBg: '#1e2124',
        sheetHandle: '#3e4145',
      }
    : {
        drawerBg: '#fff',
        border: '#d8e0e5',
        textPrimary: '#0f1419',
        textSecondary: '#536471',
        textTertiary: '#22303c',
        divider: '#e6ecf0',
        icon: '#0f1419',
        sheetBg: '#f7f9fb',
        sheetHandle: '#b6c0c8',
      };
  const visibleRef = useRef(visible);
  const drawerOpenedAtRef = useRef(0);
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const sheetOverlayOpacity = useRef(new Animated.Value(0)).current;

  const openAccountSheet = useCallback(() => {
    setSheetVisible(true);
    Animated.parallel([
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(sheetOverlayOpacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  }, [sheetOverlayOpacity, sheetTranslateY]);

  const closeAccountSheet = useCallback(() => {
    Animated.parallel([
      Animated.timing(sheetTranslateY, {
        toValue: SCREEN_HEIGHT,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(sheetOverlayOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSheetVisible(false);
    });
  }, [sheetOverlayOpacity, sheetTranslateY]);

  useEffect(() => {
    visibleRef.current = visible;

    if (visible) {
      setMounted(true);
      drawerOpenedAtRef.current = Date.now();
      translateX.stopAnimation();
      overlayOpacity.stopAnimation();
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    translateX.stopAnimation();
    overlayOpacity.stopAnimation();

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -DRAWER_WIDTH,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (!visibleRef.current) {
        setMounted(false);
      }
    });
  }, [overlayOpacity, translateX, visible]);

  const handleOverlayPress = () => {
    if (Date.now() - drawerOpenedAtRef.current < OPEN_GUARD_MS) {
      return;
    }

    onClose?.();
  };

  const menuItems = useMemo(
    () => [
      { key: 'profile', label: 'Profile', icon: UserRound, route: 'profile' },
      { key: 'premium', label: 'Premium', icon: BadgeCheck, route: 'premium' },
      { key: 'video', label: 'Video', icon: Clapperboard },
      { key: 'communities', label: 'Communities', icon: UsersRound, route: 'communities' },
      { key: 'bookmarks', label: 'Bookmarks', icon: Bookmark, route: 'bookmarks' },
      { key: 'lists', label: 'Lists', icon: ClipboardList, route: 'lists' },
      { key: 'spaces', label: 'Spaces', icon: AudioLines, route: 'spaces' },
      { key: 'creator-studio', label: 'Creator Studio', icon: Rocket, badge: 'New', route: 'creatorStudio' },
    ],
    []
  );

  const utilityItems = useMemo(
    () => [
      { key: 'download-grok', label: 'Download Grok', icon: Download },
      { key: 'settings', label: 'Settings and privacy', icon: Settings, route: 'settings' },
      { key: 'help', label: 'Help Center', icon: CircleQuestionMark },
    ],
    []
  );

  const handlePress = (item) => {
    if (item.route) {
      onNavigate(item.route);
      return;
    }

    onClose();
  };

  const accountEntries = useMemo(() => {
    return deviceAccounts
      .map((account) => {
        const user = knownUsers.find((entry) => entry.id === account.userId);
        return user ? { ...account, user } : null;
      })
      .filter(Boolean);
  }, [deviceAccounts, knownUsers]);

  if (!mounted) {
    return null;
  }

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleOverlayPress} />
        </Animated.View>

        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX }],
              backgroundColor: colors.drawerBg,
              borderRightColor: colors.border,
            },
          ]}
        > 
          <ScrollView
            style={[styles.scroll, { backgroundColor: colors.drawerBg }]}
            contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 28 }]}
          >
            <View style={styles.topRow}>
              <TouchableOpacity
                style={styles.miniAvatarWrap}
                activeOpacity={0.82}
                onPress={() => onNavigate('profile')}
              >
                <UserAvatar
                  imageUri={currentUser?.avatarImage}
                  fallbackText={currentUser?.avatar || currentUser?.displayName?.charAt(0) || 'U'}
                  backgroundColor={currentUser?.averageColor || '#171717'}
                  size={36}
                  style={styles.miniAvatar}
                  borderWidth={1}
                  borderColor="#2f3336"
                />
                <View style={styles.badgeBubble}>
                  <Text style={[styles.badgeText, { fontSize: 12 * textScale }]}>1</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.moreButton, { borderColor: colors.divider }]} activeOpacity={0.8} onPress={openAccountSheet}>
                <CircleEllipsis size={22 * iconScale} color={colors.icon} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.profileBlock}
              activeOpacity={0.82}
              onPress={() => onNavigate('profile')}
            >
              <UserAvatar
                imageUri={currentUser?.avatarImage}
                fallbackText={currentUser?.avatar || currentUser?.displayName?.charAt(0) || 'U'}
                backgroundColor={currentUser?.averageColor || '#111111'}
                size={52}
                style={styles.profileAvatar}
                borderWidth={1}
                borderColor="#2f3336"
              />
              <Text style={[styles.displayName, { color: colors.textPrimary, fontSize: 28 * textScale }]}>{currentUser?.displayName || 'User'}</Text>
              <Text style={[styles.username, { color: colors.textSecondary, fontSize: 18 * textScale }]}>{currentUser?.username || '@user'}</Text>

              <View style={styles.statsRow}>
                <TouchableOpacity onPress={() => setFollowListMode('following')}>
                  <Text style={[styles.statText, { color: colors.textTertiary, fontSize: 17 * textScale }]}>
                    <Text style={[styles.statValue, { color: colors.textPrimary }]}>{currentUser?.following || 0}</Text> Following
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFollowListMode('followers')}>
                  <Text style={[styles.statText, { color: colors.textTertiary, fontSize: 17 * textScale }]}>
                    <Text style={[styles.statValue, { color: colors.textPrimary }]}>{currentUser?.followers || 0}</Text> Followers
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            <View style={styles.menuSection}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={styles.menuItem}
                    activeOpacity={0.82}
                    onPress={() => handlePress(item)}
                  >
                    <Icon size={27 * iconScale} color={colors.icon} strokeWidth={2.1} />
                    <Text style={[styles.menuLabel, { color: colors.textPrimary, fontSize: 22 * textScale }]}>{item.label}</Text>
                    {item.badge ? (
                      <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>{item.badge}</Text>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={[styles.divider, { borderBottomColor: colors.divider }]} />

            <View style={styles.utilitySection}>
              {utilityItems.map((item) => {
                const Icon = item.icon;
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={styles.utilityItem}
                    activeOpacity={0.82}
                    onPress={() => handlePress(item)}
                  >
                    <Icon size={24 * iconScale} color={colors.icon} strokeWidth={2} />
                    <Text style={[styles.utilityLabel, { color: colors.textPrimary, fontSize: 17 * textScale }]}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={[styles.divider, { borderBottomColor: colors.divider }]} />

          </ScrollView>
        </Animated.View>

        {/* Accounts bottom sheet */}
        {sheetVisible ? (
          <>
            <Animated.View style={[styles.sheetOverlay, { opacity: sheetOverlayOpacity }]}>
              <Pressable style={StyleSheet.absoluteFill} onPress={closeAccountSheet} />
            </Animated.View>
            <Animated.View
              style={[
                styles.sheet,
                {
                  paddingBottom: insets.bottom + 16,
                  transform: [{ translateY: sheetTranslateY }],
                  backgroundColor: colors.sheetBg,
                },
              ]}
            >
              <View style={[styles.sheetHandle, { backgroundColor: colors.sheetHandle }]} />
              <View style={styles.sheetHeader}>
                <TouchableOpacity activeOpacity={0.7} onPress={closeAccountSheet}>
                  <Text style={[styles.sheetEditText, { color: colors.textTertiary, fontSize: 15 * textScale }]}>Edit</Text>
                </TouchableOpacity>
                <Text style={[styles.sheetTitle, { color: colors.textTertiary, fontSize: 16 * textScale }]}>Accounts</Text>
                <View style={styles.sheetHeaderSpacer} />
              </View>
              {accountEntries.map((account) => {
                const isActive = account.user.id === currentUserId;
                return (
                  <TouchableOpacity
                    key={account.userId}
                    style={styles.sheetAccountRow}
                    activeOpacity={0.82}
                    onPress={() => {
                      closeAccountSheet();
                      if (!isActive) {
                        onSwitchAccount?.(account.userId);
                      }
                    }}
                  >
                    <UserAvatar
                      imageUri={account.user.avatarImage}
                      fallbackText={account.user.avatar || account.user.displayName?.charAt(0)}
                      backgroundColor={account.user.averageColor || '#171717'}
                      size={46}
                    />
                    <View style={styles.sheetAccountTextWrap}>
                      <Text style={[styles.sheetAccountName, { color: colors.textPrimary, fontSize: 16 * textScale }]}>{account.user.displayName}</Text>
                      <Text style={[styles.sheetAccountHandle, { color: colors.textSecondary, fontSize: 14 * textScale }]}>{account.user.username}</Text>
                    </View>
                    {isActive ? (
                      <View style={styles.sheetCheckCircle}>
                        <Text style={styles.sheetCheckMark}>✓</Text>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                style={styles.sheetAddAccount}
                activeOpacity={0.7}
                onPress={() => {
                  closeAccountSheet();
                  onAddAccount?.();
                }}
              >
                <Text style={[styles.sheetAddAccountText, { fontSize: 16 * textScale }]}>Add an account</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        ) : null}

        <FollowListModal
          visible={Boolean(followListMode)}
          mode={followListMode}
          userId={currentUser?.id}
          onClose={() => setFollowListMode(null)}
          onSelectProfile={(userId) => {
            setFollowListMode(null);
            onClose?.();
            if (onSelectProfile) {
              onSelectProfile(userId);
            } else {
              // Fallback: navigate to profile screen
              onNavigate?.('profile');
            }
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 20, 25, 0.55)',
  },
  drawer: {
    width: DRAWER_WIDTH,
    maxWidth: '82%',
    backgroundColor: '#000',
    borderRightWidth: 1,
    borderRightColor: '#16181c',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 4, height: 0 },
    elevation: 12,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    paddingHorizontal: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  miniAvatarWrap: {
    position: 'relative',
  },
  miniAvatar: {
  },
  badgeBubble: {
    position: 'absolute',
    right: -6,
    top: -6,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1d9bf0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  moreButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#2f3336',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileBlock: {
    marginBottom: 18,
  },
  profileAvatar: {
    marginBottom: 14,
  },
  displayName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 2,
  },
  username: {
    color: '#71767b',
    fontSize: 18,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 18,
  },
  statText: {
    color: '#e7e9ea',
    fontSize: 17,
  },
  statValue: {
    color: '#fff',
    fontWeight: '800',
  },
  menuSection: {
    marginTop: 10,
  },
  menuItem: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginLeft: 20,
  },
  newBadge: {
    marginLeft: 'auto',
    backgroundColor: '#1d9bf0',
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    marginTop: 18,
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#2f3336',
  },
  utilitySection: {
    gap: 2,
  },
  utilityItem: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  utilityLabel: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
    marginLeft: 18,
  },
  accountsSection: {
    marginTop: 4,
  },
  accountsTitle: {
    color: '#71767b',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  accountRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accountTextWrap: {
    flex: 1,
  },
  accountName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  accountHandle: {
    color: '#71767b',
    fontSize: 14,
  },
  activeAccountText: {
    color: '#1d9bf0',
    fontSize: 14,
    fontWeight: '700',
  },
  addAccountButton: {
    marginTop: 10,
    minHeight: 44,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2f3336',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAccountText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  // Bottom sheet
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 20, 25, 0.65)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1e2124',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3e4145',
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sheetEditText: {
    color: '#e7e9ea',
    fontSize: 15,
    fontWeight: '500',
    width: 36,
  },
  sheetTitle: {
    color: '#e7e9ea',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  sheetHeaderSpacer: {
    width: 36,
  },
  sheetAccountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 10,
  },
  sheetAccountTextWrap: {
    flex: 1,
  },
  sheetAccountName: {
    color: '#e7e9ea',
    fontSize: 16,
    fontWeight: '700',
  },
  sheetAccountHandle: {
    color: '#71767b',
    fontSize: 14,
    marginTop: 2,
  },
  sheetCheckCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1d9bf0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetCheckMark: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  sheetAddAccount: {
    paddingVertical: 18,
    marginTop: 4,
  },
  sheetAddAccountText: {
    color: '#1d9bf0',
    fontSize: 16,
    fontWeight: '500',
  },
});