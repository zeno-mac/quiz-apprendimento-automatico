import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, X, CheckCircle2, Check, LayoutGrid, ChevronDown } from 'lucide-react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import './Quiz.css';

const renderText = (text) => {
  if (!text) return null;
  // Estraiamo le formule \(\) e le passiamo a KaTeX
  const parts = text.split(/\\\((.*?)\\\)/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <InlineMath key={index} math={part} />;
    }
    return <span key={index}>{part}</span>;
  });
};

export default function Quiz({ quizData, onExit, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showGrid, setShowGrid] = useState(false);

  const questions = quizData.data;
  const question = questions[currentIndex];

  if (!question) return null;

  const handleSelect = (ans) => {
    if (answers[currentIndex] === ans) {
      const newAnswers = { ...answers };
      delete newAnswers[currentIndex];
      setAnswers(newAnswers);
    } else {
      setAnswers({ ...answers, [currentIndex]: ans });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    onFinish(answers);
  };

  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button className="btn-icon" onClick={onExit} title="Esci e torna alla Dashboard">
          <X size={24} />
        </button>
        <div className="quiz-progress" onClick={() => setShowGrid(!showGrid)} title="Mostra griglia domande">
          <LayoutGrid size={16} style={{ opacity: 0.8 }} />
          <span>{currentIndex + 1} / {questions.length}</span>
          <ChevronDown size={18} style={{ opacity: 0.7 }} />
        </div>
        <div style={{ width: 40 }}></div> {/* spacer */}
      </div>

      {showGrid && (
        <div className="grid-overlay">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Navigazione Domande</h3>
            <button className="btn-icon" onClick={() => setShowGrid(false)} style={{ padding: '0.2rem' }}>
              <X size={20} />
            </button>
          </div>
          <div className="grid-container">
            {questions.map((_, i) => (
              <button 
                key={i} 
                className={`grid-item ${i === currentIndex ? 'current' : ''} ${answers[i] !== undefined && i !== currentIndex ? 'answered' : ''}`}
                onClick={() => {
                  setCurrentIndex(i);
                  setShowGrid(false);
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="question-area">
        <div className="question-meta" style={{ marginBottom: '1rem' }}>
          <span className="meta-item">
            <strong>Esame:</strong> {question.data_esame}
          </span>
          <span className="meta-item">
            <strong>N°:</strong> {question.numero_domanda}
          </span>
          <span 
            className="meta-item" 
            style={{ marginLeft: 'auto', cursor: 'help' }} 
            title={question.revisione === 'manuale' 
              ? "Questa domanda è stata verificata e corretta manualmente." 
              : "Questa domanda è stata estratta automaticamente e non è ancora stata verificata."}
          >
            {question.revisione === 'manuale' ? (
              <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={16} /> <span style={{ fontWeight: 500 }}>Verificata</span>
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', opacity: 0.8 }}>
                <span style={{ fontWeight: 500 }}>Non Verificata</span>
              </span>
            )}
          </span>
        </div>

        <div className="question-text">
          {renderText(question.domanda)}
        </div>
      </div>

      <div className="options-list">
        {question.risposte_possibili.map((opt, i) => (
          <div
            key={i}
            className={`option-card ${answers[currentIndex] === opt ? 'selected' : ''}`}
            onClick={() => handleSelect(opt)}
          >
            <div className="option-letter">{letters[i]}.</div>
            <div className="option-text">{renderText(opt)}</div>
            {answers[currentIndex] === opt && <Check size={18} color="var(--accent-color)" />}
          </div>
        ))}
      </div>

      <div className="quiz-footer">
        <button
          className="btn-nav"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ArrowLeft size={18} /> Precedente
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            className="btn-nav primary"
            onClick={handleSubmit}
          >
            Consegna <Check size={18} />
          </button>
        ) : (
          <button
            className="btn-nav primary"
            onClick={handleNext}
          >
            Successivo <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
