import React from 'react';
import { Schedule } from '../types/schedule';

interface ScheduleTableViewProps {
  schedules: Schedule[];
}

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
const DAY_MAPPING: { [key: string]: string } = {
  'Monday': 'Senin',
  'Tuesday': 'Selasa',
  'Wednesday': 'Rabu',
  'Thursday': 'Kamis',
  'Friday': "Jum'at",
  'Saturday': 'Sabtu',
};

// Helper function to get time range for each slot
const getTimeRange = (jamKe: number): string => {
  const timeRanges: { [key: number]: string } = {
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
  return timeRanges[jamKe] || '';
};

// Mapping jam akademik UMM (14 slot waktu) - sama dengan di ScheduleEditModal
const TIME_SLOTS = [
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

// Helper function: Convert waktu (HH:mm) ke slot number
const timeToSlot = (time: string): number => {
  const slot = TIME_SLOTS.find(t => t.start === time);
  return slot ? slot.slot : 1;
};

// Helper function: Convert endTime ke slot number (cari berdasarkan end time)
const endTimeToSlot = (time: string): number => {
  // Cek apakah waktu ini adalah start dari sebuah slot (berarti ini end yang valid)
  const startSlot = TIME_SLOTS.find(t => t.start === time);
  if (startSlot) {
    return startSlot.slot; // Return slot tersebut (exclusive)
  }
  
  // Jika tidak, cari slot yang end-nya sama dengan waktu ini
  const endSlot = TIME_SLOTS.find(t => t.end === time);
  if (endSlot) {
    return endSlot.slot + 1; // Return slot setelahnya (karena endSlot exclusive)
  }
  
  // Fallback
  return 15; // Beyond all slots
};

export const ScheduleTableView: React.FC<ScheduleTableViewProps> = ({
  schedules,
}) => {
  const getScheduleForDayAndSlot = (day: string, slot: number) => {
    const mappedDay = Object.keys(DAY_MAPPING).find(
      (key) => DAY_MAPPING[key] === day
    );
    if (!mappedDay) return null;

    return schedules.find((schedule) => {
      const scheduleStartSlot = timeToSlot(schedule.startTime);
      const scheduleEndSlot = endTimeToSlot(schedule.endTime);

      return (
        schedule.day === mappedDay &&
        slot >= scheduleStartSlot &&
        slot < scheduleEndSlot
      );
    });
  };

  const calculateColSpan = (schedule: Schedule) => {
    const startSlot = timeToSlot(schedule.startTime);
    const endSlot = endTimeToSlot(schedule.endTime);
    return endSlot - startSlot;
  };

  const isStartingSlot = (schedule: Schedule, slot: number) => {
    const scheduleStartSlot = timeToSlot(schedule.startTime);
    return scheduleStartSlot === slot;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-auto">
      <div className="min-w-[1200px]">
        <table className="w-full border-collapse">
          <thead>
            {/* Baris judul semester yang membentang penuh seperti contoh gambar */}
            <tr>
              <th className="border border-gray-300 p-3 bg-gray-50 w-24"></th>
              <th
                colSpan={TIME_SLOTS.length}
                className="border border-gray-300 p-3 bg-gray-50 text-center text-lg font-semibold text-gray-800"
              >
                Smt 3
              </th>
            </tr>
            {/* Baris header jam ke- dan rentang waktu */}
            <tr>
              <th className="border border-gray-300 p-3 bg-gray-50 text-gray-700 w-24">
                {/* Kolom hari */}
              </th>
              {TIME_SLOTS.map((timeSlot) => (
                <th
                  key={timeSlot.slot}
                  className="border border-gray-300 p-2 bg-gray-50 text-gray-700 text-center"
                >
                  <div className="font-medium"> {timeSlot.slot}</div>
                  <div className="text-gray-500 text-xs">
                    {getTimeRange(timeSlot.slot)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => (
              <tr key={day}>
                <td className="border border-gray-300 p-4 bg-gray-50 text-gray-900 font-semibold">
                  {day}
                </td>
                {TIME_SLOTS.map((timeSlot) => {
                  const schedule = getScheduleForDayAndSlot(day, timeSlot.slot);
                  
                  if (!schedule) {
                    return (
                      <td
                        key={`${day}-${timeSlot.slot}`}
                        className="border border-gray-300 p-2 h-20"
                      />
                    );
                  }

                  // Only render if this is the starting slot
                  if (!isStartingSlot(schedule, timeSlot.slot)) {
                    return null;
                  }

                  const colSpan = calculateColSpan(schedule);

                  return (
                    <td
                      key={`${day}-${timeSlot.slot}`}
                      colSpan={colSpan}
                      className="border border-gray-300 p-2 bg-blue-50 align-top text-center text-xs leading-tight"
                    >
                      <div className="text-gray-900 font-semibold mb-1">
                        {schedule.courseName}
                      </div>
                      <div className="text-gray-700 text-[11px]">
                        {schedule.courseCode}
                      </div>
                      <div className="text-gray-600 text-[11px] mt-1">
                        {schedule.roomName}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};