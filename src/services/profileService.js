
import { supabase } from './supabaseClient';

// Зареждане на потребителски профил
export async function getProfile(userId) {
  if (!userId) {
    throw new Error('Липсва потребител.');
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, avatar_url')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

// Запазване на адреса на профилната снимка
export async function saveAvatarUrl(userId, avatarUrl) {
  if (!userId || !avatarUrl) {
    throw new Error('Липсват данни за профилната снимка.');
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        avatar_url: avatarUrl,
      },
      {
        onConflict: 'id',
      }
    )
    .select('id, avatar_url')
    .single();

  if (error) {
    throw error;
  }

  return data;
}
