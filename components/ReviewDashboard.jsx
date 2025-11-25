// ReviewDashboard.jsx

import React from 'react';
// Assuming the ScoreChart component is correctly implemented and imported
// import ScoreChart from './ScoreChart'; // You must ensure this is a JS file

// Importing necessary icons from lucide-react
import { CheckCircle, AlertTriangle, MessageSquare, Award, BookOpen, Quote } from 'lucide-react';
import ScoreChart from './ScoreChart';

// --- Placeholder Components & Constants ---
// In a real JS project, these would be imported or defined globally.


const UserIconGroup = () => (
    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const ScoreRow = ({ label, score }) => (
    <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-academic-500 rounded-full" 
                    style={{width: `${score * 10}%`}}
                />
            </div>
            <span className="text-sm font-bold text-slate-800 w-6 text-right">{score}</span>
        </div>
    </div>
);
// --- End Placeholder Components ---

/**
 * DecisionBadge Component
 * Displays the final review decision with appropriate styling.
 * @param {object} props
 * @param {string} props.decision - The final decision string (e.g., "Accept", "Reject").
 */
const DecisionBadge = ({ decision }) => {
    const colors = {
        "Accept": "bg-green-100 text-green-800 border-green-200",
        "Minor Revision": "bg-blue-100 text-blue-800 border-blue-200",
        "Major Revision": "bg-amber-100 text-amber-800 border-amber-200",
        "Reject": "bg-red-100 text-red-800 border-red-200",
    };

    // Use a fallback color if the decision key is unexpected
    const className = colors[decision] || colors["Major Revision"];

    return (
        <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${className}`}>
            {decision}
        </span>
    );
};

/**
 * ReviewDashboard Component
 * Displays the full structured review of a research paper.
 * @param {object} props
 * @param {object} props.data - The parsed review data object.
 * @param {function} props.onOpenChat - Function to start a chat session.
 * @param {function} props.onReset - Function to start a new review.
 */
const ReviewDashboard = ({ data, onOpenChat, onReset }) => {
    // Ensure scores property exists for safety
    const scores = data.scores || {};

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 leading-tight">
                        {data.title || "Untitled Research Paper"}
                    </h1>
                    {data.authors && data.authors.length > 0 && (
                        <p className="text-slate-500 mt-2 flex items-center gap-2">
                            <UserIconGroup /> {data.authors.join(', ')}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <DecisionBadge decision={data.decision} />
                    <button 
                        onClick={onOpenChat}
                        className="flex items-center gap-2 px-4 py-2 bg-academic-600 text-slate-700 rounded-lg hover:bg-academic-700 transition-colors shadow-sm font-medium"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Discuss Paper
                    </button>
                    <button 
                        onClick={onReset}
                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium"
                    >
                        New Review
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Left Col: Summary & Strengths/Weaknesses/Feedback */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Summary Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-academic-500" />
                            Executive Summary
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-justify">
                            {data.summary}
                        </p>
                    </div>

                    {/* Scores Card (Mobile/Tablet visible) */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:hidden">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5 text-academic-500" />
                            Evaluation Metrics
                        </h2>
                        <div className="flex justify-center min-w-0">
                            <ScoreChart scores={scores} />
                        </div>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-t-4 border-t-green-500">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                Key Strengths
                            </h3>
                            <ul className="space-y-3">
                                {(data.strengths || []).map((str, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                                        <span>{str}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-t-4 border-t-amber-500">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                Areas for Improvement
                            </h3>
                            <ul className="space-y-3">
                                {(data.weaknesses || []).map((wk, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                                        <span>{wk}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Detailed Feedback */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Quote className="w-5 h-5 text-academic-500" />
                            Detailed Reviewer Comments
                        </h2>
                        <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                            {data.detailedFeedback}
                        </div>
                    </div>
                </div>

                {/* Right Col: Radar Chart & Info (Sticky on desktop) */}
                <div className="hidden lg:block space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <Award className="w-5 h-5 text-academic-500" />
                            Evaluation Metrics
                        </h2>
                        <p className="text-xs text-slate-400 mb-6">Based on standard peer-review criteria</p>
                        <div className="flex justify-center -ml-4 min-w-0">
                            <ScoreChart scores={scores} />
                        </div>
                        
                        <div className="mt-6 space-y-4 pt-6 border-t border-slate-100">
                            <ScoreRow label="Novelty" score={scores.novelty} />
                            <ScoreRow label="Methodology" score={scores.methodology} />
                            <ScoreRow label="Clarity" score={scores.clarity} />
                            <ScoreRow label="Significance" score={scores.significance} />
                            <ScoreRow label="Citations" score={scores.citations} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewDashboard;