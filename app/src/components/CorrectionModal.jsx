import React, { useEffect } from 'react';
import { X, CheckCircle2, XCircle, AlertCircle, Lightbulb, Check } from 'lucide-react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import './CorrectionModal.css';

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

export default function CorrectionModal({
  isOpen,
  onClose,
  question,
  userAnswer,
  questionNumber
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !question) return null;

  const isAnswered = userAnswer !== undefined && userAnswer !== null && userAnswer !== '';
  const isCorrect = isAnswered && question.risposte_corrette.some(
    rc => rc.trim() === userAnswer.trim()
  );

  const explanation = question.spiegazione || question.explanation;
  const hasExplanation = Boolean(explanation && explanation.trim());

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h3 className="modal-title">Correzione Domanda {questionNumber}</h3>
            <span className="modal-subtitle">Esame: {question.data_esame}</span>
          </div>
          <button className="btn-icon" onClick={onClose} title="Chiudi (Esc)">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Question Prompt Preview */}
          <div className="modal-question-box">
            <div className="modal-question-text">
              {renderText(question.domanda)}
            </div>
          </div>

          {/* User Answer Status */}
          <div className="modal-section">
            <h4 className="section-label">Stato della tua risposta</h4>
            {!isAnswered ? (
              <div className="status-box unanswered">
                <AlertCircle size={20} className="status-icon" />
                <div className="status-content">
                  <div className="status-headline">Nessuna risposta selezionata</div>
                  <div className="status-desc">
                    Non hai ancora selezionato una risposta per questa domanda.
                  </div>
                </div>
              </div>
            ) : isCorrect ? (
              <div className="status-box correct">
                <CheckCircle2 size={20} className="status-icon" />
                <div className="status-content">
                  <div className="status-headline">Risposta Esatta!</div>
                  <div className="status-desc">
                    <span className="user-choice-label">La tua risposta:</span> {renderText(userAnswer)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="status-box incorrect">
                <XCircle size={20} className="status-icon" />
                <div className="status-content">
                  <div className="status-headline">Risposta Errata</div>
                  <div className="status-desc">
                    <span className="user-choice-label">La tua risposta:</span> {renderText(userAnswer)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Correct Answer(s) - Only shown if not correct, or if there are other alternative correct answers */}
          {!isCorrect ? (
            <div className="modal-section">
              <h4 className="section-label">
                {question.risposte_corrette.length > 1
                  ? 'Risposte corrette ammesse'
                  : 'Risposta corretta'}
              </h4>
              <div className="correct-answers-list">
                {question.risposte_corrette.map((rc, idx) => (
                  <div key={idx} className="correct-answer-item">
                    <Check size={18} className="correct-check-icon" />
                    <div className="correct-answer-text">{renderText(rc)}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            question.risposte_corrette.length > 1 && (
              <div className="modal-section">
                <h4 className="section-label">Altre risposte corrette ammesse</h4>
                <div className="correct-answers-list">
                  {question.risposte_corrette
                    .filter(rc => rc.trim() !== userAnswer.trim())
                    .map((rc, idx) => (
                      <div key={idx} className="correct-answer-item">
                        <Check size={18} className="correct-check-icon" />
                        <div className="correct-answer-text">{renderText(rc)}</div>
                      </div>
                    ))}
                </div>
              </div>
            )
          )}

          {/* Explanation Section */}
          <div className="modal-section">
            <div className="section-label-with-icon">
              <Lightbulb size={18} className="explanation-bulb-icon" />
              <h4 className="section-label" style={{ margin: 0 }}>Spiegazione</h4>
            </div>

            {hasExplanation ? (
              <div className="explanation-card">
                <div className="explanation-text">
                  {renderText(explanation)}
                </div>
              </div>
            ) : (
              <div className="explanation-placeholder">
                <div className="placeholder-text">
                  Nessuna spiegazione disponibile al momento per questa domanda. Verrà integrata nelle prossime revisioni del dataset.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn-modal-close" onClick={onClose}>
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}
