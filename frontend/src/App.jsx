import { useRef } from 'react';
import './App.css';
import { DownloadModal } from './assets/documentExporter.jsx';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ResultsSection } from './components/ResultsSection';
import { Footer } from './components/Footer';
import { GenerateSection } from './components/GenerateSection';
import { Notification } from './components/Notification';
import { useResumeState } from './hooks/useResumeState';

function App() {
  const resumeRef = useRef(null);
  
  const {
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
  } = useResumeState();

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    showNotification('Resume content copied to clipboard!', 'info');
  };

  const handleDownload = () => {
    if (!result || result.trim() === '') {
      showNotification('No resume content to download. Please generate a resume first.', 'warning');
      return;
    }
    setIsDownloadModalOpen(true);
  };

  return (
    <div className="app">
      <Navbar />

      <Notification 
        message={notification.message} 
        type={notification.type} 
        onClose={closeNotification} 
      />

      <div className="main-container">
        <Header serverStatus={serverStatus} />

        <InputSection
          resumeText={resumeText}
          setResumeText={setResumeText}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          countWords={countWords}
        />

        <GenerateSection 
          resumeText={resumeText}
          jobDescription={jobDescription}
          serverStatus={serverStatus}
          loadingType={loadingType}
          countWords={countWords}
          generate={generate}
          checkServerStatus={checkServerStatus}
        />

        <ResultsSection
          result={result}
          setResult={setResult}
          scoreData={scoreData}
          countWords={countWords}
          handleCopy={handleCopy}
          handleDownload={handleDownload}
          resumeRef={resumeRef}
          refine={refine}
          loadingType={loadingType}
          history={history}
          restoreVersion={restoreVersion}
        />

        <Footer />
      </div>

      {isDownloadModalOpen && (
        <DownloadModal
          resumeText={result}
          resumeElement={resumeRef.current}
          onClose={() => setIsDownloadModalOpen(false)}
          onSuccess={(message) => {
            showNotification(message, 'success');
            setIsDownloadModalOpen(false);
          }}
          onError={(error) => {
            showNotification(`Download failed: ${error}`, 'error');
            setIsDownloadModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default App;