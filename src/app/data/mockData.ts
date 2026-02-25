import { User, Room, Course, Schedule } from '../types/schedule';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Admin Sistem',
    email: 'admin@university.ac.id',
    role: 'admin',
  },
  {
    id: 'user-2',
    name: 'Dr. Budi Santoso',
    email: 'budi@university.ac.id',
    role: 'dosen',
  },
  {
    id: 'user-3',
    name: 'Ahmad Rizki',
    email: 'ahmad@university.ac.id',
    role: 'mahasiswa',
  },
];

// Mock Rooms
export const mockRooms: Room[] = [
  { id: 'room-1', name: 'R208', capacity: 40, building: 'GKB I' },
  { id: 'room-2', name: 'R215', capacity: 40, building: 'GKB I' },
  { id: 'room-3', name: 'R320', capacity: 50, building: 'GKB I' },
  { id: 'room-4', name: 'R308', capacity: 50, building: 'GKB II' },
  { id: 'room-5', name: 'R401', capacity: 50, building: 'GKB II' },
  { id: 'room-6', name: 'R403', capacity: 50, building: 'GKB II' },
  { id: 'room-7', name: 'R316', capacity: 40, building: 'GKB III' },
  { id: 'room-8', name: 'R610', capacity: 40, building: 'GKB III' },
  { id: 'room-9', name: 'R611', capacity: 40, building: 'GKB III' },
  { id: 'room-10', name: 'R612', capacity: 40, building: 'GKB III' },
  { id: 'room-11', name: 'R601', capacity: 50, building: 'GKB IV' },
  { id: 'room-12', name: 'R605', capacity: 50, building: 'GKB IV' },
  { id: 'room-13', name: 'Masjid', capacity: 40, building: 'Fasilitas Umum' },
  { id: 'room-14', name: 'Lab A/B', capacity: 50, building: 'Laboratorium' },
  { id: 'room-15', name: 'Lab C/D', capacity: 50, building: 'Laboratorium' },
  { id: 'room-16', name: 'Lab E/F', capacity: 50, building: 'Laboratorium' },
  { id: 'room-17', name: 'Auditorium', capacity: 300, building: 'GKB III' },
];

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: 'course-1',
    code: 'CS101',
    name: 'Pemrograman Dasar',
    credits: 2,
    lecturer: 'Arkaan',
  },
  {
    id: 'course-2',
    code: 'CS102',
    name: 'Struktur Data',
    credits: 2,
    lecturer: 'Juan',
  },
  {
    id: 'course-3',
    code: 'CS201',
    name: 'Algoritma',
    credits: 2,
    lecturer: 'Syahrial',
  },
  {
    id: 'course-4',
    code: 'CS202',
    name: 'Basis Data',
    credits: 2,
    lecturer: 'Fahmi',
  },
  {
    id: 'course-5',
    code: 'CS301',
    name: 'Sistem Operasi',
    credits: 2,
    lecturer: 'Rizky',
  },
  {
    id: 'course-6',
    code: 'CS302',
    name: 'Jaringan Komputer',
    credits: 2,
    lecturer: 'Robi',
  },
  {
    id: 'course-7',
    code: 'MTK101',
    name: 'Kalkulus I',
    credits: 2,
    lecturer: 'Mail',
  },
];

// Mock Schedules (dengan beberapa yang bentrok untuk demo)
// Menggunakan format waktu jam akademik UMM yang benar
export const mockSchedules: Schedule[] = [
  {
    id: 'sch-1',
    courseId: 'course-1',
    courseName: 'Pemrograman Dasar',
    courseCode: 'CS101',
    roomId: 'room-1',
    roomName: 'R208',
    day: 'Monday',
    startTime: '07:00', // Jam ke-1
    endTime: '09:30',   // Sampai jam ke-3 end (3 SKS = jam 1,2,3)
    lecturer: 'Arkaan',
    hasConflict: false,
  },
  {
    id: 'sch-2',
    courseId: 'course-2',
    courseName: 'Struktur Data',
    courseCode: 'CS102',
    roomId: 'room-2',
    roomName: 'R215',
    day: 'Monday',
    startTime: '07:00', // Jam ke-1
    endTime: '09:30',   // Sampai jam ke-3 end (3 SKS = jam 1,2,3)
    lecturer: 'Juan',
    hasConflict: true, // ❌ BENTROK: Waktu sama dengan sch-1
  },
  {
    id: 'sch-3',
    courseId: 'course-3',
    courseName: 'Algoritma',
    courseCode: 'CS201',
    roomId: 'room-2',
    roomName: 'R215',
    day: 'Monday',
    startTime: '09:30', // Jam ke-4
    endTime: '12:00',   // Sampai jam ke-6 end (3 SKS = jam 4,5,6)
    lecturer: 'Syahrial',
    hasConflict: false,
  },
  {
    id: 'sch-4',
    courseId: 'course-4',
    courseName: 'Basis Data',
    courseCode: 'CS202',
    roomId: 'room-3',
    roomName: 'R308',
    day: 'Tuesday',
    startTime: '07:00', // Jam ke-1
    endTime: '09:30',   // Sampai jam ke-3 end (3 SKS = jam 1,2,3)
    lecturer: 'Fahmi',
    hasConflict: false,
  },
  {
    id: 'sch-5',
    courseId: 'course-5',
    courseName: 'Sistem Operasi',
    courseCode: 'CS301',
    roomId: 'room-4',
    roomName: 'R401',
    day: 'Tuesday',
    startTime: '07:50', // Jam ke-2
    endTime: '10:20',   // Sampai jam ke-4 end (3 SKS = jam 2,3,4)
    lecturer: 'Rizky',
    hasConflict: true, // ❌ BENTROK: Waktu overlap dengan sch-4 (jam 2 dan 3)
  },
  {
    id: 'sch-6',
    courseId: 'course-6',
    courseName: 'Jaringan Komputer',
    courseCode: 'CS302',
    roomId: 'room-5',
    roomName: 'R403',
    day: 'Wednesday',
    startTime: '12:30', // Jam ke-7
    endTime: '15:00',   // Sampai jam ke-9 end (3 SKS = jam 7,8,9)
    lecturer: 'Robi',
    hasConflict: false,
  },
];