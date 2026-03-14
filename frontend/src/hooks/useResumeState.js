import { useState, useRef, useEffect } from 'react';

export function useResumeState() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState('');
  const [scoreData, setScoreData] = useState(null);
  const [loadingType, setLoadingType] = useState(null); // 'tailor' | 'coverLetter' | 'refine' | null
  const [serverStatus, setServerStatus] = useState('checking'); // 'online', 'offline', 'checking'
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [history, setHistory] = useState([]); // Array of versions

  const abortRef = useRef(null);

  useEffect(() => {
    checkServerStatus();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification({ message: '', type: '' });
  };

  const checkServerStatus = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/health`);
      setServerStatus(response.ok ? 'online' : 'offline');
    } catch {
      setServerStatus('offline');
    }
  };

  const generate = async (type) => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    if (!resumeText || !jobDescription) {
      showNotification('Please provide both resume and job description.', 'warning');
      return;
    }

    setLoadingType(type);

    try {
      const endpoint = type === 'tailor' ? 'tailor-resume' : 'generate-cover-letter';
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
        signal: abortRef.current.signal
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      
      if (data.warning) console.warn('API Warning:', data.warning);

      setResult(data.output);
      setScoreData(data.scoreData || null);

      if (type === 'tailor') {
        saveToHistory(data.output, data.scoreData, 'Tailored version');
        showNotification('Resume optimized successfully!', 'success');
      } else {
        saveToHistory(data.output, null, 'Cover Letter');
        showNotification('Cover letter generated successfully!', 'success');
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Generation Error:', err);
      
      let message = 'An unexpected error occurred.';
      if (err.message.includes('Failed to fetch')) {
        message = 'Unable to connect to the server. Please check your backend.';
      } else if (err.message.includes('HTTP error')) {
        message = 'Server error occurred. Please try again later.';
      }
      showNotification(message, 'error');
    } finally {
      if (!abortRef.current?.signal.aborted) {
        setLoadingType(null);
      }
    }
  };

  const refine = async (instruction) => {
    if (!instruction.trim() || !result) return;

    if (abortRef.current) {
        abortRef.current.abort();
    }
    abortRef.current = new AbortController();
    setLoadingType('refine');

    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/refine-resume`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                currentResume: result,
                instruction
            }),
            signal: abortRef.current.signal
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || 'Failed to refine resume');
        }

        const data = await response.json();
        setResult(data.output);
        setScoreData(null); // Refined resume needs a rescore ideally, or null out
        saveToHistory(data.output, null, `Refined: ${instruction.substring(0, 20)}...`);
        showNotification('Resume refined successfully!', 'success');
        return true;
    } catch (error) {
        if (error.name === 'AbortError') return false;
        showNotification(error.message || 'Failed to refine resume', 'error');
        return false;
    } finally {
        if (!abortRef.current?.signal.aborted) {
            setLoadingType(null);
        }
    }
  };

  const saveToHistory = (newResult, newScore, label) => {
    setHistory(prev => {
        const entry = {
            id: Date.now(),
            label,
            result: newResult,
            scoreData: newScore,
            timestamp: new Date().toLocaleTimeString()
        };
        const newHistory = [entry, ...prev].slice(0, 10);
        return newHistory;
    });
  };

  const restoreVersion = (version) => {
    setResult(version.result);
    setScoreData(version.scoreData);
    showNotification(`Restored version: ${version.label}`, 'info');
  };

  const countWords = (text) => {
    return text?.trim() === '' ? 0 : (text?.trim().split(/\s+/) || []).length;
  };

  return {
    resumeText, setResumeText,
    jobDescription, setJobDescription,
    result, setResult,
    scoreData, setScoreData,
    loadingType, setLoadingType,
    serverStatus, checkServerStatus,
    isDownloadModalOpen, setIsDownloadModalOpen,
    notification, showNotification, closeNotification,
    generate,
    refine,
    history, restoreVersion, countWords
  };
}
