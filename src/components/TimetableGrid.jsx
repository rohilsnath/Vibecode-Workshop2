import React, { useState } from 'react';

export default function TimetableGrid({ timetable, onAddSlot }) {
  const [includeSaturday, setIncludeSaturday] = useState(false);

  const days = includeSaturday 
    ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const periods = [
    { num: 1, time: '09:00 - 10:00', label: 'Period 1' },
    { num: 2, time: '10:00 - 11:00', label: 'Period 2' },
    { num: 'break', time: '11:00 - 11:15', label: 'Tea Break', isBreak: true },
    { num: 3, time: '11:15 - 12:15', label: 'Period 3' },
    { num: 4, time: '12:15 - 01:15', label: 'Period 4' },
    { num: 'lunch', time: '01:15 - 02:00', label: 'Lunch Break', isBreak: true },
    { num: 5, time: '02:00 - 04:00', label: 'Period 5 & 6 (Lab / Practicals)', isLab: true }
  ];

  return (
    <div className="section-container">
      <div className="table-header-bar">
        <div>
          <h2 className="section-title">Weekly College Timetable</h2>
          <p className="section-desc">Department lecture timetable with designated lab slots and room allocations.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label className="clean-checkbox-label">
            <input 
              type="checkbox" 
              checked={includeSaturday} 
              onChange={e => setIncludeSaturday(e.target.checked)} 
            />
            Include Saturday Lectures
          </label>
        </div>
      </div>

      <div className="clean-table-wrapper" style={{ overflowX: 'auto' }}>
        <table className="clean-timetable">
          <thead>
            <tr>
              <th style={{ width: '130px' }}>Day</th>
              {periods.map((p, idx) => (
                <th key={idx} style={{ minWidth: p.isBreak ? '90px' : '150px' }}>
                  <div>{p.label}</div>
                  <div className="period-time-sub">{p.time}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map(day => (
              <tr key={day}>
                <td className="day-name-cell">{day}</td>
                {periods.map((p, idx) => {
                  if (p.isBreak) {
                    return (
                      <td key={idx} className="break-slot-cell">
                        <span>{p.num === 'lunch' ? '🍱 Lunch' : '☕ Break'}</span>
                      </td>
                    );
                  }

                  const slot = timetable.find(t => t.day === day && t.periodNumber === p.num);

                  if (slot) {
                    return (
                      <td key={idx} className={slot.isLab ? 'lab-slot-cell' : 'lecture-slot-cell'}>
                        <div className="slot-code">{slot.subjectCode}</div>
                        <div className="slot-name">{slot.subjectName}</div>
                        <div className="slot-footer">
                          <span>📍 {slot.roomNo || 'LH-201'}</span>
                          {slot.isLab && <span className="lab-badge">LAB</span>}
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td key={idx} className="empty-slot-cell">
                      <span className="text-muted">Free / Library</span>
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
}
