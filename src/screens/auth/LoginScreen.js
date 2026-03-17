import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native/icons';

export const LoginScreen = ({ onBack, onLogin, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const canContinue = email.trim().length > 4 && password.trim().length >= 8;

  const handleLogin = () => {
    if (!canContinue || loading) {
      return;
    }
    onLogin({ email: email.trim().toLowerCase(), password });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={onBack} style={styles.iconButton}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.logo}>𝕏</Text>
          <View style={styles.iconButton} />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.title}>Log in to X</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              selectionColor="#1d9bf0"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              selectionColor="#1d9bf0"
            />
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <TouchableOpacity
          style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
          onPress={handleLogin}
          disabled={!canContinue || loading}
          activeOpacity={0.9}
        >
          {loading ? (
            <ActivityIndicator color="#111" />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
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
  logo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  formSection: {
    marginTop: 18,
    gap: 18,
  },
  title: {
    color: '#fff',
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '800',
    marginBottom: 8,
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
