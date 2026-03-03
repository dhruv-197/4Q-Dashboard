/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Brain, 
  Heart, 
  Sparkles, 
  BarChart3, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  Trophy,
  Target,
  ChevronRight,
  Save,
  User,
  History,
  Calendar,
  Eye,
  X
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('tracker');
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [viewingHistoryRef, setViewingHistoryRef] = useState(null);

  // Initialize Data Structure for 4 Weeks
  const createEmptyWeek = () => [
    { name: 'Mon', habits: { pq: false, iq: false, eq: false, sq: false } },
    { name: 'Tue', habits: { pq: false, iq: false, eq: false, sq: false } },
    { name: 'Wed', habits: { pq: false, iq: false, eq: false, sq: false } },
    { name: 'Thu', habits: { pq: false, iq: false, eq: false, sq: false } },
    { name: 'Fri', habits: { pq: false, iq: false, eq: false, sq: false } },
    { name: 'Sat', habits: { pq: false, iq: false, eq: false, sq: false } },
    { name: 'Sun', habits: { pq: false, iq: false, eq: false, sq: false } },
  ];

  // State for Habits and Reflections across 4 weeks
  const [allWeeksData, setAllWeeksData] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('4q_dashboard_data_v2') : null;
    return saved ? JSON.parse(saved) : { 1: createEmptyWeek(), 2: createEmptyWeek(), 3: createEmptyWeek(), 4: createEmptyWeek() };
  });

  const [allReflections, setAllReflections] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('4q_dashboard_reflections_v2') : null;
    return saved ? JSON.parse(saved) : { 1: "", 2: "", 3: "", 4: "" };
  });

  const [saveStatus, setSaveStatus] = useState("");

  // Fixed Quotient Data as per PDF Instructions
  const quotients = [
    { 
      id: 'pq', 
      label: 'Physical (PQ)', 
      habit: '20 min workout / 7 hr sleep', 
      icon: Activity, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50', 
      border: 'border-blue-100' 
    },
    { 
      id: 'iq', 
      label: 'Intelligence (IQ)', 
      habit: '1 hr Learning', 
      icon: Brain, 
      color: 'text-purple-500', 
      bg: 'bg-purple-50', 
      border: 'border-purple-100' 
    },
    { 
      id: 'eq', 
      label: 'Emotional (EQ)', 
      habit: 'Journaling or response to problem', 
      icon: Heart, 
      color: 'text-pink-500', 
      bg: 'bg-pink-50', 
      border: 'border-pink-100' 
    },
    { 
      id: 'sq', 
      label: 'Spiritual (SQ)', 
      habit: 'Gratitude or 5 min reflection', 
      icon: Sparkles, 
      color: 'text-amber-500', 
      bg: 'bg-amber-50', 
      border: 'border-amber-100' 
    },
  ];

  // Persistence
  useEffect(() => {
    localStorage.setItem('4q_dashboard_data_v2', JSON.stringify(allWeeksData));
    localStorage.setItem('4q_dashboard_reflections_v2', JSON.stringify(allReflections));
  }, [allWeeksData, allReflections]);

  // Stats calculation for the selected week
  const stats = useMemo(() => {
    const currentDays = allWeeksData[selectedWeek];
    let total = 0;
    const qTotals = { pq: 0, iq: 0, eq: 0, sq: 0 };
    currentDays.forEach(day => {
      Object.keys(day.habits).forEach(q => {
        if (day.habits[q as keyof typeof day.habits]) { 
          total += 1; 
          qTotals[q as keyof typeof qTotals] += 1; 
        }
      });
    });
    return { 
      total, 
      qTotals, 
      consistency: ((total / 28) * 100).toFixed(1), 
      average: (total / 7).toFixed(1) 
    };
  }, [allWeeksData, selectedWeek]);

  // Summary for History Archive
  const historySummary = useMemo(() => {
    return [1, 2, 3, 4].map(wk => {
      let score = 0;
      allWeeksData[wk].forEach(d => { Object.values(d.habits).forEach(h => { if(h) score++; }); });
      return { week: wk, score, reflection: allReflections[wk] };
    });
  }, [allWeeksData, allReflections]);

  const wordCount = useMemo(() => {
    const trimmed = (allReflections[selectedWeek] || "").trim();
    return trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
  }, [allReflections, selectedWeek]);

  const toggleHabit = (dayIndex: number, qId: string) => {
    const newData = { ...allWeeksData };
    const weekData = [...newData[selectedWeek]];
    const dayData = { ...weekData[dayIndex] };
    const habits = { ...dayData.habits };
    habits[qId as keyof typeof habits] = !habits[qId as keyof typeof habits];
    dayData.habits = habits;
    weekData[dayIndex] = dayData;
    newData[selectedWeek] = weekData;
    setAllWeeksData(newData);
  };

  const handleSaveReflection = () => {
    setSaveStatus("Saving Progress...");
    setTimeout(() => { 
      setSaveStatus("Week " + selectedWeek + " Data Saved!"); 
      setTimeout(() => setSaveStatus(""), 3000); 
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-100">
                <Calendar size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-800 uppercase">4Q Dashboard</h1>
              <p className="text-slate-500 font-medium tracking-tight uppercase tracking-widest text-[10px]">Dhruv Soni • Monthly Growth Journal • 2026</p>
            </div>
          </div>

          <nav className="flex flex-wrap bg-white rounded-2xl shadow-sm p-1.5 border border-slate-200">
            {['tracker', 'dashboard', 'reflection', 'history'].map(tab => (
               <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-5 py-2.5 rounded-xl transition-all text-xs font-black uppercase tracking-widest ${activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-100 text-slate-500'}`}
             >
               {tab}
             </button>
            ))}
          </nav>
        </header>

        {/* Week Selector */}
        {activeTab !== 'history' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 w-fit">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 mr-2">Select Week</span>
              {[1, 2, 3, 4].map(wk => (
                <button
                  key={wk}
                  onClick={() => setSelectedWeek(wk)}
                  className={`w-10 h-10 rounded-xl font-black transition-all ${selectedWeek === wk ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  {wk}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
                <Target size={16} />
                <span className="text-xs font-bold uppercase tracking-tight">Assignment Goal: 28 Pts/Week</span>
            </div>
          </div>
        )}

        {/* Tracker View */}
        {activeTab === 'tracker' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Fixed Habit Descriptions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {quotients.map(q => (
                <div key={q.id} className={`${q.bg} p-5 rounded-3xl border-2 ${q.border} shadow-sm`}>
                  <div className="flex items-center gap-3 mb-2">
                    <q.icon size={20} className={q.color} />
                    <span className="font-black text-slate-700 uppercase tracking-tight text-xs">{q.label}</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 bg-white/60 p-2 rounded-xl border border-white/40">
                    {q.habit}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                  <thead className="bg-slate-50/50 border-b border-slate-200">
                    <tr>
                      <th className="px-8 py-5 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Day</th>
                      {quotients.map(q => (
                        <th key={q.id} className="px-6 py-5 text-center font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">{q.id}</th>
                      ))}
                      <th className="px-8 py-5 text-right font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Daily Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allWeeksData[selectedWeek].map((day: any, dIdx: number) => {
                      const dayScore = Object.values(day.habits).filter(Boolean).length;
                      return (
                        <tr key={day.name} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                          <td className="px-8 py-5 font-black text-slate-700 text-lg">{day.name}</td>
                          {quotients.map(q => (
                            <td key={q.id} className="px-6 py-5 text-center">
                              <button 
                                onClick={() => toggleHabit(dIdx, q.id)}
                                className={`w-12 h-12 rounded-2xl transition-all flex items-center justify-center border-2 ${
                                  day.habits[q.id] 
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 ring-4 ring-indigo-50' 
                                  : 'bg-white border-slate-200 text-slate-200 hover:border-indigo-200'
                                }`}
                                title={q.habit}
                              >
                                {day.habits[q.id] ? <CheckCircle2 size={24} /> : <div className="w-2 h-2 rounded-full bg-slate-200" />}
                              </button>
                            </td>
                          ))}
                          <td className="px-8 py-5 text-right">
                            <span className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl text-sm font-black border ${
                              dayScore === 4 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                              dayScore > 0 ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-50 text-slate-300 border-slate-100'
                            }`}>
                              {dayScore}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600"><Trophy size={28} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total score</p>
                  <p className="text-3xl font-black text-slate-800">{stats.total}<span className="text-xs font-bold text-slate-300 ml-1">/ 28</span></p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600"><Target size={28} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consistency</p>
                  <p className="text-3xl font-black text-slate-800">{stats.consistency}%</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-4 bg-blue-50 rounded-2xl text-blue-600"><Activity size={28} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average per day</p>
                  <p className="text-3xl font-black text-slate-800">{stats.average}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-4 bg-amber-50 rounded-2xl text-amber-600"><Calendar size={28} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking Week</p>
                  <p className="text-3xl font-black text-slate-800">W-{selectedWeek}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progress Chart */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="text-xl font-black text-slate-800 mb-10 flex items-center gap-3">
                  <BarChart3 size={24} className="text-indigo-600" />
                  Weekly Progress Chart
                </h3>
                <div className="flex h-64 gap-6 px-4">
                  <div className="flex flex-col justify-between text-[10px] font-black text-slate-300 uppercase h-56">
                    <span>4</span>
                    <span>3</span>
                    <span>2</span>
                    <span>1</span>
                    <span className="text-indigo-400 font-black">0</span>
                  </div>
                  
                  <div className="flex items-end justify-between flex-1 h-56 gap-4 relative">
                    {/* Background grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between py-1 pointer-events-none opacity-20 border-b border-slate-200">
                      {[1,2,3,4].map(i => <div key={i} className="border-t border-slate-400 w-full" />)}
                    </div>

                    {allWeeksData[selectedWeek].map((day: any) => {
                      const score = Object.values(day.habits).filter(Boolean).length;
                      const height = (score / 4) * 100;
                      return (
                        <div key={day.name} className="flex flex-col items-center flex-1 group h-full relative z-10">
                          {/* TOOLTIP */}
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none bg-slate-800 text-white text-[10px] px-2 py-1.5 rounded-lg font-black flex flex-col items-center shadow-xl z-30">
                            <span>Score: {score}</span>
                            <div className="w-2 h-2 bg-slate-800 rotate-45 -mb-2 mt-[-4px]"></div>
                          </div>

                          <div className="w-full relative flex flex-col justify-end h-full bg-slate-50 rounded-t-2xl overflow-hidden border-x border-t border-slate-100 transition-colors group-hover:bg-slate-100/50">
                            <div 
                              style={{ height: `${height}%` }}
                              className={`w-full transition-all duration-700 ease-out relative ${
                                score === 4 ? 'bg-indigo-600' : score > 0 ? 'bg-indigo-400' : 'bg-transparent'
                              }`}
                            />
                          </div>
                          <span className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">{day.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">X Axis: Days • Y Axis: Score (0-4)</p>
              </div>

              {/* Q-wise Performance Summary */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="text-xl font-black text-slate-800 mb-10 flex items-center gap-3">
                  <Target size={24} className="text-indigo-600" />
                  Q-wise performance summary
                </h3>
                <div className="space-y-8">
                  {quotients.map(q => {
                    const count = stats.qTotals[q.id as keyof typeof stats.qTotals];
                    const percentage = (count / 7) * 100;
                    return (
                      <div key={q.id}>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-black text-slate-700 flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg ${q.bg}`}><q.icon size={16} className={q.color} /></div>
                            {q.label}
                          </span>
                          <span className="text-sm font-black text-indigo-600 tracking-widest">{count} out of 7</span>
                        </div>
                        <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden p-1 border border-slate-100">
                          <div 
                            style={{ width: `${percentage}%` }}
                            className={`h-full transition-all duration-1000 ease-in-out rounded-full ${
                              q.id === 'pq' ? 'bg-blue-500 shadow-sm' : 
                              q.id === 'iq' ? 'bg-purple-500 shadow-sm' : 
                              q.id === 'eq' ? 'bg-pink-500 shadow-sm' : 
                              'bg-amber-500 shadow-sm'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reflection View */}
        {activeTab === 'reflection' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                  <BookOpen size={24} className="text-indigo-600" />
                  Weekly Reflection Summary
                </h3>
                <div className="flex items-center gap-4">
                  <div className={`text-xs px-4 py-2 rounded-xl font-black tracking-tight border transition-colors ${wordCount >= 300 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                    {wordCount} / 300 Words
                  </div>
                  <button onClick={handleSaveReflection} className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl text-sm font-black hover:bg-indigo-700 shadow-lg active:scale-95 transition-all">
                    <Save size={18} /> Save Summary
                  </button>
                </div>
              </div>
              
              {saveStatus && (
                <div className="mb-6 p-5 rounded-2xl text-sm flex items-center gap-3 font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 size={20} /> {saveStatus}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-5 bg-indigo-50/50 rounded-3xl border border-indigo-100">
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Required Reflection Points</h4>
                  <ul className="space-y-2 text-xs font-bold text-slate-600">
                    <li className="flex items-center gap-2"><ChevronRight size={14} className="text-indigo-400" /> Which Q was strongest?</li>
                    <li className="flex items-center gap-2"><ChevronRight size={14} className="text-indigo-400" /> Which Q was weakest?</li>
                    <li className="flex items-center gap-2"><ChevronRight size={14} className="text-indigo-400" /> What distracted you?</li>
                    <li className="flex items-center gap-2"><ChevronRight size={14} className="text-indigo-400" /> What will you improve next week?</li>
                  </ul>
                </div>
                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Assignment Learning Outomes</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Self-Awareness", "Self-Responsibility", "Self-Discipline", "4Q Balance", "EQ Control"].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-tighter">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <textarea 
                value={allReflections[selectedWeek]}
                onChange={(e) => {
                  const newRefs = { ...allReflections };
                  newRefs[selectedWeek] = e.target.value;
                  setAllReflections(newRefs);
                }}
                placeholder="Write your weekly reflection summary here... Analyze your growth and challenges."
                className="w-full h-[500px] p-10 bg-slate-50/50 border-2 border-slate-100 rounded-[3rem] focus:bg-white focus:ring-8 focus:ring-indigo-50/50 focus:border-indigo-500 transition-all resize-none text-slate-700 leading-relaxed text-lg outline-none"
              />
            </div>
          </div>
        )}

        {/* History View */}
        {activeTab === 'history' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                  <History size={24} className="text-indigo-600" />
                  Monthly History Archive
                </h3>

                <div className="grid grid-cols-1 gap-4">
                   {historySummary.map(wk => (
                     <div key={wk.week} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 gap-6">
                        <div className="flex items-center gap-6">
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm ${wk.score > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                              {wk.week}
                           </div>
                           <div>
                              <p className="text-lg font-black text-slate-800">Week {wk.week} Performance Record</p>
                              <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">{wk.score} out of 28 Points • {wk.reflection ? "Reflection Logged" : "No Summary"}</p>
                           </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                           <button onClick={() => { setSelectedWeek(wk.week); setActiveTab('dashboard'); }} className="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">
                              View Stats
                           </button>
                           <button disabled={!wk.reflection} onClick={() => setViewingHistoryRef(wk as any)} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${wk.reflection ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}>
                              <Eye size={16} /> View Message
                           </button>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="mt-12 p-10 bg-slate-900 rounded-[2.5rem] text-white">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-white/10 rounded-xl text-indigo-400"><Trophy size={24} /></div>
                        <h4 className="text-xl font-black uppercase tracking-tighter">Grand Monthly Summary</h4>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-6xl font-black text-indigo-400">
                            {historySummary.reduce((acc, curr) => acc + curr.score, 0)}
                        </span>
                        <span className="text-xl font-bold text-slate-500 mb-2">/ 112 Total Growth Points</span>
                    </div>
                </div>
             </div>
          </div>
        )}

        {/* Modal for viewing reflection from history */}
        {viewingHistoryRef && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-indigo-50/30">
                   <div>
                      <h3 className="text-xl font-black text-slate-800">Week {(viewingHistoryRef as any).week} Summary</h3>
                      <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Dhruv Soni's Journal</p>
                   </div>
                   <button onClick={() => setViewingHistoryRef(null)} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-800 transition-colors"><X size={24} /></button>
                </div>
                <div className="p-10 max-h-[60vh] overflow-y-auto">
                   <p className="text-slate-600 leading-relaxed whitespace-pre-wrap font-medium text-lg">{(viewingHistoryRef as any).reflection}</p>
                </div>
                <div className="p-8 bg-slate-50 flex justify-end">
                   <button onClick={() => setViewingHistoryRef(null)} className="bg-slate-800 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-700">Close Archive</button>
                </div>
             </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center border-t border-slate-200 pt-8 pb-12">
          <p className="font-bold text-slate-400 tracking-tight uppercase text-[10px] tracking-widest mb-2">© 2026 Dhruv Soni • Build 4Q Dashboard Assignment</p>
          <div className="opacity-40 grayscale flex justify-center gap-12 text-slate-400">
             <div className="flex flex-col items-center gap-2"><Activity size={24} /><span className="text-[8px] font-black uppercase tracking-widest">Physical</span></div>
             <div className="flex flex-col items-center gap-2"><Brain size={24} /><span className="text-[8px] font-black uppercase tracking-widest">Intellect</span></div>
             <div className="flex flex-col items-center gap-2"><Heart size={24} /><span className="text-[8px] font-black uppercase tracking-widest">Emotional</span></div>
             <div className="flex flex-col items-center gap-2"><Sparkles size={24} /><span className="text-[8px] font-black uppercase tracking-widest">Spiritual</span></div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
