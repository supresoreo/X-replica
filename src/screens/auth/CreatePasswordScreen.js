import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native/icons';

export const CreatePasswordScreen = ({
  onBack,
  onCreateAccount,
  loading,
  error,
  accountInfo = {},
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrongEnough = password.trim().length >= 8;
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const canSubmit = passwordStrongEnough && passwordsMatch;

  const mismatchText = useMemo(() => {
    if (!confirmPassword.length) {
      return '';
    }

    return passwordsMatch ? '' : 'Passwords do not match';
  }, [confirmPassword, passwordsMatch]);

  const handleSubmit = () => {
    if (!canSubmit || loading) {
      return;
    }

    onCreateAccount({
      ...accountInfo,
      password,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={onBack} style={styles.iconButton}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Create a password</Text>
          <View style={styles.iconButton} />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.subtitle}>
            Choose a strong password with at least 8 characters.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                selectionColor="#1d9bf0"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#71767b" />
                ) : (
                  <Eye size={20} color="#71767b" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              selectionColor="#1d9bf0"
            />
            {!!mismatchText && <Text style={styles.errorText}>{mismatchText}</Text>}
            {!!error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.continueButton, !canSubmit && styles.continueButtonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || loading}
          activeOpacity={0.9}
        >
          {loading ? (
            <ActivityIndicator color="#111" />
          ) : (
            <Text style={styles.continueButtonText}>Create account</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topTitle: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '700',
  },
  formSection: {
    marginTop: 20,
    gap: 18,
  },
  subtitle: {
    color: '#e7e9ea',
    fontSize: 15,
    lineHeight: 22,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: '#71767b',
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#2f3336',
    borderRadius: 10,
    color: '#fff',
    paddingHorizontal: 14,
    fontSize: 17,
  },
  passwordRow: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#2f3336',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
  },
  passwordInput: {
    flex: 1,
    color: '#fff',
    fontSize: 17,
  },
  eyeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#f4212e',
    fontSize: 14,
    lineHeight: 20,
  },
  continueButton: {
    marginTop: 'auto',
    minHeight: 52,
    borderRadius: 999,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#3a3d40',
  },
  continueButtonText: {
    color: '#111',
    fontSize: 19,
    fontWeight: '800',
  },
});
