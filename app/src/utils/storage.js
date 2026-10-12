export const getProgress = () => {
  const data = localStorage.getItem('quiz_progress');
  if (!data) return { history: [], wrongQuestionsPool: [] };
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Error parsing progress from localStorage:", error);
    return { history: [], wrongQuestionsPool: [] };
  }
};

export const saveProgress = (progress) => {
  localStorage.setItem('quiz_progress', JSON.stringify(progress));
};

export const saveQuizResult = (examId, score, total, wrongQuestionsList, correctIds = []) => {
  const progress = getProgress();
  
  progress.history.push({
    date: new Date().toISOString(),
    examId,
    score,
    total,
    wrongQuestions: wrongQuestionsList
  });

  wrongQuestionsList.forEach(wq => {
    if (!progress.wrongQuestionsPool.includes(wq.id)) {
      progress.wrongQuestionsPool.push(wq.id);
    }
  });

  correctIds.forEach(id => {
    const index = progress.wrongQuestionsPool.indexOf(id);
    if (index !== -1) {
      progress.wrongQuestionsPool.splice(index, 1);
    }
  });

  saveProgress(progress);
};
