import { useState, useEffect, useCallback } from 'react';

interface ReadingHistoryItem {
  id: string;
  timestamp: number;
  progress: number;
}

export function useReadingHistory() {
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('readingHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse reading history", e);
      }
    }
  }, []);

  // FIX: Use useCallback to stabilize the function reference
  const addToHistory = useCallback((id: string, progress: number = 0) => {
    setHistory(prevHistory => {
      // Use prevHistory to access the latest state without adding it to dependencies
      const updated = [
        { id, timestamp: Date.now(), progress },
        ...prevHistory.filter(item => item.id !== id)
      ].slice(0, 20);

      // Side effect: Update local storage
      localStorage.setItem('readingHistory', JSON.stringify(updated));

      return updated;
    });
  }, []); // Empty dependency array means this function never changes

  const hasRead = useCallback((id: string) => {
    return history.some(item => item.id === id);
  }, [history]);

  const getProgress = useCallback((id: string) => {
    const item = history.find(item => item.id === id);
    return item?.progress || 0;
  }, [history]);

  return { history, addToHistory, hasRead, getProgress };
}