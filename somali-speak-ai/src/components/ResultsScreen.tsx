import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  RefreshCw,
  Copy,
  Share2,
  Download,
  Trophy,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { ProcessingResults } from "@/pages/Index";
import { toast } from "sonner";

interface ResultsScreenProps {
  results: ProcessingResults;
  onReset: () => void;
}

export const ResultsScreen = ({ results, onReset }: ResultsScreenProps) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: "Somali Speech-to-Text Demo Results",
        text: `Original: ${results.originalText}\nTranslation: ${results.translation}`,
      });
    } else {
      copyToClipboard(
        `Original: ${results.originalText}\nTranslation: ${results.translation}`,
        "Results"
      );
    }
  };

  const getConfidenceColor = (score?: number): string => {
    if (!score) return "text-muted-foreground";
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-secondary-600";
    return "text-red-600";
  };

  const getConfidenceLabel = (score?: number): string => {
    if (!score) return "Unknown";
    if (score >= 8) return "High Confidence";
    if (score >= 6) return "Medium Confidence";
    return "Low Confidence";
  };

  const ConfidenceIndicator = ({
    score,
    label,
  }: {
    score?: number;
    label: string;
  }) => {
    if (score === undefined) return null;

    return (
      <div className="flex items-center space-x-3 mt-3">
        <div className="flex items-center space-x-2">
          <Star className={`w-4 h-4 ${getConfidenceColor(score)}`} />
          <span className="text-sm font-medium text-muted-foreground">
            {label}:
          </span>
        </div>
        <div className="flex items-center space-x-2 flex-1">
          <Progress value={score * 10} className="flex-1 max-w-20" />
         
        </div>
        <span className={`text-xs ${getConfidenceColor(score)} font-medium`}>
          {getConfidenceLabel(score)}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 bg-background relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 animate-confetti-fall`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: [
                  "#3B82F6",
                  "#EF4444",
                  "#10B981",
                  "#F59E0B",
                  "#8B5CF6",
                ][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-20">
        <div className="text-center mb-12 animate-bounce-in">
          {/* Trophy with pulse + bounce */}
          <div className="flex justify-center mb-6">
            <Trophy className="w-20 h-20 text-amber-400 drop-shadow-xl animate-bounce" />
          </div>

          {/* Success with wave effect */}
          <h1 className="text-6xl font-extrabold drop-shadow-[0_0_25px_rgba(255,215,0,0.8)]">
            <span className="inline-block animate-bounce bg-gradient-to-r from-secondary via-secondary to-secondary bg-clip-text text-transparent">
              S
            </span>
            <span className="inline-block animate-bounce delay-100 bg-gradient-to-r from-secondary via-secondary to-secondary bg-clip-text text-transparent">
              u
            </span>
            <span className="inline-block animate-bounce delay-200 bg-gradient-to-r from-secondary via-secondary to-secondary bg-clip-text text-transparent">
              c
            </span>
            <span className="inline-block animate-bounce delay-300 bg-gradient-to-r from-secondary via-secondary to-secondary bg-clip-text text-transparent">
              c
            </span>
            <span className="inline-block animate-bounce delay-400 bg-gradient-to-r from-secondary via-secondary to-secondary bg-clip-text text-transparent">
              e
            </span>
            <span className="inline-block animate-bounce delay-500 bg-gradient-to-r from-secondary via-secondary to-secondary bg-clip-text text-transparent">
              s
            </span>
            <span className="inline-block animate-bounce delay-600 bg-gradient-to-r from-secondary via-secondary to-secondary bg-clip-text text-transparent">
              s
            </span>
            <span className="inline-block animate-bounce delay-700 bg-gradient-to-r from-secondary via-secondary to-secondary bg-clip-text text-transparent">
              !
            </span>

            
          </h1>

          {/* Badge with wiggle */}
          

          {/* Subtitle fade-in */}
          <p className="mt-6 text-lg md:text-xl text-primary/95 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Your Somali message has been successfully processed! <br />
            Experience the magic of speech-to-text technology in action.
          </p>
        </div>

        {/* Results Display */}
  
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
  {/* Column 1: Original + Enhanced Somali */}
  <div className="space-y-8">
    {/* Original Somali Text */}
    <Card className="p-6 sm:p-8 bg-primary/25 backdrop-blur-md shadow-2xl animate-fade-in-up">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-1 sm:mb-2">
            Original Somali Text
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            Raw speech-to-text output
          </p>
        </div>
        <Button
          onClick={() =>
            copyToClipboard(results.originalText, "Original text")
          }
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
      <div className="p-4 sm:p-6 bg-white/95 rounded-lg border border-primary/20">
        <p className="text-base sm:text-lg leading-relaxed text-foreground font-medium">
          {results.originalText}
        </p>
        <ConfidenceIndicator
          score={results.transcriptConfidence}
          label="Transcription Quality"
        />
      </div>
    </Card>

    {/* Enhanced Somali Text */}
    <Card
      className="p-6 sm:p-8 bg-secondary/25 backdrop-blur-md animate-fade-in-up"
      style={{ animationDelay: "0.2s" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-1 sm:mb-2">
            Enhanced Somali Text
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            AI-cleaned and polished version
          </p>
        </div>
        <Button
          onClick={() =>
            copyToClipboard(results.cleanedText, "Enhanced text")
          }
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
      <div className="p-4 sm:p-6 bg-white/95 rounded-lg border border-accent/20">
        <p className="text-base sm:text-lg leading-relaxed text-foreground font-medium">
          {results.cleanedText}
        </p>
      </div>
    </Card>
  </div>

  {/* Column 2: English Translation + Metrics */}
  <div className="space-y-8 lg:sticky lg:top-24 self-start">
    {/* English Translation */}
    <Card
      className="p-6 sm:p-8 bg-success/25 backdrop-blur-md animate-fade-in-up"
      style={{ animationDelay: "0.4s" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-1 sm:mb-2">
            English Translation
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            Automatic translation result
          </p>
        </div>
        <Button
          onClick={() => copyToClipboard(results.translation, "Translation")}
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
      <div className="p-4 sm:p-6 bg-white/95 rounded-lg border border-success/20">
        <p className="text-base sm:text-lg leading-relaxed text-foreground font-medium">
          {results.translation}
        </p>
        <ConfidenceIndicator
          score={results.translationConfidence}
          label="Translation Quality"
        />
      </div>
    </Card>

    {/* API Processing Stats */}
    {(results.transcriptConfidence || results.translationConfidence) && (
      <Card
        className="p-6 bg-white/95 backdrop-blur-md animate-fade-in-up mb-8"
        style={{ animationDelay: "0.5s" }}
      >
        <div className="text-center">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Processing Quality Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.transcriptConfidence && (
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                  {results.transcriptConfidence}/10
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Speech Recognition Confidence
                </p>
                <div
                  className={`text-xs mt-1 font-medium ${getConfidenceColor(
                    results.transcriptConfidence
                  )}`}
                >
                  {getConfidenceLabel(results.transcriptConfidence)}
                </div>
              </div>
            )}
            {results.translationConfidence && (
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-success mb-2">
                  {results.translationConfidence}/10
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Translation Confidence
                </p>
                <div
                  className={`text-xs mt-1 font-medium ${getConfidenceColor(
                    results.translationConfidence
                  )}`}
                >
                  {getConfidenceLabel(results.translationConfidence)}
                </div>
              </div>
            )}
          </div>
          {results.apiId && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Processing ID:{" "}
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  {results.apiId}
                </code>
              </p>
            </div>
          )}
        </div>
      </Card>
    )}
  </div>
</div>


        {/* Call to Action */}
         <Card className="p-8 border-0  bg-background text-primary text-center animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <h3 className="text-2xl font-semibold mb-4">
            Imagine the Possibilities
          </h3>
          <p className="text-lg  mb-8 max-w-3xl mx-auto">
            This technology could power educational apps, communication tools, accessibility features, 
            and cultural preservation initiatives worldwide. The future of Somali language technology is here!
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={onReset}
              size="lg"
              className="bg-secondary/70 hover:bg-secondary/90 text-white"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Another Recording
            </Button>
            
            <Button
              onClick={shareResults}
              size="lg"
              variant="outline"
              className="bg-primary/70 hover:bg-primary/90 text-white border-white/30"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Results
            </Button>
          </div>
        </Card> 

        {/* Footer */}
        <div
          className="text-center mt-12 animate-fade-in-up"
          style={{ animationDelay: "0.8s" }}
        >
          <p className="text-primary/70">
            Powered by Shaqodoon Organization • Built for the Somali-speaking
            community
          </p>
        </div>
      </div>
    </div>
  );
};
