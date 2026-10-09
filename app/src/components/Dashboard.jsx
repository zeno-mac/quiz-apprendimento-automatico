import React, { useEffect, useState } from 'react';
import { Play, RotateCcw, ChevronDown, Upload, Download, Dices } from 'lucide-react';
import { getProgress } from '../utils/storage';
import './Dashboard.css';

export default function Dashboard({ questions, onStartExam, onStartTotal, onStartErrors, onStartRandom }) {
  const [exams, setExams] = useState([]);
  const [progress, setProgress] = useState({ history: [], wrongQuestionsPool: [] });
  const [expandedExam, setExpandedExam] = useState(null);
  const [showRandom, setShowRandom] = useState(false);
  const [randomCount, setRandomCount] = useState(15);

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
          <Play size={18} /> Totale ({questions.length})
        </button>
        <button className="btn" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowRandom(!showRandom)}>
          <Dices size={18} /> Random
        </button>
        <button className="btn" style={{ flex: 1, justifyContent: 'center' }} onClick={() => onStartErrors && onStartErrors(progress.wrongQuestionsPool)}>
          <RotateCcw size={18} /> Ripasso ({progress.wrongQuestionsPool.length})
        </button>
      </div>

      {showRandom && (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'var(--card-bg)', padding: '1rem', borderRadius: 'var(--border-radius)', marginBottom: '1rem', border: '1px solid var(--border-color)', animation: 'fadeIn 0.2s ease', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem' }}>N° domande:</span>
            <input 
              type="number" 
              min="1" 
              max={questions.length} 
              value={randomCount} 
              onChange={(e) => setRandomCount(parseInt(e.target.value) || 1)}
              style={{ width: '70px', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--overlay-bg)', color: 'var(--text-primary)', fontSize: '1rem' }}
            />
          </div>
          <button className="btn btn-primary" onClick={() => onStartRandom && onStartRandom(randomCount)}>
            Avvia
          </button>
        </div>
      )}

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
            <button className="btn" onClick={() => setExpandedExam(expandedExam === exam.id ? null : exam.id)}>
              <ChevronDown size={16} style={{ transform: expandedExam === exam.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} /> 
              Dettagli
            </button>
          </div>

          {expandedExam === exam.id && (
            <div className="exam-details" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', animation: 'fadeIn 0.2s ease' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Storico Risultati</h4>
              {(() => {
                const examHistory = progress.history.filter(h => h.examId === exam.id).reverse();
                if (examHistory.length === 0) {
                  return <div style={{ fontSize: '0.9rem' }}>Nessun tentativo registrato.</div>;
                }
                return (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {examHistory.map((h, i) => (
                      <li key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', backgroundColor: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                        <span>{new Date(h.date).toLocaleDateString('it-IT')} {new Date(h.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
                        <strong style={{ color: h.score >= h.total * 0.6 ? 'var(--success)' : 'var(--danger)' }}>
                          {h.score} / {h.total}
                        </strong>
                      </li>
                    ))}
                  </ul>
                );
              })()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
