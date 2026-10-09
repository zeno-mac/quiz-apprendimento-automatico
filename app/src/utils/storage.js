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
