import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { Mail, Apple } from 'lucide-react-native/icons';
import { useAppStore } from '../../store/appStore';
import { transformNodeForDisplay } from '../../utils/themeTransform';

export const MainAuthScreen = ({ onLogin, onRegister, onClose }) => {
  const displayMode = useAppStore((state) => state.displayMode);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const systemScheme = useColorScheme();
  const isDark = displayMode === 'night' || (displayMode === 'system' && systemScheme === 'dark');
  const textScale = [0.92, 1, 1.08, 1.16][fontScaleLevel] || 1;
  const iconScale = [0.9, 1, 1.1, 1.2][fontScaleLevel] || 1;

  const contentNode = (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#000' : '#fff'} />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          disabled={!onClose}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>

        <View style={styles.headerSection}>
          <Text style={styles.logo}>𝕏</Text>
          <Text style={styles.title}>See what's happening right now.</Text>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.9}>
            <Mail size={18} color="#111" />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} activeOpacity={0.9}>
            <Apple size={18} color="#111" />
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={onRegister} activeOpacity={0.9}>
            <Text style={styles.primaryButtonText}>Create account</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By signing up, you agree to our Terms, Privacy Policy, and Cookie Use.
          </Text>
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.footerLabel}>Already have an account?</Text>
          <TouchableOpacity style={styles.ghostButton} onPress={onLogin} activeOpacity={0.9}>
            <Text style={styles.ghostButtonText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );

  return transformNodeForDisplay(contentNode, isDark, textScale, iconScale);
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  closeButton: {
    height: 44,
    width: 44,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 32,
  },
  headerSection: {
    marginTop: 12,
    gap: 22,
  },
  logo: {
    color: '#fff',
    fontSize: 44,
    fontWeight: '700',
    textAlign: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '800',
  },
  actionsSection: {
    marginTop: 28,
    gap: 14,
  },
  socialButton: {
    backgroundColor: '#fff',
    minHeight: 48,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  socialButtonText: {
    color: '#111',
    fontWeight: '700',
    fontSize: 15,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#2f3336',
  },
  dividerText: {
    color: '#71767b',
    textTransform: 'lowercase',
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#fff',
    minHeight: 50,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#111',
    fontSize: 17,
    fontWeight: '800',
  },
  termsText: {
    color: '#71767b',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  footerSection: {
    marginTop: 'auto',
    gap: 10,
  },
  footerLabel: {
    color: '#e7e9ea',
    fontSize: 16,
    fontWeight: '600',
  },
  ghostButton: {
    minHeight: 50,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#536471',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostButtonText: {
    color: '#1d9bf0',
    fontWeight: '800',
    fontSize: 17,
  },
});