import React, { useState, useEffect } from 'react';
import { Schedule, Course, Room } from '../types/schedule';
import { X } from 'lucide-react';
import { TIME_SLOTS, timeToSlot, endTimeToSlot } from '../utils/timeSlots';

interface ScheduleEditModalProps {
  schedule?: Schedule | null; // Optional untuk mode create
  courses: Course[];
  rooms: Room[];
  onClose: () => void;
  onSave: (schedule: Schedule) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_LABELS: Record<string, string> = {
  'Monday': 'Senin',
  'Tuesday': 'Selasa',
  'Wednesday': 'Rabu',
  'Thursday': 'Kamis',
  'Friday': 'Jumat',
  'Saturday': 'Sabtu',
};

const SKS_OPTIONS = [1, 2, 3, 4];

export const ScheduleEditModal: React.FC<ScheduleEditModalProps> = ({
  schedule,
  courses,
  rooms,
  onClose,
  onSave,
}) => {
  const isEditMode = !!schedule;
  
  // Default empty form untuk create mode
  const defaultFormData: Schedule = {
    id: `sch-${Date.now()}`,
    courseId: courses[0]?.id || '',
    courseName: courses[0]?.name || '',
    courseCode: courses[0]?.code || '',
    roomId: rooms[0]?.id || '',
    roomName: rooms[0]?.name || '',
    day: 'Monday',
    startTime: '07:00',
    endTime: '09:00',
    lecturer: courses[0]?.lecturer || '',
    hasConflict: false,
  };

  const [formData, setFormData] = useState<Schedule>(
    schedule || defaultFormData
  );
  const [startSlot, setStartSlot] = useState<number>(
    schedule ? timeToSlot(schedule.startTime) : 1
  );
  const [sks, setSks] = useState<number>(() => {
    if (!schedule) return 1;
    const start = timeToSlot(schedule.startTime);
    const endExclusive = endTimeToSlot(schedule.endTime);
    const raw = endExclusive - start;
    const clamped = Math.max(1, Math.min(SKS_OPTIONS[SKS_OPTIONS.length - 1], raw));
    return clamped;
  });

  // Auto-calculate end time when start slot or SKS changes
  useEffect(() => {
    const startTimeData = TIME_SLOTS.find((t) => t.slot === startSlot);

    // endExclusive adalah slot "setelah" kuliah berakhir
    const endExclusive = startSlot + sks;
    let endTime: string | undefined;

    if (endExclusive <= TIME_SLOTS.length) {
      // Masih dalam rentang slot, pakai start slot berikutnya
      const endTimeData = TIME_SLOTS.find((t) => t.slot === endExclusive);
      endTime = endTimeData?.start;
    } else {
      // Melewati slot terakhir: pakai end time slot terakhir (misal 20:45)
      const lastSlot = TIME_SLOTS[TIME_SLOTS.length - 1];
      endTime = lastSlot.end;
    }

    if (startTimeData && endTime) {
      setFormData((prev) => ({
        ...prev,
        startTime: startTimeData.start,
        endTime,
      }));
    }
  }, [startSlot, sks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pastikan mata kuliah dan ruangan terpilih
    if (!formData.courseId || !formData.roomId) {
      return;
    }
    onSave(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="text-base sm:text-lg text-gray-900">{isEditMode ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Mata Kuliah
            </label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={(e) => {
                const course = courses.find((c) => c.id === e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  courseId: e.target.value,
                  courseName: course?.name || '',
                  courseCode: course?.code || '',
                  lecturer: course?.lecturer || '',
                }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
              disabled={courses.length === 0}
            >
              {courses.length === 0 ? (
                <option value="">Belum ada mata kuliah</option>
              ) : (
                courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} - {course.code}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Hari</label>
            <select
              name="day"
              value={formData.day}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              {DAYS.map((day) => (
                <option key={day} value={day}>
                  {DAY_LABELS[day]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Jam Mulai
              </label>
              <select
                value={startSlot}
                onChange={(e) => setStartSlot(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
              {TIME_SLOTS.filter(
                (t) => t.slot <= TIME_SLOTS.length - sks + 1
              ).map((timeSlot) => (
                  <option key={timeSlot.slot} value={timeSlot.slot}>
                    Jam ke-{timeSlot.slot} ({timeSlot.start})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                SKS
              </label>
              <select
                value={sks}
                onChange={(e) => setSks(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                {SKS_OPTIONS.map((credits) => (
                  <option key={credits} value={credits}>
                    {credits} SKS
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Info waktu selesai */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            {(() => {
              const startInfo = TIME_SLOTS.find((t) => t.slot === startSlot);
              const endExclusive = startSlot + sks;
              const endSlotLabel = Math.min(
                TIME_SLOTS.length,
                Math.max(startSlot, endExclusive - 1)
              );
              const endInfo =
                endExclusive <= TIME_SLOTS.length
                  ? TIME_SLOTS.find((t) => t.slot === endExclusive)
                  : TIME_SLOTS[TIME_SLOTS.length - 1];

              const startTimeLabel = startInfo?.start ?? '';
              const endTimeLabel =
                endExclusive <= TIME_SLOTS.length
                  ? endInfo?.start ?? ''
                  : endInfo?.end ?? '';

              return (
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Waktu Kuliah:</span> Jam ke-
                  {startSlot} s/d Jam ke-{endSlotLabel} ({startTimeLabel} -{' '}
                  {endTimeLabel})
                </p>
              );
            })()}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Ruangan</label>
            <select
              name="roomId"
              value={formData.roomId}
              onChange={(e) => {
                const room = rooms.find((r) => r.id === e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  roomId: e.target.value,
                  roomName: room?.name || '',
                }));
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
              disabled={rooms.length === 0}
            >
              {rooms.length === 0 ? (
                <option value="">Belum ada ruangan</option>
              ) : (
                rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} - {room.building}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Info jika belum ada mata kuliah / ruangan */}
          {(courses.length === 0 || rooms.length === 0) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              {courses.length === 0 && (
                <p>Belum ada mata kuliah. Tambahkan terlebih dahulu di menu Mata Kuliah.</p>
              )}
              {rooms.length === 0 && (
                <p className="mt-1">Belum ada ruangan. Tambahkan data ruangan terlebih dahulu.</p>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={courses.length === 0 || rooms.length === 0}
              className="flex-1 px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};