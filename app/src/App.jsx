import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Quiz from './components/Quiz'
import { Sun, Moon } from 'lucide-react'
import Results from './components/Results'
import { saveQuizResult } from './utils/storage'
import './App.css'

function App() {
  const [questions, setQuestions] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/';
    fetch(`${baseUrl}data/domande.json`)
      .then(res => res.json())
      .then(data => {
        // Aggiungiamo un ID univoco a ogni domanda
        const withIds = data.map(q => ({
          ...q,
          id: `${q.data_esame}_${q.numero_domanda}`
        }));
        setQuestions(withIds);
      })
      .catch(err => console.error("Errore nel caricamento delle domande:", err));
  }, []);

  const handleStartExam = (examId) => {
    const examQuestions = questions.filter(q => q.data_esame === examId);
    setActiveQuiz({ type: 'exam', id: examId, data: examQuestions });
  };

  const handleStartTotal = () => {
    // Clona e mescola le domande per il quiz totale (opzionale)
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setActiveQuiz({ type: 'total', id: 'Totale', data: shuffled });
  };

  const handleStartRandom = (count) => {
    const safeCount = Math.min(Math.max(1, count), questions.length);
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, safeCount);
    setActiveQuiz({ type: 'random', id: `Random (${safeCount})`, data: shuffled });
  };

  const handleStartErrors = (wrongPool) => {
    if (!wrongPool || wrongPool.length === 0) {
      alert("Nessun errore da ripassare al momento!");
      return;
    }
    const errorQuestions = questions.filter(q => wrongPool.includes(q.id));
    const shuffled = [...errorQuestions].sort(() => Math.random() - 0.5);
    setActiveQuiz({ type: 'error', id: 'Ripasso Errori', data: shuffled });
  };

  const handleFinishQuiz = (answers) => {
    const questions = activeQuiz.data;
    let score = 0;
    const wrongList = [];
    const correctIds = [];
    
    questions.forEach((q, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer && q.risposte_corrette.some(rc => rc.trim() === userAnswer.trim());
      
      if (isCorrect) {
        score++;
        correctIds.push(q.id);
      } else {
        wrongList.push({
          id: q.id,
          selectedAnswer: userAnswer || "Nessuna risposta"
        });
      }
    });

    saveQuizResult(activeQuiz.id, score, questions.length, wrongList, correctIds);
    setQuizResults({ data: activeQuiz, answers });
    setActiveQuiz(null);
  };

  const handleCloseResults = () => {
    setQuizResults(null);
  };

  return (
    <div className="container">
      {!activeQuiz && !quizResults && (
        <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="app-title">Quiz Apprendimento Automatico</h1>
            <p className="app-subtitle">Scegli un esame per iniziare o ripassa gli errori.</p>
          </div>
          <button className="btn-icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: 'var(--overlay-bg)', color: 'var(--text-primary)', border: 'none', cursor: 'pointer', display: 'flex' }}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>
      )}

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!activeQuiz && !quizResults ? (
          <Dashboard 
            questions={questions} 
            onStartExam={handleStartExam} 
            onStartTotal={handleStartTotal}
            onStartErrors={handleStartErrors}
            onStartRandom={handleStartRandom}
          />
        ) : activeQuiz ? (
          <Quiz 
            quizData={activeQuiz} 
            onExit={() => setActiveQuiz(null)} 
            onFinish={handleFinishQuiz}
          />
        ) : (
          <Results 
            quizData={quizResults.data}
            answers={quizResults.answers}
            onClose={handleCloseResults}
          />
        )}
      </main>
    </div>
  )
}

export default App
