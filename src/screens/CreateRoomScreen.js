
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { createRoom } from '../services/roomsService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

const LANGUAGES = [
  { label: 'Английски', value: 'English' },
  { label: 'Немски', value: 'German' },
];

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

export default function CreateRoomScreen({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('English');
  const [level, setLevel] = useState('A1');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    const cleanName = name.trim();

    if (cleanName.length < 3 || cleanName.length > 80) {
      Alert.alert(
        'Невалидно име',
        'Името трябва да бъде между 3 и 80 символа.'
      );
      return;
    }

    if (description.trim().length > 500) {
      Alert.alert(
        'Невалидно описание',
        'Описанието не може да надвишава 500 символа.'
      );
      return;
    }

    try {
      setLoading(true);

      await createRoom({
        name: cleanName,
        description,
        language,
        level,
      });

      Alert.alert(
        'Успешно',
        'Езиковата стая е създадена!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Грешка',
        error.message || 'Неуспешно създаване на стаята.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    
<KeyboardAwareScrollView
  style={styles.container}
  contentContainerStyle={styles.content}
  keyboardShouldPersistTaps="handled"
  keyboardDismissMode="on-drag"
  bottomOffset={100}
>

      <Text style={styles.label}>Име на стаята</Text>
      <TextInput
        style={styles.input}
        placeholder="Напр. English B1 – Free Talk"
        value={name}
        onChangeText={setName}
        maxLength={80}
      />

      <Text style={styles.label}>Описание</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="За какво ще разговаряте?"
        value={description}
        onChangeText={setDescription}
        multiline
        maxLength={500}
        textAlignVertical="top"
      />

      <Text style={styles.label}>Език</Text>
      <View style={styles.optionsRow}>
        {LANGUAGES.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.option,
              language === item.value && styles.selectedOption,
            ]}
            onPress={() => setLanguage(item.value)}
          >
            <Text
              style={[
                styles.optionText,
                language === item.value && styles.selectedText,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Ниво</Text>
      <View style={styles.optionsRow}>
        {LEVELS.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.levelOption,
              level === item && styles.selectedOption,
            ]}
            onPress={() => setLevel(item)}
          >
            <Text
              style={[
                styles.optionText,
                level === item && styles.selectedText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleCreate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Създай стая</Text>
        )}
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
 
content: {
  padding: 20,
  paddingBottom: 100,
},

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#1e293b',
  },
  textArea: {
    minHeight: 100,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  option: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
  },
  levelOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
  },
  selectedOption: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  optionText: {
    fontSize: 15,
    color: '#334155',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 30,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
