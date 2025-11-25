// ScoreChart.jsx

import React from 'react';
// Importing necessary components from recharts
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

// Note: PaperScores type definition is removed as it is TypeScript specific.
// We assume 'scores' is passed as an object with the expected properties.

/**
 * ScoreChart Component
 * Displays the research paper scores using a Radar Chart from Recharts.
 * @param {object} props
 * @param {object} props.scores - An object containing paper scores (novelty, methodology, clarity, significance, citations).
 */
export const ScoreChart = ({ scores }) => {
  // Ensure scores has default values to prevent crashes if a property is missing
  const safeScores = {
    novelty: scores?.novelty || 0,
    methodology: scores?.methodology || 0,
    clarity: scores?.clarity || 0,
    significance: scores?.significance || 0,
    citations: scores?.citations || 0,
  };

  const data = [
    { subject: 'Novelty', A: safeScores.novelty, fullMark: 10 },
    { subject: 'Methodology', A: safeScores.methodology, fullMark: 10 },
    { subject: 'Clarity', A: safeScores.clarity, fullMark: 10 },
    { subject: 'Significance', A: safeScores.significance, fullMark: 10 },
    { subject: 'Citations', A: safeScores.citations, fullMark: 10 },
  ];

  return (
    <div className="w-full h-[300px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
          />
          {/* Angle={30} ensures the radius lines meet the axis properly */}
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
          <Radar
            name="Paper Score"
            dataKey="A"
            stroke="#56738e"
            fill="#56738e"
            fillOpacity={0.4}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#1e293b', fontWeight: 600 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreChart;