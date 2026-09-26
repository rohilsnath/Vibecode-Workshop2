import React, { useState } from 'react';

export default function CgpaCalculator({ examScores }) {
  const [priorCgpa, setPriorCgpa] = useState(8.20);
  const [priorCredits, setPriorCredits] = useState(80);
  const [targetCgpa, setTargetCgpa] = useState(8.50);

  // Calculate current semester SGPA from examScores
  let semCredits = 0;
  let semQualityPoints = 0;
  let backlogs = 0;

  examScores.forEach(s => {
    const cr = Number(s.credits) || 3;
    const total = (s.cieMarks || 0) + (s.seeMarks || 0);
    let pt = 0;
    if (total >= 90) pt = 10;
    else if (total >= 80) pt = 9;
    else if (total >= 70) pt = 8;
    else if (total >= 60) pt = 7;
    else if (total >= 55) pt = 6;
    else if (total >= 50) pt = 5;
    else if (total >= 40) pt = 4;
    else {
      pt = 0;
      backlogs++;
    }

    semCredits += cr;
    semQualityPoints += (cr * pt);
  });

  const currentSgpa = semCredits > 0 ? (semQualityPoints / semCredits).toFixed(2) : '0.00';

  // Projected new CGPA
  const totalCumCredits = Number(priorCredits) + semCredits;
  const totalCumQP = (Number(priorCgpa) * Number(priorCredits)) + semQualityPoints;
  const projectedCgpa = totalCumCredits > 0 ? (totalCumQP / totalCumCredits).toFixed(2) : '0.00';

  // Required SGPA to hit target
  // (Target * (priorCredits + semCredits) - (priorCgpa * priorCredits)) / semCredits
  const requiredSgpa = semCredits > 0
    ? ((Number(targetCgpa) * totalCumCredits - (Number(priorCgpa) * Number(priorCredits))) / semCredits).toFixed(2)
    : '0.00';

  // Equivalent Percentage (AICTE: (CGPA - 0.75) * 10)
  const equivalentPercent = Math.max(0, ((Number(projectedCgpa) - 0.75) * 10)).toFixed(1);

  return (
    <div className="section-container">
      <div className="table-header-bar">
        <div>
          <h2 className="section-title">SGPA & CGPA Academic Calculator</h2>
          <p className="section-desc">10-point scale calculations based on credit weightage and AICTE percentage conversion.</p>
        </div>
      </div>

      <div className="gpa-summary-grid">
        <div className="gpa-stat-card">
          <span className="gpa-stat-title">Current Semester SGPA</span>
          <div className="gpa-stat-value text-slate">{currentSgpa}</div>
          <span className="gpa-stat-sub">Based on {semCredits} semester credits</span>
        </div>

        <div className="gpa-stat-card">
          <span className="gpa-stat-title">Cumulative Projected CGPA</span>
          <div className="gpa-stat-value text-green">{projectedCgpa}</div>
          <span className="gpa-stat-sub">Equivalent: ~{equivalentPercent}% (AICTE standard)</span>
        </div>

        <div className="gpa-stat-card">
          <span className="gpa-stat-title">Active Backlogs / Arrears</span>
          <div className={`gpa-stat-value ${backlogs > 0 ? 'text-red' : 'text-slate'}`}>
            {backlogs}
          </div>
          <span className="gpa-stat-sub">{backlogs === 0 ? 'All cleared' : 'Requires re-examination'}</span>
        </div>
      </div>

      {/* Target CGPA Simulator */}
      <div className="simulator-card">
        <h3 className="sim-heading">Target CGPA Goal Planner</h3>
        <p className="sim-sub">Find out the exact SGPA needed this semester to graduate with your dream cumulative grade.</p>

        <div className="sim-inputs-row">
          <div className="sim-input-group">
            <label>Current Cumulative CGPA (Sem 1 to {semCredits ? 'Current' : 'Prev'})</label>
            <input 
              type="number" 
              step="0.01" 
              min="0" 
              max="10" 
              className="clean-input font-mono"
              value={priorCgpa} 
              onChange={e => setPriorCgpa(e.target.value)} 
            />
          </div>

          <div className="sim-input-group">
            <label>Completed Credits So Far</label>
            <input 
              type="number" 
              min="0" 
              max="200" 
              className="clean-input font-mono"
              value={priorCredits} 
              onChange={e => setPriorCredits(e.target.value)} 
            />
          </div>

          <div className="sim-input-group">
            <label>Target Desired CGPA</label>
            <input 
              type="number" 
              step="0.01" 
              min="0" 
              max="10" 
              className="clean-input font-mono"
              value={targetCgpa} 
              onChange={e => setTargetCgpa(e.target.value)} 
            />
          </div>
        </div>

        <div className="sim-result-box">
          <div>
            <div className="sim-result-label">Required Semester SGPA</div>
            <div className="sim-result-val font-mono">{requiredSgpa} / 10.0</div>
          </div>
          <div>
            <span className={`status-pill ${Number(requiredSgpa) <= 10.0 ? 'pill-safe' : 'pill-shortage'}`}>
              {Number(requiredSgpa) <= 10.0 ? 'Achievable Target' : 'Exceeds 10.0 max scale'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
