
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { useAuth } from '../contexts/AuthContext';

export default function RegisterScreen({ onLogin }) {
  const { signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password || !confirmPassword) {
      Alert.alert('Грешка', 'Попълни всички полета.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      Alert.alert('Грешка', 'Въведи валиден имейл.');
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Грешка',
        'Паролата трябва да е поне 6 символа.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Грешка',
        'Двете пароли не съвпадат.'
      );
      return;
    }

    try {
      setLoading(true);

      const data = await signUp(cleanEmail, password);

      if (!data.session) {
        Alert.alert(
          'Регистрацията е изпратена',
          'Провери имейла си за потвърждение, след което влез в приложението.',
          [{ text: 'OK', onPress: onLogin }]
        );
      } else {
        Alert.alert(
          'Успешна регистрация',
          'Профилът ти е създаден.'
        );
      }
    } catch (error) {
      Alert.alert(
        'Грешка при регистрация',
        error.message || 'Възникна проблем.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>LinguaRoom BG</Text>

        <Text style={styles.subtitle}>
          Създай профил и практикувай чужди езици!
        </Text>

        <Text style={styles.heading}>Регистрация</Text>

        <TextInput
          style={styles.input}
          placeholder="Имейл"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Парола (минимум 6 символа)"
          secureTextEntry
          autoComplete="new-password"
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Потвърди паролата"
          secureTextEntry
          autoComplete="new-password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={[
            styles.button,
            loading && styles.disabledButton,
          ]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Регистрация
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onLogin}
          disabled={loading}
          style={styles.loginButton}
        >
          <Text style={styles.loginText}>
            Вече имаш профил? Влез
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 35,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  loginButton: {
    marginTop: 25,
    alignItems: 'center',
    padding: 8,
  },
  loginText: {
    color: '#2563eb',
    fontSize: 15,
  },
});
