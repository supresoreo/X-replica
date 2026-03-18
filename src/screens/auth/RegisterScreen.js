import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native/icons';

const formatBirthdayInput = (raw) => {
  const digits = raw.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 4) {
    return digits;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }

  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
};

const isBirthdayValid = (birthday) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
    return false;
  }

  const date = new Date(`${birthday}T00:00:00`);
  return !Number.isNaN(date.getTime());
};

export const RegisterScreen = ({ onBack, onContinue }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  const emailLooksValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const usernameLooksValid = useMemo(() => /^[a-zA-Z0-9_]{4,15}$/.test(username.trim()), [username]);
  const canContinue =
    fullName.trim().length >= 2 &&
    usernameLooksValid &&
    emailLooksValid &&
    isBirthdayValid(birthday);

  const handleBirthdayChange = (text) => {
    setBirthday(formatBirthdayInput(text));
  };

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }

    onContinue({
      fullName: fullName.trim(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      birthday,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={onBack} style={styles.iconButton}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Create your account</Text>
          <View style={styles.iconButton} />
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              selectionColor="#1d9bf0"
            />
          </View>

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
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              selectionColor="#1d9bf0"
              placeholder="letters, numbers, underscores"
              placeholderTextColor="#71767b"
            />
            <Text style={styles.helperText}>4-15 characters, no spaces</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of birth</Text>
            <TextInput
              style={styles.input}
              value={birthday}
              onChangeText={handleBirthdayChange}
              keyboardType="number-pad"
              autoCorrect={false}
              maxLength={10}
              selectionColor="#1d9bf0"
            />
            <Text style={styles.helperText}>Use format YYYY-MM-DD</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!canContinue}
          activeOpacity={0.9}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
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
    paddingTop: 20,
    paddingBottom: 40,
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
  helperText: {
    color: '#71767b',
    fontSize: 12,
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
