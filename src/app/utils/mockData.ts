// Mock Data untuk Demo Aplikasi

import { User, Ruangan, MataKuliah, JadwalKuliah } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@university.ac.id',
    name: 'Admin Akademik',
    role: 'admin'
  },
  {
    id: 'user-2',
    email: 'dosen1@university.ac.id',
    name: 'Dr. Ahmad Santoso',
    role: 'dosen'
  },
  {
    id: 'user-3',
    email: 'dosen2@university.ac.id',
    name: 'Dr. Siti Nurhaliza',
    role: 'dosen'
  },
  {
    id: 'user-4',
    email: 'dosen3@university.ac.id',
    name: 'Prof. Budi Hartono',
    role: 'dosen'
  },
  {
    id: 'user-5',
    email: 'mahasiswa@university.ac.id',
    name: 'Andi Wijaya',
    role: 'mahasiswa'
  }
];

export const mockRuangan: Ruangan[] = [
  { id: 'room-1', kode: 'R208', nama: 'R208', kapasitas: 40, gedung: 'GKB I' },
  { id: 'room-2', kode: 'R215', nama: 'R215', kapasitas: 40, gedung: 'GKB I' },
  { id: 'room-3', kode: 'R320', nama: 'R320', kapasitas: 50, gedung: 'GKB I' },
  { id: 'room-4', kode: 'R308', nama: 'R308', kapasitas: 50, gedung: 'GKB II' },
  { id: 'room-5', kode: 'R401', nama: 'R401', kapasitas: 50, gedung: 'GKB II' },
  { id: 'room-6', kode: 'R403', nama: 'R403', kapasitas: 50, gedung: 'GKB II' },
  { id: 'room-7', kode: 'R316', nama: 'R316', kapasitas: 40, gedung: 'GKB III' },
  { id: 'room-8', kode: 'R610', nama: 'R610', kapasitas: 40, gedung: 'GKB III' },
  { id: 'room-9', kode: 'R611', nama: 'R611', kapasitas: 40, gedung: 'GKB III' },
  { id: 'room-10', kode: 'R612', nama: 'R612', kapasitas: 40, gedung: 'GKB III' },
  { id: 'room-11', kode: 'R601', nama: 'R601', kapasitas: 50, gedung: 'GKB IV' },
  { id: 'room-12', kode: 'R605', nama: 'R605', kapasitas: 50, gedung: 'GKB IV' },
  { id: 'room-13', kode: 'MSJ', nama: 'Masjid', kapasitas: 200, gedung: 'Fasilitas Umum' },
  { id: 'room-14', kode: 'LAB-AB', nama: 'Lab A/B', kapasitas: 30, gedung: 'Laboratorium' },
  { id: 'room-15', kode: 'LAB-CD', nama: 'Lab C/D', kapasitas: 30, gedung: 'Laboratorium' },
  { id: 'room-16', kode: 'LAB-EF', nama: 'Lab E/F', kapasitas: 30, gedung: 'Laboratorium' },
  { id: 'room-17', kode: 'AUD', nama: 'Auditorium', kapasitas: 300, gedung: 'GKB III' },
];

export const mockMataKuliah: MataKuliah[] = [
  {
    id: 'mk-1',
    kode: 'IF101',
    nama: 'Algoritma dan Pemrograman',
    sks: 3,
    semester: 1,
    dosenId: 'user-2',
    dosenNama: 'Dr. Ahmad Santoso'
  },
  {
    id: 'mk-2',
    kode: 'IF102',
    nama: 'Basis Data',
    sks: 3,
    semester: 3,
    dosenId: 'user-3',
    dosenNama: 'Dr. Siti Nurhaliza'
  },
  {
    id: 'mk-3',
    kode: 'IF103',
    nama: 'Struktur Data',
    sks: 3,
    semester: 2,
    dosenId: 'user-2',
    dosenNama: 'Dr. Ahmad Santoso'
  },
  {
    id: 'mk-4',
    kode: 'IF104',
    nama: 'Jaringan Komputer',
    sks: 2,
    semester: 4,
    dosenId: 'user-4',
    dosenNama: 'Prof. Budi Hartono'
  },
  {
    id: 'mk-5',
    kode: 'IF105',
    nama: 'Rekayasa Perangkat Lunak',
    sks: 3,
    semester: 5,
    dosenId: 'user-3',
    dosenNama: 'Dr. Siti Nurhaliza'
  },
  {
    id: 'mk-6',
    kode: 'IF106',
    nama: 'Kecerdasan Buatan',
    sks: 3,
    semester: 6,
    dosenId: 'user-4',
    dosenNama: 'Prof. Budi Hartono'
  },
  {
    id: 'mk-7',
    kode: 'IF107',
    nama: 'Pemrograman Web',
    sks: 2,
    semester: 3,
    dosenId: 'user-2',
    dosenNama: 'Dr. Ahmad Santoso'
  },
  {
    id: 'mk-8',
    kode: 'IF108',
    nama: 'Sistem Operasi',
    sks: 3,
    semester: 4,
    dosenId: 'user-3',
    dosenNama: 'Dr. Siti Nurhaliza'
  }
];

// Mock jadwal dengan beberapa konflik yang disengaja
export const mockJadwalKuliah: JadwalKuliah[] = [
  {
    id: 'jadwal-1',
    mataKuliahId: 'mk-1',
    mataKuliahNama: 'Algoritma dan Pemrograman',
    mataKuliahKode: 'IF101',
    ruanganId: 'room-1',
    ruanganNama: 'Ruang A101',
    dosenId: 'user-2',
    dosenNama: 'Dr. Ahmad Santoso',
    hari: 'Senin',
    jamMulai: '08:00',
    jamSelesai: '10:30',
    semester: 1,
    tahunAjaran: '2024/2025',
    hasConflict: false
  },
  {
    id: 'jadwal-2',
    mataKuliahId: 'mk-2',
    mataKuliahNama: 'Basis Data',
    mataKuliahKode: 'IF102',
    ruanganId: 'room-1', // KONFLIK: Ruangan sama dengan jadwal-1
    ruanganNama: 'Ruang A101',
    dosenId: 'user-3',
    dosenNama: 'Dr. Siti Nurhaliza',
    hari: 'Senin',
    jamMulai: '09:00', // KONFLIK: Waktu overlap dengan jadwal-1
    jamSelesai: '11:30',
    semester: 3,
    tahunAjaran: '2024/2025',
    hasConflict: true,
    conflictType: 'ruangan'
  },
  {
    id: 'jadwal-3',
    mataKuliahId: 'mk-3',
    mataKuliahNama: 'Struktur Data',
    mataKuliahKode: 'IF103',
    ruanganId: 'room-2',
    ruanganNama: 'Ruang A102',
    dosenId: 'user-2', // KONFLIK: Dosen sama dengan jadwal-1
    dosenNama: 'Dr. Ahmad Santoso',
    hari: 'Senin',
    jamMulai: '08:30', // KONFLIK: Waktu overlap dengan jadwal-1
    jamSelesai: '11:00',
    semester: 2,
    tahunAjaran: '2024/2025',
    hasConflict: true,
    conflictType: 'dosen'
  },
  {
    id: 'jadwal-4',
    mataKuliahId: 'mk-4',
    mataKuliahNama: 'Jaringan Komputer',
    mataKuliahKode: 'IF104',
    ruanganId: 'room-3',
    ruanganNama: 'Ruang A201',
    dosenId: 'user-4',
    dosenNama: 'Prof. Budi Hartono',
    hari: 'Selasa',
    jamMulai: '13:00',
    jamSelesai: '14:40',
    semester: 4,
    tahunAjaran: '2024/2025',
    hasConflict: false
  },
  {
    id: 'jadwal-5',
    mataKuliahId: 'mk-5',
    mataKuliahNama: 'Rekayasa Perangkat Lunak',
    mataKuliahKode: 'IF105',
    ruanganId: 'room-4',
    ruanganNama: 'Ruang B101',
    dosenId: 'user-3',
    dosenNama: 'Dr. Siti Nurhaliza',
    hari: 'Rabu',
    jamMulai: '10:00',
    jamSelesai: '12:30',
    semester: 5,
    tahunAjaran: '2024/2025',
    hasConflict: false
  },
  {
    id: 'jadwal-6',
    mataKuliahId: 'mk-7',
    mataKuliahNama: 'Pemrograman Web',
    mataKuliahKode: 'IF107',
    ruanganId: 'room-6',
    ruanganNama: 'Lab Komputer 1',
    dosenId: 'user-2',
    dosenNama: 'Dr. Ahmad Santoso',
    hari: 'Kamis',
    jamMulai: '14:00',
    jamSelesai: '15:40',
    semester: 3,
    tahunAjaran: '2024/2025',
    hasConflict: false
  }
];
