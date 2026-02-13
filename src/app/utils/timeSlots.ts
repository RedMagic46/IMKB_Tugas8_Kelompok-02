// Utilitas untuk mapping jam akademik dan tampilan jam kuliah
// Dipakai di ScheduleTableView, SchedulePage, dan exportPDF

export type ScheduleTimeMode = 'normal' | 'puasa';

// Mapping jam akademik UMM (14 slot waktu) berbasis waktu asli (HH:mm)
// Ini dipakai untuk perhitungan slot (timeToSlot / endTimeToSlot) dan disimpan di database
export const TIME_SLOTS = [
  { slot: 1, start: '07:00', end: '07:50' },
  { slot: 2, start: '07:50', end: '08:40' },
  { slot: 3, start: '08:40', end: '09:30' },
  { slot: 4, start: '09:30', end: '10:20' },
  { slot: 5, start: '10:20', end: '11:10' },
  { slot: 6, start: '11:10', end: '12:00' },
  { slot: 7, start: '12:30', end: '13:20' },
  { slot: 8, start: '13:20', end: '14:10' },
  { slot: 9, start: '14:10', end: '15:00' },
  { slot: 10, start: '15:30', end: '16:20' },
  { slot: 11, start: '16:20', end: '17:10' },
  { slot: 12, start: '18:15', end: '19:05' },
  { slot: 13, start: '19:05', end: '19:55' },
  { slot: 14, start: '19:55', end: '20:45' },
];

// Helper: konversi startTime (HH:mm) ke nomor slot
export const timeToSlot = (time: string): number => {
  const slot = TIME_SLOTS.find((t) => t.start === time);
  return slot ? slot.slot : 1;
};

// Helper: konversi endTime (HH:mm) ke nomor slot "exclusive"
export const endTimeToSlot = (time: string): number => {
  // Jika waktu ini adalah start dari sebuah slot, artinya end exclusive di slot tsb
  const startSlot = TIME_SLOTS.find((t) => t.start === time);
  if (startSlot) {
    return startSlot.slot;
  }

  // Jika tidak, coba cocokkan dengan end
  const endSlot = TIME_SLOTS.find((t) => t.end === time);
  if (endSlot) {
    return endSlot.slot + 1;
  }

  // Fallback: di luar semua slot
  return TIME_SLOTS.length + 1;
};

// Rentang jam tampilan untuk mode normal (menggunakan titik seperti di UI sekarang)
export const NORMAL_TIME_RANGES: { [key: number]: string } = {
  1: '7.00 - 7.50',
  2: '7.50 - 8.40',
  3: '8.40 - 9.30',
  4: '9.30 - 10.20',
  5: '10.20 - 11.10',
  6: '11.10 - 12.00',
  7: '12.30 - 13.20',
  8: '13.20 - 14.10',
  9: '14.10 - 15.00',
  10: '15.30 - 16.20',
  11: '16.20 - 17.10',
  12: '18.15 - 19.05',
  13: '19.05 - 19.55',
  14: '19.55 - 20.45',
};

// Rentang jam tampilan untuk mode puasa
// Catatan: untuk jam ke-14 diasumsikan 15.30 - 16.00 (bukan 15.30 - 15.00) agar urutan waktu tetap naik.
export const PUASA_TIME_RANGES: { [key: number]: string } = {
  1: '7.30 - 8.00',
  2: '8.00 - 8.30',
  3: '8.30 - 9.00',
  4: '9.00 - 9.30',
  5: '9.30 - 10.00',
  6: '10.00 - 10.30',
  7: '10.30 - 11.00',
  8: '11.00 - 11.30',
  9: '12.30 - 13.00',
  10: '13.00 - 13.30',
  11: '13.30 - 14.00',
  12: '14.00 - 14.30',
  13: '15.00 - 15.30',
  14: '15.30 - 16.00',
};

// Helper umum untuk ambil rentang tampilan berdasarkan mode
export const getDisplayTimeRange = (
  slot: number,
  mode: ScheduleTimeMode = 'normal'
): string => {
  const source = mode === 'puasa' ? PUASA_TIME_RANGES : NORMAL_TIME_RANGES;
  return source[slot] || '';
};

