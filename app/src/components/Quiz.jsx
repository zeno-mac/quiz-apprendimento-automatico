import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, X, CheckCircle2, Check, LayoutGrid, ChevronDown, HelpCircle, Repeat2 } from 'lucide-react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import CorrectionModal from './CorrectionModal';
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
  const [showCorrection, setShowCorrection] = useState(false);
  const [showExamsPopover, setShowExamsPopover] = useState(false);
  const popoverRef = useRef(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowExamsPopover(false);
      }
    };
    if (showExamsPopover) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showExamsPopover]);

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
      setShowCorrection(false);
      setShowExamsPopover(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowCorrection(false);
      setShowExamsPopover(false);
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
                  setShowCorrection(false);
                  setShowExamsPopover(false);
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

          {/* Ripetizioni badge with popover */}
          {question.ripetizioni != null && (
            <div ref={popoverRef} style={{ position: 'relative', display: 'inline-flex' }}>
              <span
                className={`meta-item repetitions-badge ${question.ripetizioni > 1 ? 'repeated' : ''}`}
                onClick={() => setShowExamsPopover(v => !v)}
                onMouseEnter={() => setShowExamsPopover(true)}
                onMouseLeave={(e) => {
                  if (!popoverRef.current?.contains(e.relatedTarget)) {
                    setShowExamsPopover(false);
                  }
                }}
              >
                <Repeat2 size={14} />
                <span>{question.ripetizioni === 1 ? 'Appare 1 volta' : `Appare ${question.ripetizioni} volte`}</span>
              </span>
              {showExamsPopover && question.altri_esami?.length > 0 && (
                <div className="exams-popover">
                  <div className="exams-popover-title">Presente in:</div>
                  <ul className="exams-popover-list">
                    {question.altri_esami.map((exam) => (
                      <li key={exam} className={exam === question.data_esame ? 'current-exam' : ''}>
                        {exam}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}


          {(() => {
            const isVerified = question.revisione === 'correzione_manuale' || question.revisione === 'manuale';
            return (
              <span
                className="meta-item"
                style={{ marginLeft: 'auto', cursor: 'help' }}
                title={isVerified
                  ? "Il testo di questa domanda è stato verificato e corretto manualmente."
                  : "Il testo di questa domanda è stato estratto automaticamente e non è ancora stato verificato."}
              >
                {isVerified ? (
                  <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle2 size={16} /> <span style={{ fontWeight: 500 }}>Verificata</span>
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', opacity: 0.8 }}>
                    <span style={{ fontWeight: 500 }}>Non Verificata</span>
                  </span>
                )}
              </span>
            );
          })()}
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

        <button
          className="btn-nav btn-correction"
          onClick={() => setShowCorrection(true)}
          title="Mostra la correzione e la spiegazione di questa domanda"
        >
          <HelpCircle size={18} /> Mostra Correzione
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

      <CorrectionModal
        isOpen={showCorrection}
        onClose={() => setShowCorrection(false)}
        question={question}
        userAnswer={answers[currentIndex]}
        questionNumber={currentIndex + 1}
      />
    </div>
  );
}
