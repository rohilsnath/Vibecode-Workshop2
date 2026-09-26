import React, { useState } from 'react';

export default function AttendanceTracker({ subjects, onUpdateAttendance, onAddSubject }) {
  const [targetThreshold, setTargetThreshold] = useState(75);
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Overall calculations
  const totalConducted = subjects.reduce((sum, s) => sum + s.totalClasses, 0);
  const totalAttended = subjects.reduce((sum, s) => sum + s.attendedClasses, 0);
  const overallPercent = totalConducted > 0 
    ? ((totalAttended / totalConducted) * 100).toFixed(1) 
    : '100.0';

  const shortageCount = subjects.filter(s => {
    if (s.totalClasses === 0) return false;
    return (s.attendedClasses / s.totalClasses) * 100 < targetThreshold;
  }).length;

  const handleMark = (id, type) => {
    const sub = subjects.find(s => s.id === id);
    if (!sub) return;

    let updatedAttended = sub.attendedClasses;
    let updatedTotal = sub.totalClasses + 1;

    if (type === 'present') {
      updatedAttended += 1;
    }

    onUpdateAttendance(id, {
      attendedClasses: updatedAttended,
      totalClasses: updatedTotal
    });
  };

  const getBunkStatus = (attended, total) => {
    if (total === 0) return { type: 'safe', text: 'No classes held yet' };
    const p = attended;
    const t = total;
    const target = targetThreshold / 100;
    const currentPercent = (p / t) * 100;

    if (currentPercent >= targetThreshold) {
      const safe = Math.floor((p - target * t) / target);
      return {
        type: 'safe',
        text: safe > 0 ? `Can bunk next ${safe} classes` : 'On the edge (0 bunks left)'
      };
    } else {
      const needed = Math.ceil((target * t - p) / (1 - target));
      return {
        type: 'shortage',
        text: `Must attend next ${needed} classes`
      };
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newSubCode || !newSubName) return;
    onAddSubject({
      subjectCode: newSubCode.trim().toUpperCase(),
      subjectName: newSubName.trim(),
      attendedClasses: 0,
      totalClasses: 0,
      credits: 3
    });
    setNewSubCode('');
    setNewSubName('');
    setShowAddModal(false);
  };

  return (
    <div className="section-container">
      {/* Metric Summary Header */}
      <div className="metrics-row">
        <div className="metric-box">
          <span className="metric-label">Overall Attendance</span>
          <div className="metric-val-row">
            <span className={`metric-number ${Number(overallPercent) >= targetThreshold ? 'text-green' : 'text-red'}`}>
              {overallPercent}%
            </span>
            <span className="metric-sub">({totalAttended} / {totalConducted} classes)</span>
          </div>
        </div>

        <div className="metric-box">
          <span className="metric-label">Threshold Criteria</span>
          <div className="metric-val-row">
            <select 
              value={targetThreshold} 
              onChange={(e) => setTargetThreshold(Number(e.target.value))}
              className="clean-select"
            >
              <option value={75}>75% (Standard University Rule)</option>
              <option value={80}>80% (Strict College Rule)</option>
              <option value={85}>85% (VTU / Autonomous Rule)</option>
              <option value={65}>65% (Medical Condonation)</option>
            </select>
          </div>
        </div>

        <div className="metric-box">
          <span className="metric-label">Attendance Shortage Alert</span>
          <div className="metric-val-row">
            <span className={`metric-number ${shortageCount > 0 ? 'text-red' : 'text-green'}`}>
              {shortageCount === 0 ? 'All Clear' : `${shortageCount} Subject${shortageCount > 1 ? 's' : ''}`}
            </span>
            <span className="metric-sub">{shortageCount > 0 ? 'Hall ticket risk' : 'Eligible for exams'}</span>
          </div>
        </div>
      </div>

      {/* Action Header */}
      <div className="table-header-bar">
        <div>
          <h2 className="section-title">Subject-Wise Attendance</h2>
          <p className="section-desc">Track attended vs conducted lectures, monitor safe bunks, and resolve shortages.</p>
        </div>
        <button className="btn-clean-primary" onClick={() => setShowAddModal(true)}>
          + Add Subject
        </button>
      </div>

      {/* Attendance Table */}
      <div className="clean-table-wrapper">
        <table className="clean-table">
          <thead>
            <tr>
              <th style={{ width: '120px' }}>Code</th>
              <th>Subject Name</th>
              <th style={{ width: '130px' }}>Held / Attended</th>
              <th style={{ width: '110px' }}>Percentage</th>
              <th style={{ width: '130px' }}>Status</th>
              <th style={{ width: '220px' }}>Bunk Calculation</th>
              <th style={{ width: '180px', textAlign: 'right' }}>Log Attendance</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((sub) => {
              const pct = sub.totalClasses > 0 
                ? ((sub.attendedClasses / sub.totalClasses) * 100).toFixed(1) 
                : '100.0';
              const isSafe = Number(pct) >= targetThreshold;
              const bunk = getBunkStatus(sub.attendedClasses, sub.totalClasses);

              return (
                <tr key={sub.id}>
                  <td className="font-mono font-bold text-slate">{sub.subjectCode}</td>
                  <td>
                    <div className="subject-title">{sub.subjectName}</div>
                    {sub.facultyName && <span className="faculty-sub">{sub.facultyName}</span>}
                  </td>
                  <td>
                    <span className="font-mono text-dark">{sub.attendedClasses}</span>
                    <span className="text-muted"> / {sub.totalClasses}</span>
                  </td>
                  <td>
                    <span className={`font-mono font-bold ${isSafe ? 'text-green' : 'text-red'}`}>
                      {pct}%
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${isSafe ? 'pill-safe' : 'pill-shortage'}`}>
                      {isSafe ? 'Eligible' : 'Shortage'}
                    </span>
                  </td>
                  <td>
                    <span className={`bunk-text ${bunk.type === 'safe' ? 'text-safe' : 'text-danger'}`}>
                      {bunk.text}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="btn-action-group">
                      <button 
                        className="btn-mark-present" 
                        title="Mark Present (+1)"
                        onClick={() => handleMark(sub.id, 'present')}
                      >
                        + Present
                      </button>
                      <button 
                        className="btn-mark-absent" 
                        title="Mark Absent / Bunked"
                        onClick={() => handleMark(sub.id, 'absent')}
                      >
                        Bunk
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="clean-modal-backdrop">
          <div className="clean-modal">
            <div className="modal-top">
              <h3 className="modal-heading">Add Engineering Subject</h3>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body-content">
                <div className="form-row">
                  <label>Subject Code (e.g. 21CS51, KCS501, CS301)</label>
                  <input 
                    type="text" 
                    className="clean-input" 
                    required 
                    value={newSubCode} 
                    onChange={e => setNewSubCode(e.target.value)} 
                    placeholder="21CS51"
                  />
                </div>
                <div className="form-row">
                  <label>Subject Name</label>
                  <input 
                    type="text" 
                    className="clean-input" 
                    required 
                    value={newSubName} 
                    onChange={e => setNewSubName(e.target.value)} 
                    placeholder="Database Management Systems"
                  />
                </div>
              </div>
              <div className="modal-bottom">
                <button type="button" className="btn-clean-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-clean-primary">Add Subject</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
