import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Home } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { saveQuizResult } from '../utils/storage';
import './Results.css';

const renderText = (text) => {
  if (!text) return null;
  const parts = text.split(/\\\((.*?)\\\)/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <InlineMath key={index} math={part} />;
    }
    return <span key={index}>{part}</span>;
  });
};

export default function Results({ quizData, answers, onClose }) {
  const [hasSaved, setHasSaved] = useState(false);
  const questions = quizData.data;
  
  const score = questions.reduce((acc, q, index) => {
    const userAnswer = answers[index];
    const isCorrect = userAnswer && q.risposte_corrette.includes(userAnswer);
    return acc + (isCorrect ? 1 : 0);
  }, 0);

  useEffect(() => {
    if (hasSaved) return;
    
    const wrongList = [];
    const correctIds = [];
    questions.forEach((q, index) => {
      const userAnswer = answers[index];
      if (!userAnswer || !q.risposte_corrette.includes(userAnswer)) {
        wrongList.push({
          id: q.id,
          selectedAnswer: userAnswer || "Nessuna risposta"
        });
      } else {
        correctIds.push(q.id);
      }
    });

    saveQuizResult(quizData.id, score, questions.length, wrongList, correctIds);
    setHasSaved(true);
  }, [hasSaved, quizData.id, score, questions, answers]);

  return (
    <div className="results-container">
      <div className="results-header">
        <h2 style={{ fontSize: '1.5rem' }}>Risultati del Quiz</h2>
        <div className="score-display">
          {score} <span style={{ fontSize: '1.75rem', color: 'var(--text-secondary)' }}>/ {questions.length}</span>
        </div>
        <div className="score-text">
          {score >= questions.length * 0.6 ? 'Ottimo lavoro! Continua così.' : 'Puoi fare di meglio, ripassa gli errori.'}
        </div>
      </div>

      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Revisione Domande</h3>

      <div className="review-list">
        {questions.map((q, index) => {
          const userAnswer = answers[index];
          const isCorrect = userAnswer && q.risposte_corrette.includes(userAnswer);

          return (
            <div key={index} className={`review-card ${isCorrect ? 'correct' : 'incorrect'}`}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                {isCorrect ? <CheckCircle color="var(--success)" size={22} style={{ marginTop: '0.1rem', flexShrink: 0 }}/> : <XCircle color="var(--danger)" size={22} style={{ marginTop: '0.1rem', flexShrink: 0 }}/>}
                <div className="review-question">
                  <strong>{index + 1}.</strong> {renderText(q.domanda)}
                </div>
              </div>

              <div style={{ marginLeft: '2.1rem' }}>
                {!isCorrect && (
                  <div className="answer-box user-wrong">
                    <XCircle size={18} style={{ flexShrink: 0, marginTop: '0.1rem' }} /> 
                    <span><strong>La tua risposta:</strong> {renderText(userAnswer || "Nessuna risposta data")}</span>
                  </div>
                )}
                
                <div className="answer-box correct" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                    <CheckCircle size={18} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                    <span style={{ width: '100%' }}>
                      <strong>{q.risposte_corrette.length > 1 ? 'Risposte corrette ammesse:' : 'Risposta corretta:'}</strong>
                      <div style={{ marginTop: '0.2rem' }}>
                        {q.risposte_corrette.map((rc, idx) => (
                          <div key={idx} style={{ marginBottom: '0.2rem' }}>
                            {q.risposte_corrette.length > 1 && <span style={{ opacity: 0.7 }}>• </span>} {renderText(rc)}
                          </div>
                        ))}
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="results-footer">
        <button className="btn-nav primary" onClick={onClose} style={{ padding: '1rem 2rem' }}>
          <Home size={18} /> Torna alla Dashboard
        </button>
      </div>
    </div>
  );
}
