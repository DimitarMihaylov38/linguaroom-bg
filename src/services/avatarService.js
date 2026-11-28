
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import { supabase } from './supabaseClient';

export async function uploadAvatar(photoUri) {
  if (!photoUri) {
    throw new Error('Няма избрана снимка.');
  }

  // Проверяваме кой потребител е влязъл
  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error('Трябва да влезеш в профила си.');
  }

  const userId = userData.user.id;

  // Проверяваме размера на снимката
  const fileInfo = await FileSystem.getInfoAsync(photoUri);

  if (!fileInfo.exists) {
    throw new Error('Снимката не беше намерена.');
  }

  if (fileInfo.size > 5 * 1024 * 1024) {
    throw new Error('Снимката е по-голяма от 5 MB.');
  }

  // Прочитаме снимката
  const base64 = await FileSystem.readAsStringAsync(photoUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Генерираме уникално име за файла
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}.jpg`;

  const filePath = `${userId}/${fileName}`;

  // Качваме снимката в Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, decode(base64), {
      contentType: 'image/jpeg',
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  // Вземаме публичния адрес на снимката
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return {
    path: filePath,
    publicUrl: data.publicUrl,
  };
}
