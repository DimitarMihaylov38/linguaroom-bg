
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../contexts/AuthContext';
import { getMyRooms } from '../services/roomsService';

export default function MyRoomsScreen({ navigation }) {
  const { session } = useAuth();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadRooms = useCallback(async () => {
    try {
      setError('');

      const userId = session?.user?.id;
      const data = await getMyRooms(userId);

      setRooms(data);
    } catch (err) {
      setError(err.message || 'Грешка при зареждане.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadRooms();
    }, [loadRooms])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadRooms();
  };

 
const renderRoom = ({ item }) => (
  <TouchableOpacity
    style={styles.roomCard}
    activeOpacity={0.7}
    onPress={() =>
      navigation.getParent()?.navigate('RoomDetails', {
        room: item,
        roomId: item.id,
      })
    }
  >
    <Text style={styles.roomName}>{item.name}</Text>

    <Text style={styles.roomDetails}>
      {item.language} · {item.level}
    </Text>

    {item.description ? (
      <Text style={styles.roomDescription}>
        {item.description}
      </Text>
    ) : null}

    <Text style={styles.openRoomText}>
      Отвори стаята →
    </Text>
  </TouchableOpacity>
);


  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.getParent()?.navigate('CreateRoom')}
      >
        <Text style={styles.createButtonText}>
          + Създай стая
        </Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2563eb"
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id}
          renderItem={renderRoom}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {error || 'Все още нямаш създадени стаи.'}
            </Text>
          }
          ListHeaderComponent={
            error && rooms.length > 0 ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    padding: 16,
  },
  createButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 40,
  },
  listContent: {
    paddingBottom: 30,
    flexGrow: 1,
  },
  roomCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  roomDetails: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 8,
  },
  roomDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 21,
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
    marginTop: 40,
  },
  errorText: {
    color: '#dc2626',
    marginBottom: 12,
  },
  openRoomText: {
  color: '#2563eb',
  fontSize: 14,
  fontWeight: 'bold',
  textAlign: 'right',
  marginTop: 14,
},
});


