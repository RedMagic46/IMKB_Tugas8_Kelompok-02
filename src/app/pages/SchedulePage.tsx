import React, { useState, useEffect } from 'react';
import {
  Calendar,
  AlertTriangle,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Download,
} from 'lucide-react';
import { Schedule } from '../types/schedule';
import {
  detectConflicts,
  generateSchedule,
  markConflicts,
} from '../utils/scheduleAlgorithm';
import { exportListViewPDF, exportTableViewPDF } from '../utils/exportPDF';
import { ScheduleCalendar } from '../components/ScheduleCalendar';
import { ScheduleTableView } from '../components/ScheduleTableView';
import { ScheduleEditModal } from '../components/ScheduleEditModal';
import { toast } from 'sonner';
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../../lib/scheduleService';
import { useRealtimeSchedules } from '../../hooks/useRealtimeSchedules';
import { useRealtimeCourses } from '../../hooks/useRealtimeCourses';
import { useRealtimeRooms } from '../../hooks/useRealtimeRooms';
import {
  ScheduleTimeMode,
  timeToSlot,
  endTimeToSlot,
  getDisplayTimeRange,
} from '../utils/timeSlots';

export const SchedulePage: React.FC = () => {
  const {
    schedules: realtimeSchedules,
    loading: realtimeLoading,
    refresh: refreshSchedules,
  } = useRealtimeSchedules();
  const { courses, loading: coursesLoading } = useRealtimeCourses();
  const { rooms, loading: roomsLoading } = useRealtimeRooms();

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGeneratedTable, setShowGeneratedTable] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeMode, setTimeMode] = useState<ScheduleTimeMode>('normal');

  useEffect(() => {
    if (!realtimeLoading && !coursesLoading && !roomsLoading) {
      const markedSchedules = markConflicts(realtimeSchedules);
      setSchedules(markedSchedules);
      setLoading(false);
    }
  }, [realtimeSchedules, realtimeLoading, coursesLoading, roomsLoading]);

  const handleDetectConflicts = () => {
    const conflicts = detectConflicts(schedules);
    const markedSchedules = markConflicts(schedules);
    setSchedules(markedSchedules);

    if (conflicts.length === 0) {
      toast.success('Tidak ada jadwal yang bentrok!');
    } else {
      toast.error(`Ditemukan ${conflicts.length} jadwal yang bentrok!`);
    }
  };

  const handleAutoGenerate = () => {
    // Check if there are any conflicts first
    const conflicts = detectConflicts(schedules);
    
    if (conflicts.length > 0) {
      toast.error(
        `Tidak bisa generate tabel jadwal! Masih ada ${conflicts.length} jadwal yang bentrok. Silakan edit terlebih dahulu.`,
        {
          duration: 5000,
        }
      );
      return;
    }

    // Jika tidak ada konflik, tampilkan tabel view dari jadwal yang sudah ada
    setShowGeneratedTable(true);
    toast.success('Tabel jadwal berhasil di-generate!');
  };

  const handleEdit = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      try {
        await deleteSchedule(id);
        await refreshSchedules();
        toast.success('Jadwal berhasil dihapus');
        
        // Jika sedang menampilkan tabel, hide dulu karena data sudah berubah
        if (showGeneratedTable) {
          setShowGeneratedTable(false);
        }
      } catch (error) {
        console.error('Error deleting schedule:', error);
        toast.error('Gagal menghapus jadwal');
      }
    }
  };

  const handleSave = async (updatedSchedule: Schedule) => {
    const isNewSchedule = !schedules.find(s => s.id === updatedSchedule.id);
    
    try {
      if (isNewSchedule) {
        // Create new schedule
        await createSchedule({
          courseId: updatedSchedule.courseId,
          roomId: updatedSchedule.roomId,
          day: updatedSchedule.day,
          startTime: updatedSchedule.startTime,
          endTime: updatedSchedule.endTime,
        });
        await refreshSchedules();
        toast.success('Jadwal berhasil ditambahkan!');
      } else {
        // Update existing schedule
        await updateSchedule(updatedSchedule.id, updatedSchedule);
        await refreshSchedules();
        toast.success('Jadwal berhasil diperbarui');
      }
      
      setIsEditModalOpen(false);
      setSelectedSchedule(null);
      
      // Jika sedang menampilkan tabel, hide dulu karena data sudah berubah
      if (showGeneratedTable) {
        setShowGeneratedTable(false);
        if (isNewSchedule) {
          toast.info('Silakan generate ulang tabel.');
        }
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error(isNewSchedule ? 'Gagal menambahkan jadwal' : 'Gagal memperbarui jadwal');
    }
  };

  const handleAddSchedule = () => {
    setSelectedSchedule(null); // null = create mode
    setIsEditModalOpen(true);
  };

  const handleExportPDF = () => {
    if (showGeneratedTable) {
      // Export dalam format tabel grid
      exportTableViewPDF(schedules, timeMode);
      toast.success('Jadwal berhasil diekspor dalam format Tabel View!');
    } else {
      // Export dalam format list
      exportListViewPDF(schedules, timeMode);
      toast.success('Jadwal berhasil diekspor dalam format List View!');
    }
  };

  // Helper: format tampilan waktu per jadwal sesuai mode jam (normal / puasa)
  const getDisplayTimeForSchedule = (schedule: Schedule): string => {
    if (timeMode === 'normal') {
      return `${schedule.startTime} - ${schedule.endTime}`;
    }

    const startSlot = timeToSlot(schedule.startTime);
    const endExclusive = endTimeToSlot(schedule.endTime);
    const endSlot = Math.max(startSlot, endExclusive - 1);

    const startRange = getDisplayTimeRange(startSlot, 'puasa');
    const endRange = getDisplayTimeRange(endSlot, 'puasa');

    if (!startRange || !endRange) {
      return `${schedule.startTime} - ${schedule.endTime}`;
    }

    const [startStart] = startRange.split(' - ');
    const [, endEnd] = endRange.split(' - ');
    return `${startStart} - ${endEnd}`;
  };

  const conflictCount = schedules.filter((s) => s.hasConflict).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat jadwal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Mobile Title Section - Not sticky, just below Layout header */}
      <div className="lg:hidden bg-white border-b px-4 py-3">
          <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h1 className="text-lg text-gray-900">Jadwal Kuliah</h1>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Conflict Badge on Mobile */}
        {conflictCount > 0 && (
          <div className="flex items-center gap-2 text-xs bg-red-50 text-red-700 px-3 py-2 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
            <span>{conflictCount} Jadwal Bentrok</span>
          </div>
        )}
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 mt-3 pt-3 space-y-2">
            <button
              onClick={() => {
                handleAddSchedule();
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Tambah Jadwal
            </button>
            <button
              onClick={() => {
                handleDetectConflicts();
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <AlertTriangle className="w-4 h-4" />
              Deteksi Bentrok
            </button>
            <button
              onClick={() => {
                handleAutoGenerate();
                setMobileMenuOpen(false);
              }}
              disabled={conflictCount > 0}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:bg-green-300 disabled:cursor-not-allowed text-sm"
            >
              <Calendar className="w-4 h-4" />
              Generate Tabel
            </button>
            <button
              onClick={() => {
                handleExportPDF();
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={() =>
                setTimeMode((prev) => (prev === 'normal' ? 'puasa' : 'normal'))
              }
              className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              {timeMode === 'normal' ? 'Mode Jam Puasa' : 'Mode Jam Biasa'}
            </button>
          </div>
        )}
      </div>

      {/* Desktop/Tablet Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Desktop Header */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl text-gray-900 mb-2">
                Manajemen Jadwal
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Kelola jadwal kuliah dan deteksi bentrok
              </p>
            </div>
          </div>

          {/* Alert for Conflicts - Desktop */}
          {conflictCount > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <div>
                  <h3 className="text-base sm:text-lg text-red-800 mb-1">
                    {conflictCount} Jadwal Bentrok Terdeteksi
                  </h3>
                  <p className="text-sm text-red-700">
                    Silakan perbaiki jadwal yang bentrok dengan mengubah waktu atau
                    ruangan sebelum generate jadwal baru.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons - Desktop */}
          <div className="flex gap-3 flex-wrap items-center">
            <button
              onClick={handleDetectConflicts}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Deteksi Bentrok</span>
              <span className="sm:hidden">Deteksi</span>
            </button>
            <button
              onClick={handleAutoGenerate}
              disabled={conflictCount > 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:bg-green-300 disabled:cursor-not-allowed text-sm sm:text-base"
              title={
                conflictCount > 0
                  ? 'Perbaiki jadwal bentrok terlebih dahulu'
                  : 'Tampilkan jadwal dalam format tabel'
              }
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Generate Tabel Jadwal</span>
              <span className="sm:hidden">Generate</span>
            </button>
            <button
              onClick={handleAddSchedule}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah Jadwal</span>
              <span className="sm:hidden">Tambah</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">Export</span>
            </button>
            <button
              onClick={() =>
                setTimeMode((prev) => (prev === 'normal' ? 'puasa' : 'normal'))
              }
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm sm:text-base"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">
                {timeMode === 'normal' ? 'Jam Puasa' : 'Jam Biasa'}
              </span>
              <span className="sm:hidden">
                {timeMode === 'normal' ? 'Jam Puasa' : 'Jam Biasa'}
              </span>
            </button>
          </div>
        </div>

        {/* Generated Table View */}
        {showGeneratedTable ? (
          <div>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl text-gray-900 mb-1">
                  Jadwal Kuliah (Tabel View)
                </h2>
                <p className="text-sm text-gray-600">
                  Menampilkan {schedules.length} jadwal kuliah
                </p>
              </div>
              <button
                onClick={() => setShowGeneratedTable(false)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Edit className="w-4 h-4" />
                Kembali ke List View
              </button>
            </div>
            <div className="overflow-x-auto">
              <ScheduleTableView schedules={schedules} />
            </div>
          </div>
        ) : (
          // Mobile Card View & Desktop Table View
          <>
            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className={`bg-white rounded-lg shadow-sm p-4 ${
                    schedule.hasConflict ? 'border-l-4 border-red-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-500">
                          {schedule.courseCode}
                        </span>
                        {schedule.hasConflict ? (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                            Bentrok
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                            OK
                          </span>
                        )}
                      </div>
                      <h3 className="text-base text-gray-900 mb-2">
                        {schedule.courseName}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Hari</p>
                      <p className="text-gray-900">{schedule.day}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Waktu</p>
                                      <p className="text-gray-900">
                        {getDisplayTimeForSchedule(schedule)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Ruangan</p>
                      <p className="text-gray-900">{schedule.roomName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Dosen</p>
                      <p className="text-gray-900 text-sm">{schedule.lecturer}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(schedule)}
                      className="flex-1 px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(schedule.id)}
                      className="flex-1 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Kode
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Mata Kuliah
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Hari
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Waktu
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Ruangan
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Dosen
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {schedules.map((schedule) => (
                      <tr
                        key={schedule.id}
                        className={schedule.hasConflict ? 'bg-red-50' : ''}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {schedule.courseCode}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {schedule.courseName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {schedule.day}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {getDisplayTimeForSchedule(schedule)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {schedule.roomName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {schedule.lecturer}
                        </td>
                        <td className="px-6 py-4">
                          {schedule.hasConflict ? (
                            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                              Bentrok
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                              OK
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(schedule)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(schedule.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <ScheduleEditModal
            schedule={selectedSchedule}
            courses={courses}
            rooms={rooms}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedSchedule(null);
            }}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};