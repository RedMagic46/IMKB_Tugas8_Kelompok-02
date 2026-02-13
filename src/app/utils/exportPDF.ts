import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Schedule } from '../types/schedule';
import {
  TIME_SLOTS,
  ScheduleTimeMode,
  getDisplayTimeRange,
  timeToSlot,
  endTimeToSlot,
} from './timeSlots';

/**
 * UTILITY UNTUK EXPORT PDF
 * Mendukung 2 mode:
 * 1. List View - Export tabel biasa dengan semua kolom
 * 2. Table View - Export jadwal dalam format grid (Hari x Jam)
 */

// Helper untuk format tanggal
const formatDate = () => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('id-ID', options);
};

/**
 * Export List View ke PDF
 * Format: Tabel biasa dengan kolom Kode, Nama, Hari, Waktu, Ruangan, Dosen, Status
 * `mode` menentukan apakah waktu ditampilkan sebagai jam kuliah biasa atau jam puasa.
 */
export const exportListViewPDF = (
  schedules: Schedule[],
  mode: ScheduleTimeMode = 'normal'
) => {
  const doc = new jsPDF('landscape');

  // Header
  doc.setFontSize(18);
  doc.text('JADWAL KULIAH', doc.internal.pageSize.getWidth() / 2, 15, {
    align: 'center',
  });

  doc.setFontSize(10);
  doc.text(
    `Dicetak pada: ${formatDate()}`,
    doc.internal.pageSize.getWidth() / 2,
    22,
    { align: 'center' }
  );

  // Helper untuk format waktu per baris sesuai mode
  const getDisplayTimeForSchedule = (schedule: Schedule): string => {
    if (mode === 'normal') {
      return `${schedule.startTime} - ${schedule.endTime}`;
    }

    // Mode puasa: konversi ke slot lalu pakai rentang jam puasa
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

  // Prepare data
  const tableData = schedules.map((schedule) => [
    schedule.courseCode,
    schedule.courseName,
    schedule.day,
    getDisplayTimeForSchedule(schedule),
    schedule.roomName,
    schedule.lecturer,
    schedule.hasConflict ? 'BENTROK' : 'OK',
  ]);

  // Generate table
  autoTable(doc, {
    head: [['Kode', 'Mata Kuliah', 'Hari', 'Waktu', 'Ruangan', 'Dosen', 'Status']],
    body: tableData,
    startY: 30,
    theme: 'grid',
    headStyles: {
      fillColor: [59, 130, 246], // Blue
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 20 }, // Kode
      1: { cellWidth: 60 }, // Mata Kuliah
      2: { cellWidth: 25 }, // Hari
      3: { cellWidth: 40 }, // Waktu
      4: { cellWidth: 25 }, // Ruangan
      5: { cellWidth: 50 }, // Dosen
      6: { cellWidth: 20, halign: 'center' }, // Status
    },
    didParseCell: (data) => {
      // Highlight bentrok dengan warna merah
      if (data.section === 'body' && data.column.index === 6) {
        const rowData = schedules[data.row.index];
        if (rowData.hasConflict) {
          data.cell.styles.fillColor = [239, 68, 68]; // Red
          data.cell.styles.textColor = [255, 255, 255];
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.fillColor = [34, 197, 94]; // Green
          data.cell.styles.textColor = [255, 255, 255];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Halaman ${i} dari ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save
  doc.save(`Jadwal-Kuliah-List-${Date.now()}.pdf`);
};

/**
 * Export Table View ke PDF
 * Format: Grid Hari (baris) x Jam (kolom) seperti jadwal kuliah pada umumnya.
 * `mode` menentukan apakah header jam menggunakan jam kuliah biasa atau jam puasa.
 */
export const exportTableViewPDF = (
  schedules: Schedule[],
  mode: ScheduleTimeMode = 'normal'
) => {
  // A4 landscape untuk satu lembar penuh
  const doc = new jsPDF('landscape', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header judul semester di tengah atas (mirip gambar referensi)
  doc.setFontSize(16);
  doc.text('Jadwal Kuliah', pageWidth / 2, 15, { align: 'center' });

  // Info tanggal kecil di kiri bawah seperti “Menghasilkan jadwal: ...”
  doc.setFontSize(8);
  doc.text(`Menghasilkan jadwal: ${formatDate()}`, 10, 200);

  // Baris header jam 1–14 dengan rentang waktu
  const dayLabels = ['Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
  const headRow = ['']; // kolom pertama kosong (untuk hari)
  TIME_SLOTS.forEach((slot) => {
    headRow.push(
      `${slot.slot}\n${getDisplayTimeRange(slot.slot, mode)}`
    );
  });

  // Helper: dapatkan jadwal untuk kombinasi hari (label Indonesia) dan slot
  const getScheduleForDayAndSlot = (dayLabel: string, slot: number): Schedule | null => {
    const mapDayToEnglish: Record<string, string> = {
      Senin: 'Monday',
      Selasa: 'Tuesday',
      Rabu: 'Wednesday',
      Kamis: 'Thursday',
      "Jum'at": 'Friday',
      Sabtu: 'Saturday',
    };
    const eng = mapDayToEnglish[dayLabel];
    if (!eng) return null;

    return (
      schedules.find((schedule) => {
        if (schedule.day !== eng) return false;
        const startSlot = timeToSlot(schedule.startTime);
        const endSlot = endTimeToSlot(schedule.endTime);
        return slot >= startSlot && slot < endSlot;
      }) || null
    );
  };

  // Helper: cek starting slot dan colSpan seperti pada ScheduleTableView
  const isStartingSlot = (schedule: Schedule, slot: number) =>
    timeToSlot(schedule.startTime) === slot;
  const calculateColSpan = (schedule: Schedule) =>
    endTimeToSlot(schedule.endTime) - timeToSlot(schedule.startTime);

  // Bangun body tabel: tiap baris = satu hari dengan cell merged
  const body: any[] = [];
  dayLabels.forEach((label) => {
    const row: any[] = [];
    row.push({ content: label, styles: { fontStyle: 'bold' } });

    const processed = new Set<number>();
    TIME_SLOTS.forEach((slotObj, index) => {
      const slotNumber = slotObj.slot;
      if (processed.has(index)) return;

      const schedule = getScheduleForDayAndSlot(label, slotNumber);
      if (!schedule) {
        row.push(''); // cell kosong
        return;
      }

      if (!isStartingSlot(schedule, slotNumber)) {
        return; // akan ditangani oleh starting cell
      }

      const span = calculateColSpan(schedule);
      row.push({
        content: `${schedule.courseName}\n${schedule.roomName}\n${schedule.courseCode}`,
        colSpan: span,
        styles: { fillColor: [255, 255, 255] },
      });

      // tandai slot berikutnya sebagai sudah ter-cover
      for (let i = 1; i < span; i++) {
        processed.add(index + i);
      }
    });

    body.push(row);
  });

  autoTable(doc, {
    head: [headRow],
    body,
    // mulai sedikit di bawah judul agar grid memenuhi halaman
    startY: 25,
    theme: 'grid',
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontSize: 7,
      halign: 'center',
      valign: 'middle',
      minCellHeight: 18,
    },
    styles: {
      fontSize: 7,
      halign: 'center',
      valign: 'middle',
      cellPadding: 1.2,
      lineWidth: 0.3,
      lineColor: [0, 0, 0],
      // Tinggikan cell supaya grid memenuhi tinggi halaman
      minCellHeight: 22,
      overflow: 'linebreak',
    },
    columnStyles: {
      0: { cellWidth: 18 }, // kolom hari
      // kolom jam otomatis disesuaikan lebar-nya agar muat 14 kolom
    },
    // Margin kecil di atas & bawah supaya tabel hampir penuh 1 lembar
    margin: { top: 18, left: 10, right: 10, bottom: 10 },
    didDrawCell: () => {
      // tidak ada styling ekstra per-cell di sini;
      // grid sederhana agar mirip contoh referensi
    },
  });

  doc.save(`Jadwal-Kuliah-Table-${Date.now()}.pdf`);
};