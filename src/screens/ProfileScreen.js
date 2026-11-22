
import { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';


import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut();
    } catch (error) {
      Alert.alert(
        'Грешка при изход',
        error.message || 'Възникна проблем.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.scrollContent}
  >

      <Text style={styles.title}>Моят профил</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.email?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>

        <Text style={styles.label}>Имейл адрес</Text>

        <Text style={styles.email}>
          {user?.email || 'Няма информация'}
        </Text>

        <Text style={styles.description}>
          Скоро тук ще можеш да добавиш профилна
          снимка, да избереш език и ниво на владеене.
        </Text>
      </View>

     
      <TouchableOpacity
        style={[styles.logoutButton, loading && styles.disabledButton]}
        onPress={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.logoutText}>Изход</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    padding: 12,
  },
scrollContent: {
  flexGrow: 1,
  paddingBottom: 16,
},
 title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2563eb',
    marginTop: 8,
    marginBottom: 12,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 5,
  },
  email: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
  description: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  logoutText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
