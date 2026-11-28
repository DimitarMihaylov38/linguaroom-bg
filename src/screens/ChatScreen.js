
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { useAuth } from '../contexts/AuthContext';
import { getMessages, sendMessage } from '../services/messagesService';
import { supabase } from '../services/supabaseClient';

export default function ChatScreen({ route }) {
  const { roomId, roomName } = route.params;
  const { session } = useAuth();
  const headerHeight = useHeaderHeight();

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const listRef = useRef(null);

  const scrollToLatest = () => {
    listRef.current?.scrollToEnd({ animated: false });
  };

  const loadMessages = useCallback(async () => {
    try {
      setError('');

      const data = await getMessages(roomId);
      setMessages(data);
    } catch (err) {
      setError(
        err.message || 'Грешка при зареждане на съобщенията.'
      );
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);


useEffect(() => {
  const channel = supabase
    .channel(`room-messages-${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        const newMessage = payload.new;

        setMessages((previous) => {
          const exists = previous.some(
            (message) => message.id === newMessage.id
          );

          if (exists) {
            return previous;
          }

          return [...previous, newMessage];
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [roomId]);


  const handleSend = async () => {
    const text = messageText.trim();

    if (!text || sending) {
      return;
    }

    try {
      setSending(true);

      const newMessage = await sendMessage(roomId, text);

      
setMessages((previous) => {
  const exists = previous.some(
    (message) => message.id === newMessage.id
  );

  if (exists) {
    return previous;
  }

  return [...previous, newMessage];
});

      setMessageText('');
    } catch (err) {
      Alert.alert(
        'Грешка',
        err.message || 'Съобщението не беше изпратено.'
      );
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isMine = item.user_id === session?.user?.id;

    return (
      <View
        style={[
          styles.messageBubble,
          isMine ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text
          style={[
            styles.messageContent,
            isMine && styles.myMessageText,
          ]}
        >
          {item.content}
        </Text>

        <Text
          style={[
            styles.messageTime,
            isMine && styles.myMessageTime,
          ]}
        >
          {new Date(item.created_at).toLocaleTimeString('bg-BG', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      <Text style={styles.roomTitle}>{roomName}</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2563eb"
          style={styles.loader}
        />
      ) : (
       
<FlatList
  inverted
  ref={listRef}
  data={[...messages].reverse()}

          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          keyboardShouldPersistTaps="handled"
          
onContentSizeChange={() => {
  listRef.current?.scrollToOffset({
    offset: 0,
    animated: false,
  });
}}

          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {error || 'Все още няма съобщения. Напиши първото!'}
            </Text>
          }
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Напиши съобщение..."
          multiline
          maxLength={1000}
          textAlignVertical="center"
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            (!messageText.trim() || sending) &&
              styles.disabledButton,
          ]}
          onPress={handleSend}
          disabled={!messageText.trim() || sending}
        >
          <Text style={styles.sendButtonText}>
            {sending ? '...' : 'Изпрати'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },

  roomTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },

  loader: {
    marginTop: 40,
  },

  messageList: {
    flex: 1,
  },

  messageListContent: {
  padding: 12,
},

  messageBubble: {
    maxWidth: '80%',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },

  myMessage: {
    backgroundColor: '#2563eb',
    alignSelf: 'flex-end',
  },

  otherMessage: {
    backgroundColor: '#e2e8f0',
    alignSelf: 'flex-start',
  },

  messageContent: {
    fontSize: 15,
    color: '#0f172a',
  },

  myMessageText: {
    color: '#fff',
  },

  messageTime: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'right',
    marginTop: 4,
  },

  myMessageTime: {
    color: '#dbeafe',
  },

  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 30,
    fontSize: 15,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },

  input: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
    maxHeight: 90,
    color: '#0f172a',
    marginRight: 6,
  },

  sendButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 11,
    paddingVertical: 10,
    borderRadius: 10,
  },

  sendButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },

  disabledButton: {
    opacity: 0.5,
  },
});
