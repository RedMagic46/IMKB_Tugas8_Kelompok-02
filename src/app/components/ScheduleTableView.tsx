import React from 'react';
import { Schedule } from '../types/schedule';
import {
  TIME_SLOTS,
  getDisplayTimeRange,
  ScheduleTimeMode,
  timeToSlot,
  endTimeToSlot,
} from '../utils/timeSlots';

interface ScheduleTableViewProps {
  schedules: Schedule[];
  mode?: ScheduleTimeMode;
}

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
const DAY_MAPPING: { [key: string]: string } = {
  Monday: 'Senin',
  Tuesday: 'Selasa',
  Wednesday: 'Rabu',
  Thursday: 'Kamis',
  Friday: "Jum'at",
  Saturday: 'Sabtu',
};

export const ScheduleTableView: React.FC<ScheduleTableViewProps> = ({
  schedules,
  mode = 'normal',
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
                Jadwal Kuliah
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
                    {getDisplayTimeRange(timeSlot.slot, mode)}
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