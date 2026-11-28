
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import { uploadAvatar } from '../services/avatarService';
import { saveAvatarUrl } from '../services/profileService';
import { supabase } from '../services/supabaseClient';

export default function CameraScreen({ navigation }) {
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();

  const [permission, requestPermission] =
    useCameraPermissions();

  const [cameraReady, setCameraReady] = useState(false);
  const [takingPhoto, setTakingPhoto] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  const takePhoto = async () => {
    if (!cameraRef.current || !cameraReady || takingPhoto) {
      return;
    }

    try {
      setTakingPhoto(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
      });

      if (photo?.uri) {
        setPhotoUri(photo.uri);
      }
    } catch (error) {
      Alert.alert(
        'Грешка',
        error.message || 'Неуспешно заснемане.'
      );
    } finally {
      setTakingPhoto(false);
    }
  };



const handleSavePhoto = async () => {
  if (!photoUri || uploading) {
    return;
  }

  try {
    setUploading(true);

    // 1. Качваме снимката в Storage
    const result = await uploadAvatar(photoUri);

    // 2. Вземаме текущия потребител
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('Неуспешно зареждане на потребителя.');
    }

    // 3. Записваме адреса на снимката в profiles
    await saveAvatarUrl(user.id, result.publicUrl);

    Alert.alert(
      'Успешно',
      'Профилната снимка е запазена!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  } catch (error) {
    Alert.alert(
      'Грешка при запазване',
      error.message || 'Снимката не можа да бъде запазена.'
    );
  } finally {
    setUploading(false);
  }
};


  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>
          За да направиш профилна снимка,
          трябва да разрешиш достъпа до камерата.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>
            Разреши камерата
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (photoUri) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Преглед на снимката
        </Text>

        <Image
          source={{ uri: photoUri }}
          style={styles.preview}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setCameraReady(false);
            setPhotoUri(null);
          }}
        >
          <Text style={styles.buttonText}>
            Снимай отново
          </Text>
        </TouchableOpacity>


<TouchableOpacity
  style={[
    styles.button,
    uploading && styles.disabled,
  ]}
  onPress={handleSavePhoto}
  disabled={uploading}
>
  {uploading ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <Text style={styles.buttonText}>
      Запази снимката
    </Text>
  )}
</TouchableOpacity>


       <Text style={styles.note}>
  Снимката ще бъде качена в Supabase Storage.
</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Направи профилна снимка
      </Text>

      {isFocused && (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="front"
          onCameraReady={() => setCameraReady(true)}
          onMountError={(event) => {
            Alert.alert(
              'Грешка с камерата',
              event.message || 'Камерата не може да се отвори.'
            );
          }}
        />
      )}

      <TouchableOpacity
        style={[
          styles.button,
          (!cameraReady || takingPhoto) && styles.disabled,
        ]}
        onPress={takePhoto}
        disabled={!cameraReady || takingPhoto}
      >
        <Text style={styles.buttonText}>
          {takingPhoto ? 'Заснемане...' : 'Направи снимка'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f7fb',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#334155',
    textAlign: 'center',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  preview: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
  },
  note: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 10,
  },
});
