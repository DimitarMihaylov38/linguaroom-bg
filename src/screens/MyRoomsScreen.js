
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function MyRoomsScreen({ navigation }) {
  const handleCreateRoom = () => {
    navigation.getParent()?.navigate('CreateRoom');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Моите стаи</Text>

      <Text style={styles.subtitle}>
        Управлявай стаите, които си създал.
      </Text>

      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateRoom}
      >
        <Text style={styles.createButtonText}>
          + Създай стая
        </Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Все още нямаш създадени стаи.
        </Text>

        <Text style={styles.description}>
          Тук ще можеш да управляваш своите езикови стаи.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2563eb',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 10,
    marginBottom: 25,
  },
  createButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 25,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 23,
  },
});

