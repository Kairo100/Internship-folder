import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Volume2, Sparkles, Languages, CheckCircle, AlertTriangle, Zap } from "lucide-react";
import { AudioData, ProcessingResults } from "@/pages/Index";
import { ProgressBar } from "@/components/ProgressBar";
import { toast } from "sonner";
import { transcriptionService, TranscriptionError, NetworkError, FileFormatError, generateUUID } from "@/services/transcriptionService";

interface ProcessingJourneyProps {
  audioData: AudioData;
  onProcessingComplete: (results: ProcessingResults) => void;
}

export const ProcessingJourney = ({ audioData, onProcessingComplete }: ProcessingJourneyProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [cleanedText, setCleanedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      id: "processing",
      title: "Processing Audio",
      description: "Analyzing your voice patterns...",
      icon: Volume2,
      color: "text-primary",
      duration: 3000,
      characters: ["🎧", "🔊", "📻"],
      action: "listening and capturing"
    },
    {
      id: "transcription",
      title: "Speech Recognition",
      description: "Converting speech to Somali text...",
      icon: Sparkles,
      color: "text-secondary",
      duration: 3000,
      characters: ["✍️", "📝", "🔤"],
      action: "writing and transcribing"
    },
    {
      id: "cleaning",
      title: "Text Enhancement",
      description: "Polishing and refining the text...",
      icon: Sparkles,
      color: "text-accent",
      duration: 3000,
      characters: ["🧹", "✨", "🔧"],
      action: "polishing and cleaning"
    },
    {
      id: "translation",
      title: "Translation",
      description: "Translating to English...",
      icon: Languages,
      color: "text-success",
      duration: 3000,
      characters: ["🌍", "🔄", "📖"],
      action: "translating and converting"
    },
    {
      id: "complete",
      title: "Complete!",
      description: "Your message is ready!",
      icon: CheckCircle,
      color: "text-success",
      duration: 3000,
      characters: ["🎉", "🏆", "✅"],
      action: "celebrating success"
    },
  ];

  // Real API processing
  useEffect(() => {
    const processAudio = async () => {
      try {
        setError(null);
        setIsRetrying(false);
          // 🔹 Show preloader first
      setCurrentStep(-1);
      await new Promise(resolve => setTimeout(resolve, 2000)); 
  // Step 1: Processing Audio
  setCurrentStep(0);
  setProgress(Math.round((0 / steps.length) * 100));
  await new Promise(resolve => setTimeout(resolve, 1500)); // Brief visual delay
        
  // Step 2: Speech Recognition - Make actual API call
  setCurrentStep(1);
  setProgress(Math.round((1 / steps.length) * 100));
        
        // Prepare audio for API call
        const audioToProcess = audioData.file || audioData.recordedBlob;
        if (!audioToProcess) {
          throw new Error("No audio data available for processing");
        }
        
        // Generate metadata for the request
        const metadata = {
          user_id: generateUUID(),
          session_id: generateUUID()
        };
        
        // Make the actual API call
        const response = await transcriptionService.processAudio({
          audio: audioToProcess,
          metadata
        });
        
        // Animate transcription display
        if (response.transcript) {
          const words = response.transcript.split(" ");
          for (let j = 0; j <= words.length; j++) {
            setDisplayText(words.slice(0, j).join(" "));
            // update sub-progress within transcription step
            const sub = words.length > 0 ? j / words.length : 1;
            setProgress(Math.round(((1 + sub) / steps.length) * 100));
            await new Promise(resolve => setTimeout(resolve, 80));
          }
        }
        
        // Step 3: Text Enhancement (show cleaned version)
  setCurrentStep(2);
  // small visual progress bump for cleaning
  setProgress(Math.round((2 / steps.length) * 100));
  await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For this demo, the "cleaned" text is the same as the original transcript
        // In a real implementation, this might involve additional processing
        setCleanedText(response.transcript);
        
        // Step 4: Translation
  setCurrentStep(3);
  setProgress(Math.round((3 / steps.length) * 100));
  await new Promise(resolve => setTimeout(resolve, 800));
        
        // Animate translation display
        if (response.translation) {
          const words = response.translation.split(" ");
          for (let j = 0; j <= words.length; j++) {
            setTranslatedText(words.slice(0, j).join(" "));
            // update sub-progress within translation step
            const sub = words.length > 0 ? j / words.length : 1;
            setProgress(Math.round(((3 + sub) / steps.length) * 100));
            await new Promise(resolve => setTimeout(resolve, 80));
          }
        }
        
        // Step 5: Complete
  setCurrentStep(4);
  // final completion
  setProgress(100);
  await new Promise(resolve => setTimeout(resolve, 1000));
        
  // ✅ Add extra 5 second wait after completion
await new Promise(resolve => setTimeout(resolve, 5000));
        // Complete processing with enhanced results
        const results: ProcessingResults = {
          originalText: response.transcript,
          cleanedText: response.transcript, // Using transcript as cleaned text
          translation: response.translation,
          transcriptConfidence: response.transcript_confidence,
          translationConfidence: response.translation_confidence,
          apiId: response.id,
          s3Url: response.s3_url
        };
        
        toast.success("Processing complete! 🎉");
        onProcessingComplete(results);
        
      } catch (error) {
        console.error("Processing error:", error);
        setCurrentStep(0); // Reset to first step on error
        
        let errorMessage = "An unexpected error occurred while processing your audio.";
        
        if (error instanceof FileFormatError) {
          errorMessage = error.message;
        } else if (error instanceof NetworkError) {
          errorMessage = "Network connection failed. Please check your internet connection and try again.";
        } else if (error instanceof TranscriptionError) {
          errorMessage = error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        toast.error("Processing failed", {
          description: errorMessage
        });
      }
    };

    processAudio();
  }, [audioData, isRetrying, onProcessingComplete, steps.length]);
  
  const handleRetry = () => {
    setIsRetrying(true);
    setError(null);
    setDisplayText("");
    setCleanedText("");
    setTranslatedText("");
    setCurrentStep(0);
  };

  const currentStepData = steps[currentStep];

 return (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
    <div className="max-w-6xl w-full">
      {/* Header */}
      <div className="text-center  mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Processing Your Message
        </h1>
        <ProgressBar progress={progress} />
      </div>


     {currentStep === -1 ? (
          // Pre-loading weird intro
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <Zap className="w-12 h-12 text-yellow-500 animate-spin-slow" />
            <p className="text-muted-foreground animate-pulse">
              Warming up the wires
            </p>
            <div className="flex space-x-2">
              <span className="w-3 h-3 bg-primary rounded-full animate-bounce"></span>
              <span className="w-3 h-3 bg-secondary rounded-full animate-bounce delay-150"></span>
              <span className="w-3 h-3 bg-accent rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        ) : (

            <>
      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column: Current Step + Animated Characters */}
        <div className="space-y-8">
          {/* Current Step */}
          <Card className="p-8 bg-card border-border">
            <div className="text-center">
              <div
                className={`w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-glow`}
              >
                <currentStepData.icon
                  className={`w-12 h-12 ${currentStepData.color}`}
                />
              </div>

              <h2 className="text-3xl font-semibold mb-3 text-foreground">
                {currentStepData.title}
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                {currentStepData.description}
              </p>

              {/* Animated Processing Indicator */}
              <div className="flex items-center justify-center space-x-2 mb-8">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm text-muted-foreground">Processing...</span>
              </div>
            </div>
          </Card>

          {/* Animated Characters Working */}
          <Card className="p-8 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-primary/20">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                The team is {currentStepData.action}...
              </p>

              <div className="flex items-center justify-center space-x-8 mb-6">
                {currentStepData.characters.map((character, index) => (
                  <div
                    key={index}
                    className={`text-4xl transform transition-all duration-1000 ${
                      index === 0
                        ? "animate-bounce scale-110"
                        : index === 1
                        ? "animate-pulse scale-105"
                        : "animate-wiggle scale-100"
                    }`}
                    style={{
                      animationDelay: `${index * 0.5}s`,
                      animationDuration: "2s",
                    }}
                  >
                    {character}
                  </div>
                ))}
              </div>

              <div className="relative h-16 bg-muted/30 rounded-lg flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shimmer"></div>
                <div className="relative z-10 flex items-center space-x-4">
                  <span className="text-2xl animate-bounce">📄</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                    <div className="w-2 h-2 bg-secondary rounded-full animate-ping" />
                    <div className="w-2 h-2 bg-accent rounded-full animate-ping" />
                  </div>
                  <span className="text-2xl animate-bounce" style={{ animationDelay: "1s" }}>✨</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column: Text + Error */}
        <div className="space-y-6">
          {/* Transcription Display */}
          {displayText && (
            <Card className="p-6 bg-primary/5 border-primary/20 animate-bounce-in">
              <h3 className="font-semibold text-primary mb-3 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Somali Transcription
              </h3>
              <div className="min-h-[60px] p-4 bg-background rounded-lg border border-border">
                <p className="text-lg font-medium text-foreground">
                  {displayText}
                  {currentStep === 1 && <span className="animate-pulse">|</span>}
                </p>
              </div>
            </Card>
          )}

          {/* Cleaned Text Display */}
          {cleanedText && (
            <Card className="p-6 bg-accent/5 border-accent/20 animate-bounce-in">
              <h3 className="font-semibold text-accent mb-3 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Enhanced Text
              </h3>
              <div className="min-h-[60px] p-4 bg-background rounded-lg border border-border">
                <p className="text-lg font-medium text-foreground">{cleanedText}</p>
              </div>
            </Card>
          )}

          {/* Translation Display */}
          {translatedText && (
            <Card className="p-6 bg-success/5 border-success/20 animate-bounce-in">
              <h3 className="font-semibold text-success mb-3 flex items-center">
                <Languages className="w-5 h-5 mr-2" />
                English Translation
              </h3>
              <div className="min-h-[60px] p-4 bg-background rounded-lg border border-border">
                <p className="text-lg font-medium text-foreground">
                  {translatedText}
                  {currentStep === 3 && <span className="animate-pulse">|</span>}
                </p>
              </div>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <Card className="p-6 bg-destructive/5 border-destructive/20 animate-bounce-in mb-8">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="w-6 h-6 text-destructive shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-destructive mb-2">Processing Failed</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    size="sm"
                    className="border-destructive/20 hover:bg-destructive/5"
                  >
                    <Loader2 className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="flex justify-center mt-12 space-x-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index <= currentStep ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
       </>
        )}
    </div>


  </div>
 
);

};