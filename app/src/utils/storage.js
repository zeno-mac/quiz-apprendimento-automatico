export const getProgress = () => {
  const data = localStorage.getItem('quiz_progress');
  if (!data) return { history: [], wrongQuestionsPool: [] };
  return JSON.parse(data);
};

export const saveProgress = (progress) => {
  localStorage.setItem('quiz_progress', JSON.stringify(progress));
};
