import React from 'react';

export default function ScoreTracker({ examScores, onUpdateScore }) {
  const handleScoreChange = (id, field, value) => {
    const num = Math.max(0, Number(value) || 0);
    onUpdateScore(id, field, num);
  };

  // Grade helper
  const getGradeInfo = (total) => {
    if (total >= 90) return { letter: 'O', point: 10, label: 'Outstanding' };
    if (total >= 80) return { letter: 'A+', point: 9, label: 'Excellent' };
    if (total >= 70) return { letter: 'A', point: 8, label: 'Very Good' };
    if (total >= 60) return { letter: 'B+', point: 7, label: 'Good' };
    if (total >= 55) return { letter: 'B', point: 6, label: 'Above Average' };
    if (total >= 50) return { letter: 'C', point: 5, label: 'Average' };
    if (total >= 40) return { letter: 'P', point: 4, label: 'Pass' };
    return { letter: 'F', point: 0, label: 'Fail / Backlog' };
  };

  return (
    <div className="section-container">
      <div className="table-header-bar">
        <div>
          <h2 className="section-title">Exam & Internal Assessment Scores</h2>
          <p className="section-desc">Record Mid-Semester / Internal assessments (IA 1, IA 2, IA 3) and Semester End Examination (SEE) marks.</p>
        </div>
        <div className="legend-pills">
          <span className="legend-tag">10-Point Scale</span>
          <span className="legend-tag">Passing Marks: 40/100</span>
        </div>
      </div>

      <div className="clean-table-wrapper">
        <table className="clean-table">
          <thead>
            <tr>
              <th style={{ width: '120px' }}>Code</th>
              <th>Subject Name</th>
              <th style={{ width: '90px' }}>Credits</th>
              <th style={{ width: '100px' }}>IA-1 (30)</th>
              <th style={{ width: '100px' }}>IA-2 (30)</th>
              <th style={{ width: '100px' }}>IA-3 (30)</th>
              <th style={{ width: '110px' }}>Internal / CIE (50)</th>
              <th style={{ width: '110px' }}>End Sem / SEE (50)</th>
              <th style={{ width: '110px' }}>Total (100)</th>
              <th style={{ width: '100px' }}>Grade</th>
              <th style={{ width: '90px' }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {examScores.map(score => {
              const total = (score.cieMarks || 0) + (score.seeMarks || 0);
              const grade = getGradeInfo(total);
              const isBacklog = total < 40;

              return (
                <tr key={score.id} className={isBacklog ? 'row-backlog' : ''}>
                  <td className="font-mono font-bold text-slate">{score.subjectCode}</td>
                  <td className="font-medium text-dark">{score.subjectName}</td>
                  <td className="font-mono text-muted">{score.credits}</td>
                  <td>
                    <input 
                      type="number" 
                      min="0" 
                      max="30" 
                      className="clean-inline-input"
                      value={score.ia1 || 0}
                      onChange={e => handleScoreChange(score.id, 'ia1', e.target.value)}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      min="0" 
                      max="30" 
                      className="clean-inline-input"
                      value={score.ia2 || 0}
                      onChange={e => handleScoreChange(score.id, 'ia2', e.target.value)}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      min="0" 
                      max="30" 
                      className="clean-inline-input"
                      value={score.ia3 || 0}
                      onChange={e => handleScoreChange(score.id, 'ia3', e.target.value)}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      min="0" 
                      max="50" 
                      className="clean-inline-input font-bold"
                      value={score.cieMarks || 0}
                      onChange={e => handleScoreChange(score.id, 'cieMarks', e.target.value)}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      min="0" 
                      max="50" 
                      className="clean-inline-input font-bold"
                      value={score.seeMarks || 0}
                      onChange={e => handleScoreChange(score.id, 'seeMarks', e.target.value)}
                    />
                  </td>
                  <td>
                    <span className={`font-mono font-bold ${isBacklog ? 'text-red' : 'text-dark'}`}>
                      {total} / 100
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${isBacklog ? 'pill-shortage' : 'pill-grade'}`}>
                      {grade.letter}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono font-bold text-slate">
                      {grade.point}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Grade Scale Reference Strip */}
      <div className="grade-legend-bar">
        <span className="legend-label">Indian Engineering Grading Scale:</span>
        <span className="legend-item"><strong>O:</strong> 90-100 (10 pts)</span>
        <span className="legend-item"><strong>A+:</strong> 80-89 (9 pts)</span>
        <span className="legend-item"><strong>A:</strong> 70-79 (8 pts)</span>
        <span className="legend-item"><strong>B+:</strong> 60-69 (7 pts)</span>
        <span className="legend-item"><strong>B:</strong> 55-59 (6 pts)</span>
        <span className="legend-item"><strong>C:</strong> 50-54 (5 pts)</span>
        <span className="legend-item"><strong>P:</strong> 40-49 (4 pts)</span>
        <span className="legend-item text-red"><strong>F:</strong> &lt; 40 (0 pts / Backlog)</span>
      </div>
    </div>
  );
}
