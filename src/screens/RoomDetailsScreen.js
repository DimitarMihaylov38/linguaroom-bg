

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


import { useAuth } from '../contexts/AuthContext';
import { deleteRoom } from '../services/roomsService';

export default function RoomDetailsScreen({ route, navigation }) {
  const { room } = route.params;
  const { session } = useAuth();

  const isOwner = session?.user?.id === room.owner_id;

const handleDelete = () => {
  Alert.alert(
    'Изтриване на стая',
    `Сигурен ли си, че искаш да изтриеш "${room.name}"?`,
    [
      {
        text: 'Отказ',
        style: 'cancel',
      },
      {
        text: 'Изтрий',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteRoom(room.id);
            navigation.goBack();
          } catch (error) {
            Alert.alert(
              'Грешка',
              error.message || 'Стаята не можа да бъде изтрита.'
            );
          }
        },
      },
    ]
  );
};


  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{room.name}</Text>

        <Text style={styles.label}>Език</Text>
        <Text style={styles.value}>{room.language}</Text>

        <Text style={styles.label}>Ниво</Text>
        <Text style={styles.value}>{room.level}</Text>

        <Text style={styles.label}>Описание</Text>
        <Text style={styles.description}>
          {room.description || 'Няма описание.'}
        </Text>
      </View>

{isOwner && (
  <TouchableOpacity
    style={styles.editButton}
    onPress={() => navigation.navigate('EditRoom', { room })}
  >
    <Text style={styles.editButtonText}>
      Редактирай стаята
    </Text>
  </TouchableOpacity>
)}

{isOwner && (
  <TouchableOpacity
    style={styles.deleteButton}
    onPress={handleDelete}
  >
    <Text style={styles.deleteButtonText}>
      Изтрий стаята
    </Text>
  </TouchableOpacity>
)}

      
<TouchableOpacity
  style={styles.chatButton}
  onPress={() =>
    navigation.navigate('Chat', {
      roomId: room.id,
      roomName: room.name,
    })
  }
>
  <Text style={styles.chatButtonText}>
    Влез в чата
  </Text>
</TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: '#2563eb',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#334155',
  },
  note: {
    marginTop: 24,
    textAlign: 'center',
    color: '#64748b',
    fontSize: 15,
  },

editButton: {
  backgroundColor: '#2563eb',
  padding: 15,
  borderRadius: 12,
  alignItems: 'center',
  marginTop: 24,
},
editButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},

deleteButton: {
  backgroundColor: '#dc2626',
  padding: 15,
  borderRadius: 12,
  alignItems: 'center',
  marginTop: 12,
},
deleteButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},

chatButton: {
  backgroundColor: '#16a34a',
  padding: 16,
  borderRadius: 12,
  alignItems: 'center',
  marginTop: 24,
},
chatButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},


});
