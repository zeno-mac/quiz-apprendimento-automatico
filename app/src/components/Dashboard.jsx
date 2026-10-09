import React, { useEffect, useState } from 'react';
import { Play, RotateCcw, ChevronDown, Upload, Download } from 'lucide-react';
import { getProgress } from '../utils/storage';
import './Dashboard.css';

export default function Dashboard() {
  const [exams, setExams] = useState([]);
  const [progress, setProgress] = useState({ history: [], wrongQuestionsPool: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carica stato da LocalStorage
    const savedProgress = getProgress();
    setProgress(savedProgress);

    // Carica le domande reali (che abbiamo copiato in public/data)
    const baseUrl = import.meta.env.BASE_URL || '/';
    fetch(`${baseUrl}data/domande.json`)
      .then(res => res.json())
      .then(data => {
        // Raggruppa per data_esame
        const examsMap = new Map();
        data.forEach(q => {
          if (!examsMap.has(q.data_esame)) {
            examsMap.set(q.data_esame, 0);
          }
          examsMap.set(q.data_esame, examsMap.get(q.data_esame) + 1);
        });
        
        const examsList = Array.from(examsMap.entries()).map(([id, count]) => {
          // Controlla se questo esame è già stato fatto in passato guardando l'history
          const isDone = savedProgress.history.some(h => h.examId === id);
          return { id, count, isDone };
        });
        
        // Ordina cronologicamente decrescente
        examsList.sort((a, b) => b.id.localeCompare(a.id));
        setExams(examsList);
        setLoading(false);
      })
      .catch(error => {
        console.error("Errore nel caricamento delle domande:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)' }}>Caricamento esami in corso...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-actions">
        <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
          <Play size={18} /> Quiz Totale ({exams.reduce((acc, curr) => acc + curr.count, 0)} dom.)
        </button>
        <button className="btn" style={{ flex: 1, justifyContent: 'center' }}>
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
            <button className="btn btn-primary">
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
