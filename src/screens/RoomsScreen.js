
import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';

import { getRooms } from '../services/roomsService';

export default function RoomsScreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadRooms = useCallback(async () => {
    try {
      setError('');
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      setError('Неуспешно зареждане на стаите.');
      console.error('Rooms error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRooms();
  };

  const renderRoom = ({ item }) => (
    <View style={styles.roomCard}>
      <Text style={styles.roomName}>{item.name}</Text>

      <Text style={styles.roomInfo}>
        {item.language} · {item.level}
      </Text>

      {item.description ? (
        <Text style={styles.description}>
          {item.description}
        </Text>
      ) : null}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Зареждане на стаите...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Езикови стаи</Text>

      <Text style={styles.subtitle}>
        Избери език и се включи в разговор!
      </Text>

      {error ? (
        <TouchableOpacity onPress={loadRooms}>
          <Text style={styles.error}>
            {error} Натисни за нов опит.
          </Text>
        </TouchableOpacity>
      ) : null}

      
<FlatList
  data={rooms}
  keyExtractor={(item) => item.id}
  renderItem={renderRoom}
  alwaysBounceVertical={true}
  overScrollMode="always"

        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        ListEmptyComponent={
          !error ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>
                Все още няма езикови стаи.
              </Text>
              <Text style={styles.emptyText}>
                Скоро ще можеш да създадеш първата стая!
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fb',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 30,
    flexGrow: 1,
  },
  roomCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  roomInfo: {
    fontSize: 14,
    color: '#2563eb',
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 10,
    lineHeight: 21,
  },
  emptyBox: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 10,
    textAlign: 'center',
  },
  error: {
    color: '#dc2626',
    marginBottom: 15,
    fontSize: 14,
  },
});

