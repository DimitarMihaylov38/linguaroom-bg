


import { supabase } from './supabaseClient';

// Извличане на всички езикови стаи
export async function getRooms() {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

// Създаване на нова езикова стая
export async function createRoom(roomData) {
  const { data, error } = await supabase
    .from('rooms')
    .insert({
      name: roomData.name.trim(),
      description: roomData.description?.trim() || null,
      language: roomData.language,
      level: roomData.level,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Извличане на стаите на текущия потребител
export async function getMyRooms(userId) {
  if (!userId) {
    throw new Error('Липсва потребителска сесия.');
  }

  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}


export async function updateRoom(roomId, roomData) {
  const { data, error } = await supabase
    .from('rooms')
    .update({
      name: roomData.name.trim(),
      description: roomData.description?.trim() || null,
      language: roomData.language,
      level: roomData.level,
    })
    .eq('id', roomId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteRoom(roomId) {
  const { error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', roomId);

  if (error) {
    throw error;
  }
}
