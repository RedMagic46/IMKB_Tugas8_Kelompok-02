import { Room } from '../app/types/schedule';
import { mockRooms } from '../app/data/mockData';
import { triggerStorageEvent } from './storageEvents';

const STORAGE_KEY = 'app_rooms';

// Helper functions untuk localStorage
const getStoredRooms = (): Room[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedRooms: Room[] = JSON.parse(stored);

      // Auto-sync: Check if there are any rooms in mockRooms that are missing or different in stored data
      let needsSave = false;
      const updatedRooms = [...parsedRooms];

      mockRooms.forEach(mockRoom => {
        const index = updatedRooms.findIndex(r => r.id === mockRoom.id);
        if (index === -1) {
          updatedRooms.push(mockRoom);
          needsSave = true;
        } else {
          // Jika data di mockRooms berubah (misal nama atau gedung), update di storage juga
          if (updatedRooms[index].name !== mockRoom.name ||
            updatedRooms[index].building !== mockRoom.building ||
            updatedRooms[index].capacity !== mockRoom.capacity) {
            updatedRooms[index] = { ...updatedRooms[index], ...mockRoom };
            needsSave = true;
          }
        }
      });

      if (needsSave) {
        saveRooms(updatedRooms);
        return updatedRooms;
      }

      return parsedRooms;
    }
  } catch (error) {
    console.error('Error reading rooms from localStorage:', error);
  }

  // Initialize dengan mock data jika belum ada
  const initialRooms = [...mockRooms];
  saveRooms(initialRooms);
  return initialRooms;
};

const saveRooms = (rooms: Room[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
    triggerStorageEvent(STORAGE_KEY);
  } catch (error) {
    console.error('Error saving rooms to localStorage:', error);
    throw new Error('Gagal menyimpan data ruangan');
  }
};

export const getRooms = async (): Promise<Room[]> => {
  const rooms = getStoredRooms();
  // Sort by building, then by name
  return rooms.sort((a, b) => {
    if (a.building !== b.building) {
      return a.building.localeCompare(b.building);
    }
    return a.name.localeCompare(b.name);
  });
};

export const createRoom = async (roomData: {
  name: string;
  building: string;
  capacity: number;
  facilities?: string;
}): Promise<Room> => {
  const rooms = getStoredRooms();
  const newRoom: Room = {
    id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: roomData.name,
    building: roomData.building,
    capacity: roomData.capacity,
  };

  rooms.push(newRoom);
  saveRooms(rooms);
  return newRoom;
};

export const updateRoom = async (
  id: string,
  updates: Partial<Room>
): Promise<Room> => {
  const rooms = getStoredRooms();
  const index = rooms.findIndex(r => r.id === id);

  if (index === -1) {
    throw new Error('Ruangan tidak ditemukan');
  }

  rooms[index] = { ...rooms[index], ...updates };
  saveRooms(rooms);
  return rooms[index];
};

export const deleteRoom = async (id: string): Promise<void> => {
  const rooms = getStoredRooms();
  const filtered = rooms.filter(r => r.id !== id);

  if (filtered.length === rooms.length) {
    throw new Error('Ruangan tidak ditemukan');
  }

  saveRooms(filtered);
};


