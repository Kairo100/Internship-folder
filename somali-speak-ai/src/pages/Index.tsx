import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ProcessingJourney } from "@/components/ProcessingJourney";
import { ResultsScreen } from "@/components/ResultsScreen";

export type DemoStage = "welcome" | "processing" | "results";

export interface AudioData {
  file?: File;
  url?: string;
  recordedBlob?: Blob;
}

export interface ProcessingResults {
  originalText: string;
  cleanedText: string;
  translation: string;
  transcriptConfidence?: number;
  translationConfidence?: number;
  apiId?: string;
  s3Url?: string;
}

const Index = () => {
  const [currentStage, setCurrentStage] = useState<DemoStage>("welcome");
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [results, setResults] = useState<ProcessingResults | null>(null);

  const handleAudioReady = (data: AudioData) => {
    setAudioData(data);
    setCurrentStage("processing");
  };

  const handleProcessingComplete = (processedResults: ProcessingResults) => {
    setResults(processedResults);
    setCurrentStage("results");
  };

  const handleReset = () => {
    setCurrentStage("welcome");
    setAudioData(null);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {currentStage === "welcome" && (
        <WelcomeScreen onAudioReady={handleAudioReady} />
      )}
      
      {currentStage === "processing" && audioData && (
        <ProcessingJourney 
          audioData={audioData} 
          onProcessingComplete={handleProcessingComplete}
        />
      )}
      
      {currentStage === "results" && results && (
        <ResultsScreen 
          results={results} 
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default Index;