import React, { useState, useEffect } from 'react';
import AttendanceTracker from './components/AttendanceTracker';
import ScoreTracker from './components/ScoreTracker';
import TimetableGrid from './components/TimetableGrid';
import CgpaCalculator from './components/CgpaCalculator';

const initialSubjects = [
  { id: '1', subjectCode: '21CS51', subjectName: 'Management & Entrepreneurship for IT', credits: 3, totalClasses: 36, attendedClasses: 30, facultyName: 'Prof. S. Sharma' },
  { id: '2', subjectCode: '21CS52', subjectName: 'Computer Networks & Security', credits: 4, totalClasses: 40, attendedClasses: 32, facultyName: 'Dr. K. Raman' },
  { id: '3', subjectCode: '21CS53', subjectName: 'Database Management Systems (DBMS)', credits: 4, totalClasses: 38, attendedClasses: 33, facultyName: 'Dr. Ananya Roy' },
  { id: '4', subjectCode: '21CS54', subjectName: 'Theory of Computation & Automata', credits: 3, totalClasses: 35, attendedClasses: 24, facultyName: 'Prof. Vikram Sen' }, // Shortage! 68.5%
  { id: '5', subjectCode: '21CSL55', subjectName: 'Computer Networks Laboratory', credits: 1.5, isLab: true, totalClasses: 12, attendedClasses: 11, facultyName: 'Dr. K. Raman' },
  { id: '6', subjectCode: '21CSL56', subjectName: 'DBMS Laboratory with Mini Project', credits: 1.5, isLab: true, totalClasses: 12, attendedClasses: 12, facultyName: 'Dr. Ananya Roy' },
];

const initialExamScores = [
  { id: '1', subjectCode: '21CS51', subjectName: 'Management & Entrepreneurship for IT', credits: 3, ia1: 24, ia2: 26, ia3: 25, cieMarks: 41, seeMarks: 43 },
  { id: '2', subjectCode: '21CS52', subjectName: 'Computer Networks & Security', credits: 4, ia1: 27, ia2: 28, ia3: 26, cieMarks: 45, seeMarks: 42 },
  { id: '3', subjectCode: '21CS53', subjectName: 'Database Management Systems (DBMS)', credits: 4, ia1: 28, ia2: 29, ia3: 30, cieMarks: 48, seeMarks: 46 },
  { id: '4', subjectCode: '21CS54', subjectName: 'Theory of Computation & Automata', credits: 3, ia1: 19, ia2: 21, ia3: 20, cieMarks: 34, seeMarks: 36 },
  { id: '5', subjectCode: '21CSL55', subjectName: 'Computer Networks Laboratory', credits: 1.5, ia1: 29, ia2: 28, ia3: 30, cieMarks: 48, seeMarks: 47 },
  { id: '6', subjectCode: '21CSL56', subjectName: 'DBMS Laboratory with Mini Project', credits: 1.5, ia1: 30, ia2: 30, ia3: 30, cieMarks: 50, seeMarks: 49 },
];

const initialTimetable = [
  { day: 'Monday', periodNumber: 1, subjectCode: '21CS52', subjectName: 'Computer Networks', roomNo: 'LH-201' },
  { day: 'Monday', periodNumber: 2, subjectCode: '21CS53', subjectName: 'DBMS Theory', roomNo: 'LH-201' },
  { day: 'Monday', periodNumber: 3, subjectCode: '21CS54', subjectName: 'Theory of Computation', roomNo: 'LH-201' },
  { day: 'Monday', periodNumber: 4, subjectCode: '21CS51', subjectName: 'Management & Ent.', roomNo: 'LH-201' },
  { day: 'Monday', periodNumber: 5, subjectCode: '21CSL56', subjectName: 'DBMS Laboratory', roomNo: 'Lab 3', isLab: true },

  { day: 'Tuesday', periodNumber: 1, subjectCode: '21CS53', subjectName: 'DBMS Theory', roomNo: 'LH-201' },
  { day: 'Tuesday', periodNumber: 2, subjectCode: '21CS52', subjectName: 'Computer Networks', roomNo: 'LH-201' },
  { day: 'Tuesday', periodNumber: 3, subjectCode: '21CS51', subjectName: 'Management & Ent.', roomNo: 'LH-201' },
  { day: 'Tuesday', periodNumber: 4, subjectCode: '21CS54', subjectName: 'Theory of Computation', roomNo: 'LH-201' },

  { day: 'Wednesday', periodNumber: 1, subjectCode: '21CS54', subjectName: 'Theory of Computation', roomNo: 'LH-201' },
  { day: 'Wednesday', periodNumber: 2, subjectCode: '21CS51', subjectName: 'Management & Ent.', roomNo: 'LH-201' },
  { day: 'Wednesday', periodNumber: 3, subjectCode: '21CS53', subjectName: 'DBMS Theory', roomNo: 'LH-201' },
  { day: 'Wednesday', periodNumber: 4, subjectCode: '21CS52', subjectName: 'Computer Networks', roomNo: 'LH-201' },
  { day: 'Wednesday', periodNumber: 5, subjectCode: '21CSL55', subjectName: 'Networks Laboratory', roomNo: 'Lab 1', isLab: true },

  { day: 'Thursday', periodNumber: 1, subjectCode: '21CS52', subjectName: 'Computer Networks', roomNo: 'LH-201' },
  { day: 'Thursday', periodNumber: 2, subjectCode: '21CS53', subjectName: 'DBMS Theory', roomNo: 'LH-201' },
  { day: 'Thursday', periodNumber: 3, subjectCode: '21CS54', subjectName: 'Theory of Computation', roomNo: 'LH-201' },
  { day: 'Thursday', periodNumber: 4, subjectCode: '21CS51', subjectName: 'Management & Ent.', roomNo: 'LH-201' },

  { day: 'Friday', periodNumber: 1, subjectCode: '21CS51', subjectName: 'Management & Ent.', roomNo: 'LH-201' },
  { day: 'Friday', periodNumber: 2, subjectCode: '21CS54', subjectName: 'Theory of Computation', roomNo: 'LH-201' },
  { day: 'Friday', periodNumber: 3, subjectCode: '21CS52', subjectName: 'Computer Networks', roomNo: 'LH-201' },
  { day: 'Friday', periodNumber: 4, subjectCode: '21CS53', subjectName: 'DBMS Theory', roomNo: 'LH-201' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('attendance');
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('btech_subjects');
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [examScores, setExamScores] = useState(() => {
    const saved = localStorage.getItem('btech_exams');
    return saved ? JSON.parse(saved) : initialExamScores;
  });

  const [timetable, setTimetable] = useState(() => {
    const saved = localStorage.getItem('btech_timetable');
    return saved ? JSON.parse(saved) : initialTimetable;
  });

  // Sync to local persistence
  useEffect(() => {
    localStorage.setItem('btech_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('btech_exams', JSON.stringify(examScores));
  }, [examScores]);

  useEffect(() => {
    localStorage.setItem('btech_timetable', JSON.stringify(timetable));
  }, [timetable]);

  const handleUpdateAttendance = (id, updates) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleAddSubject = (newSubject) => {
    const id = Date.now().toString();
    const sub = { ...newSubject, id };
    setSubjects(prev => [...prev, sub]);

    // Also add to exam scores
    setExamScores(prev => [...prev, {
      id,
      subjectCode: newSubject.subjectCode,
      subjectName: newSubject.subjectName,
      credits: newSubject.credits || 3,
      ia1: 0,
      ia2: 0,
      ia3: 0,
      cieMarks: 0,
      seeMarks: 0
    }]);
  };

  const handleUpdateScore = (id, field, value) => {
    setExamScores(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <div className="portal-app">
      {/* Top Banner / Student Information */}
      <header className="clean-topbar">
        <div className="topbar-inner">
          <div className="student-profile-strip">
            <div className="student-badge">B.TECH</div>
            <div>
              <h1 className="student-title">College Engineering Academic Tracker</h1>
              <p className="student-meta">
                <span>Computer Science & Engineering</span>
                <span>•</span>
                <span>Semester 5 (Academic Year 2026-27)</span>
                <span>•</span>
                <span className="font-mono">USN / Roll: 1MS21CS084</span>
              </p>
            </div>
          </div>

          <div className="topbar-quick-kpis">
            <div className="quick-kpi">
              <span className="kpi-tag">75% ATTENDANCE</span>
              <span className="kpi-data font-mono">
                {subjects.filter(s => s.totalClasses > 0 && ((s.attendedClasses / s.totalClasses) * 100) < 75).length === 0 ? '✓ CLEAR' : '⚠️ 1 SHORTAGE'}
              </span>
            </div>
            <div className="quick-kpi">
              <span className="kpi-tag">CURRENT SGPA</span>
              <span className="kpi-data font-mono font-bold text-slate">8.68 / 10.0</span>
            </div>
          </div>
        </div>
      </header>

      {/* Minimal Navigation Bar */}
      <nav className="clean-nav">
        <div className="nav-inner">
          <button 
            className={`nav-tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance & Bunk Tracker
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'scores' ? 'active' : ''}`}
            onClick={() => setActiveTab('scores')}
          >
            Internal & Exam Scores
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'timetable' ? 'active' : ''}`}
            onClick={() => setActiveTab('timetable')}
          >
            College Timetable
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'cgpa' ? 'active' : ''}`}
            onClick={() => setActiveTab('cgpa')}
          >
            SGPA / CGPA Simulator
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content-canvas">
        {activeTab === 'attendance' && (
          <AttendanceTracker 
            subjects={subjects} 
            onUpdateAttendance={handleUpdateAttendance}
            onAddSubject={handleAddSubject}
          />
        )}

        {activeTab === 'scores' && (
          <ScoreTracker 
            examScores={examScores} 
            onUpdateScore={handleUpdateScore} 
          />
        )}

        {activeTab === 'timetable' && (
          <TimetableGrid 
            timetable={timetable} 
          />
        )}

        {activeTab === 'cgpa' && (
          <CgpaCalculator 
            examScores={examScores} 
          />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="clean-footer">
        <p>B.Tech Engineering Academic Portal • Strict 75% Attendance & 10-Point Grading System • No Bloat</p>
      </footer>
    </div>
  );
}
