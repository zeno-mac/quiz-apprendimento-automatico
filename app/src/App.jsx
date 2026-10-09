import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Quiz from './components/Quiz'
import './App.css'

function App() {
  const [questions, setQuestions] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);

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

  const handleFinishQuiz = (answers) => {
    console.log("Quiz terminato, risposte date:", answers);
    // TODO: implementare calcolo punteggio e view dei risultati
    alert("Quiz completato! (Controlla la console per le risposte)");
    setActiveQuiz(null); // per ora torna alla dashboard
  };

  return (
    <div className="container">
      {!activeQuiz && (
        <header className="app-header">
          <h1 className="app-title">Quiz Apprendimento Automatico</h1>
          <p className="app-subtitle">Scegli un esame per iniziare o ripassa gli errori.</p>
        </header>
      )}

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!activeQuiz ? (
          <Dashboard 
            questions={questions} 
            onStartExam={handleStartExam} 
            onStartTotal={handleStartTotal}
          />
        ) : (
          <Quiz 
            quizData={activeQuiz} 
            onExit={() => setActiveQuiz(null)} 
            onFinish={handleFinishQuiz}
          />
        )}
      </main>
    </div>
  )
}

export default App
