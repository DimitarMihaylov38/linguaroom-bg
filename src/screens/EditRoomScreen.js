
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { updateRoom } from '../services/roomsService';

export default function EditRoomScreen({ route, navigation }) {
  const { room } = route.params;

  const [name, setName] = useState(room.name);
  const [description, setDescription] = useState(room.description || '');
  const [language, setLanguage] = useState(room.language);
  const [level, setLevel] = useState(room.level);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (name.trim().length < 3 || name.trim().length > 80) {
      Alert.alert('Грешка', 'Името трябва да е между 3 и 80 символа.');
      return;
    }

    if (description.length > 500) {
      Alert.alert('Грешка', 'Описанието не може да надвишава 500 символа.');
      return;
    }

    try {
      setSaving(true);

      await updateRoom(room.id, {
        name,
        description,
        language,
        level,
      });

      Alert.alert('Успешно', 'Промените са запазени.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Грешка', error.message || 'Неуспешно записване.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      bottomOffset={100}
    >
      <Text style={styles.label}>Име на стаята</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        maxLength={80}
      />

      <Text style={styles.label}>Описание</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        multiline
        maxLength={500}
        textAlignVertical="top"
      />

      <Text style={styles.label}>Език</Text>
      <View style={styles.options}>
        {['English', 'German'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.option,
              language === item && styles.selectedOption,
            ]}
            onPress={() => setLanguage(item)}
          >
            <Text
              style={[
                styles.optionText,
                language === item && styles.selectedText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Ниво</Text>
      <View style={styles.options}>
        {['A1', 'A2', 'B1', 'B2', 'C1'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.option,
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
        style={[styles.saveButton, saving && styles.disabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Запази промените</Text>
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
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  textArea: {
    height: 110,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
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
    color: '#334155',
    fontWeight: '600',
  },
  selectedText: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.6,
  },
});
