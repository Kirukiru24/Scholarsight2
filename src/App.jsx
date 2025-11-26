import React, { useState, useEffect } from 'react';
import { UploadedFile, ReviewData, AppView } from '../types';
import FileUpload from '../components/FileUpload';
import ReviewDashboard from '../components/ReviewDashboard';
import ChatInterface from '../components/ChatInterface';
import { generateReview, createChatSession } from '../services/geminiService';
import { BookOpen, Loader2, FileText, AlertTriangle } from 'lucide-react';
import {Chat} from '@google/genai';
import Footer from '../components/Footer';
import scholar from './assets/Scholarsightlogo.jpg';




// Mock Data Structures (Replacing ./types)
// Note: PaperScores and ReviewData shapes are inferred from usage.
const dummyScores = {
    novelty: 8,
    methodology: 7,
    clarity: 9,
    significance: 8,
    citations: 6,
};

const dummyReviewData = {
    summary: "This paper presents a robust framework for neural network optimization, showing moderate novelty but exceptional clarity in its exposition. The results are highly reproducible.",
    recommendation: "Accept with minor revisions to clarify the boundary conditions in the experimental setup.",
    scores: dummyScores,
    strengths: [
        "Excellent documentation and code quality.",
        "Clear and concise problem statement.",
        "Rigorous statistical validation of results."
    ],
    weaknesses: [
        "The comparison baseline is slightly outdated.",
        "Limited discussion on real-world energy consumption.",
    ]
};

// Mock Services (Replacing ./services/geminiService)





// --- 2. CHILD COMPONENTS ---

// ScoreChart Component (Minimal Stub)
const ScoreChart = ({ scores }) => {
  const data = [
    { subject: 'Novelty', A: scores.novelty, fullMark: 10 },
    { subject: 'Methodology', A: scores.methodology, fullMark: 10 },
    { subject: 'Clarity', A: scores.clarity, fullMark: 10 },
    { subject: 'Significance', A: scores.significance, fullMark: 10 },
    { subject: 'Citations', A: scores.citations, fullMark: 10 },
  ];
  
  // Replace with actual recharts component if recharts was included, otherwise simple visual:
  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-inner">
      <h4 className="font-semibold text-slate-700 mb-2">Paper Scores (Visual Placeholder)</h4>
      <div className="space-y-1">
        {data.map(d => (
            <div key={d.subject} className="flex items-center text-xs">
                <span className="w-24 text-slate-500">{d.subject}:</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full">
                    <div className="h-2 bg-academic-600 rounded-full" style={{ width: `${d.A * 10}%` }}></div>
                </div>
                <span className="ml-2 font-medium text-slate-700">{d.A}/10</span>
            </div>
        ))}
      </div>
    </div>
  );
};


// ReviewDashboard Component (Replacing ./components/ReviewDashboard)



// --- 3. MAIN APPLICATION COMPONENT ---

/**
 * Main application component responsible for state management and view routing.
 * (Replacing App: React.FC)
 */
const App = () => {
  const [view, setView] = useState(AppView.UPLOAD);
  const [currentFile, setCurrentFile] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [chatSession, setChatSession] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loadingStep, setLoadingStep] = useState("Initializing...");

  // Convert File to Base64
  const handleFileSelect = (file) => {
    setErrorMsg(null);
    const reader = new FileReader();
    
    reader.onload = () => {
      // The result of reader.readAsDataURL is a data URL string. We extract the Base64 part.
      const base64String = reader.result.split(',')[1];
      const uploadedFile = {
        name: file.name,
        type: file.type,
        data: base64String,
        size: file.size
      };
      setCurrentFile(uploadedFile);
      processFile(uploadedFile);
    };

    reader.onerror = () => {
      setErrorMsg("Failed to read file.");
    };
    
    // Only read if the file is valid
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const processFile = async (file) => {
    setView(AppView.ANALYZING);
    try {
      setLoadingStep("Reading paper content...");
      
      // 1. Initialize Chat Session
      // Using data and type to contextually ground the chat model
      const chat = createChatSession(file.data, file.type);
      setChatSession(chat);

      setLoadingStep("Analyzing methodology and significance...");
      
      // 2. Generate Review (This is the slow, core API call)
      const review = await generateReview(file.data, file.type);
      setReviewData(review);
      setView(AppView.DASHBOARD);
      
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to analyze the paper. Please try again or ensure the file content is valid text/PDF.");
      setView(AppView.ERROR);
    }
  };

  const handleReset = () => {
    setView(AppView.UPLOAD);
    setCurrentFile(null);
    setReviewData(null);
    setChatSession(null);
    setIsChatOpen(false);
    setErrorMsg(null);
  };

  // Render Logic
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col relative overflow-hidden">
      
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => view !== AppView.ANALYZING && handleReset()}>
            <div className="bg-white p-1 rounded-lg">
              {/* <BookOpen className="w-5 h-5 text-white" /> */}
              <img src={scholar} alt="ScholarSight Logo" className="w-12 h-12" />
            </div>
            <span className="font-serif font-bold text-xl text-slate-800">ScholarSight</span>
          </div>
          {currentFile && view === AppView.DASHBOARD && (
             <div className="hidden sm:flex items-center text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
               <FileText className="w-3 h-3 mr-2" />
               <span className="truncate max-w-[200px]">{currentFile.name}</span>
             </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative">
        
        {view === AppView.UPLOAD && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 animate-in fade-in zoom-in duration-500">
            <div className="text-center max-w-2xl mb-12">
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight">
                AI-Powered <br className="hidden sm:block" />
                <span className="text-academic-600">Peer Review</span> Assistant
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Upload a research paper to receive an instant, comprehensive analysis including 
                impact scoring, methodology critique, and clarity assessment.
              </p>
            </div>
            <FileUpload onFileSelect={handleFileSelect} />
            
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl w-full text-center">
              {[
                { label: "Deep Analysis", desc: "Methodology & Novelty checks" },
                { label: "Interactive Chat", desc: "Ask questions to the paper" },
                { label: "Scoring System", desc: "Standardized metric evaluation" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-1 border-t-2 border-academic-300 mb-4" />
                  <h3 className="font-bold text-slate-800 mb-1">{item.label}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === AppView.ANALYZING && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white animate-in fade-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-academic-100 rounded-full animate-ping opacity-20"></div>
              <div className="relative bg-white p-4 rounded-full border-2 border-academic-100 shadow-xl">
                 <Loader2 className="w-12 h-12 text-academic-600 animate-spin" />
              </div>
            </div>
            <h2 className="mt-8 text-2xl font-serif font-bold text-slate-800">Reviewing Paper</h2>
            <p className="mt-2 text-slate-500 animate-pulse">{loadingStep}</p>
          </div>
        )}

        {view === AppView.ERROR && (
           <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50">
             <div className="bg-red-50 p-6 rounded-2xl border border-red-100 max-w-md text-center shadow-lg">
               <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-red-700 mb-2">Analysis Failed</h3>
               <p className="text-red-600 mb-6">{errorMsg || "An unexpected error occurred."}</p>
               <button 
                 onClick={handleReset}
                 className="px-6 py-2 bg-white border border-red-200 text-red-700 font-medium rounded-lg hover:bg-red-50 transition-colors"
               >
                 Try Again
               </button>
             </div>
           </div>
        )}

        {view === AppView.DASHBOARD && reviewData && (
          <div className="flex-1 flex flex-row overflow-hidden relative">
            <div className="flex-1 overflow-y-auto">
              <ReviewDashboard 
                data={reviewData} 
                onOpenChat={() => setIsChatOpen(true)}
                onReset={handleReset}
              />
            </div>
          </div>
        )}

        {/* Chat Drawer */}
        {view === AppView.DASHBOARD && (
          <div 
            className={`fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <ChatInterface 
              chatSession={chatSession} 
              onClose={() => setIsChatOpen(false)} 
            />
          </div>
        )}

        {/* Backdrop for mobile chat */}
        {isChatOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30 sm:hidden" 
            onClick={() => setIsChatOpen(false)} 
          />
        )}

      </main>
      <Footer />
    </div>
  );
};

export default App;
