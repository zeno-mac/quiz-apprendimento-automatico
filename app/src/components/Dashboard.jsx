import React, { useEffect, useState } from 'react';
import { Play, RotateCcw, ChevronDown, Upload, Download } from 'lucide-react';
import { getProgress } from '../utils/storage';
import './Dashboard.css';

export default function Dashboard({ questions, onStartExam, onStartTotal, onStartErrors }) {
  const [exams, setExams] = useState([]);
  const [progress, setProgress] = useState({ history: [], wrongQuestionsPool: [] });

  useEffect(() => {
    const savedProgress = getProgress();
    setProgress(savedProgress);

    if (questions.length > 0) {
      const examsMap = new Map();
      questions.forEach(q => {
        if (!examsMap.has(q.data_esame)) {
          examsMap.set(q.data_esame, 0);
        }
        examsMap.set(q.data_esame, examsMap.get(q.data_esame) + 1);
      });
      
      const examsList = Array.from(examsMap.entries()).map(([id, count]) => {
        const isDone = savedProgress.history.some(h => h.examId === id);
        return { id, count, isDone };
      });
      
      examsList.sort((a, b) => b.id.localeCompare(a.id));
      setExams(examsList);
    }
  }, [questions]);

  if (questions.length === 0) {
    return <div style={{ color: 'var(--text-secondary)' }}>Caricamento esami in corso...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-actions">
        <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={onStartTotal}>
          <Play size={18} /> Quiz Totale ({questions.length} dom.)
        </button>
        <button className="btn" style={{ flex: 1, justifyContent: 'center' }} onClick={() => onStartErrors && onStartErrors(progress.wrongQuestionsPool)}>
          <RotateCcw size={18} /> Ripasso Errori ({progress.wrongQuestionsPool.length})
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', marginBottom: '0.5rem' }}>
        <h2 style={{ fontSize: '1.2rem' }}>Esami Disponibili</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn" style={{ padding: '0.4rem', borderRadius: '50%' }} title="Importa Dati">
            <Upload size={16} />
          </button>
          <button className="btn" style={{ padding: '0.4rem', borderRadius: '50%' }} title="Esporta Dati">
            <Download size={16} />
          </button>
        </div>
      </div>
      
      {exams.map(exam => (
        <div key={exam.id} className="exam-card">
          <div className="exam-header">
            <div className="exam-title">
              Esame del {exam.id}
            </div>
            <div className="exam-meta">
              <span>{exam.count} dom.</span>
              <span className={`badge ${exam.isDone ? 'done' : ''}`}>
                {exam.isDone ? 'Fatto' : 'Da fare'}
              </span>
            </div>
          </div>
          
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={() => onStartExam(exam.id)}>
              <Play size={16} /> Inizia
            </button>
            <button className="btn">
              <ChevronDown size={16} /> Dettagli
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
