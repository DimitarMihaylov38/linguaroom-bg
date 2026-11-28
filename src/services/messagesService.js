
import { supabase } from './supabaseClient';

// Зарежда съобщенията за конкретна езикова стая
export async function getMessages(roomId) {
  const { data, error } = await supabase
    .from('messages')
    .select('id, room_id, user_id, content, created_at')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

// Изпраща ново съобщение
export async function sendMessage(roomId, content) {
  const message = content.trim();

  if (!message || message.length > 1000) {
    throw new Error('Съобщението трябва да е между 1 и 1000 символа.');
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      room_id: roomId,
      content: message,
    })
    .select('id, room_id, user_id, content, created_at')
    .single();

  if (error) {
    throw error;
  }

  return data;
}
