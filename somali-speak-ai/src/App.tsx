import { Toaster } from "sonner"; // Sonner only
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ProcessingJourney } from "@/components/ProcessingJourney";
import { ResultsScreen } from "@/components/ResultsScreen";

import type { AudioData } from "./pages/Index";

// Mock data for independent page routes
const mockAudio: AudioData = {};
const mockResults = {
  originalText: "Tusaale qoraal Soomaali ah",
  cleanedText: "Tusaale qoraal nadiif ah",
  translation: "Sample Somali text",
  transcriptConfidence: 8,
  translationConfidence: 7,
  apiId: "mock-123",
  s3Url: "",
};

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster richColors position="top-right" /> {/* Sonner */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/welcome" element={<WelcomeScreen onAudioReady={() => {}} />} />
          <Route path="/processing" element={<ProcessingJourney audioData={mockAudio} onProcessingComplete={() => {}} />} />
          <Route path="/results" element={<ResultsScreen results={mockResults} onReset={() => {}} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
