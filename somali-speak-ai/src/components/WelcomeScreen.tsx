import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Upload, Play, Pause , CheckCircle, AlertCircle} from "lucide-react";
import { toast } from "sonner";
import { AudioData } from "@/pages/Index";




interface WelcomeScreenProps {
  onAudioReady: (data: AudioData) => void;
  
}

export const WelcomeScreen = ({ onAudioReady }: WelcomeScreenProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setRecordedAudio(url);
        setRecordedBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      toast( <span className="flex items-center gap-2 text-secondary font-semibold">
    <Mic className="w-5 h-5" />
    Recording started! Speak your Somali message (5-30 seconds)
  </span>);
      
      // Auto-stop after 15 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          stopRecording();
        }
      }, 30000);
      
    } catch (error) {
      toast.error(<span className="flex items-center gap-2 text-destructive font-semibold">
    <AlertCircle className="w-5 h-5" />
    Could not access microphone. Please check permissions.
  </span>);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success(   <span className="flex items-center gap-2 text-secondary font-semibold">
    <CheckCircle className="w-5 h-5" />
    Recording completed!
  </span>);
    }
  };

  const playRecording = () => {
    if (audioRef.current && recordedAudio) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        toast.success( <span className="flex items-center gap-2 text-success font-semibold">
    <Upload className="w-5 h-5" />
    Audio file loaded successfully!
  </span>);
        
        onAudioReady({ file });
      } else {
        toast.error("Please select a valid audio file (MP3, WAV, etc.)");
      }
    }
  };

  const proceedWithRecording = () => {
    if (recordedBlob) {
      onAudioReady({ recordedBlob });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-4xl w-full">
              {/* Logo */}
             <div >
       <img
        src="/favicon.ico"      // Replace with your logo path
        alt="Logo"
        className="w-[120px] h-[120px] mx-auto object-contain"
      />
    </div>
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-primary text-5xl md:text-6xl font-bold  mb-6">
            Somali Speech-to-Text
          </h1>
          <p className="text-xl text-primary/90 mb-4">
            Experience the future of Somali language technology
          </p>
          <div className="w-24 h-1 bg-secondary/30 mx-auto rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Record Option */}
          <Card className="p-8 bg-secondary/10 backdrop-blur-md border-white/20  shadow-lg animate-bounce-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mic className={`w-10 h-10 ${isRecording ? 'text-secondary animate-pulse' : 'text-secondary/90'}`} />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-primary">Record Your Voice</h3>
              <p className="text-primary/80 mb-6">
                Speak a short message in Somali (5-30 seconds)
              </p>
              
              <div className="space-y-4">
                {!recordedAudio ? (
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    variant={isRecording ? "destructive" : "secondary"}
                    size="lg"
                    className="w-full"
                    disabled={false}
                  >
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button
                        onClick={playRecording}
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-white/10 border-primary/30 text-primary/80   hover:bg-primary/20 hover:text-primary"
                      >
                        {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        {isPlaying ? "Pause" : "Play"}
                      </Button>
                      <Button
                        onClick={() => {
                          setRecordedAudio(null);
                          setRecordedBlob(null);
                          setIsPlaying(false);
                        }}
                        variant="outline"
                        size="sm"
                        className="bg-secondary/10 border-secondary/30 text-secondary hover:bg-secondary/20"
                      >
                        Re-record
                      </Button>
                    </div>
                    <Button
                      onClick={proceedWithRecording}
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      Process This Recording
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {recordedAudio && (
              <audio
                ref={audioRef}
                src={recordedAudio}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            )}
          </Card>

          {/* Upload Option */}
          <Card className="p-8 bg-secondary/10 backdrop-blur-md border-white/20  shadow-lg animate-bounce-in" style={{ animationDelay: "0.2s" }}>
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/20 rounded-full text-secondary flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl  font-semibold mb-4 text-primary">Upload Audio File</h3>
              <p className="text-primary/80 mb-6">
                Have a Somali audio file? Upload it here!
              </p>
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="lg"
                className="w-full bg-white/10 border-secondary/30 text-secondary  hover:bg-secondary/20 hover:text-seondary"
              >
                <Upload className="w-5 h-5 mr-2" />
                Choose Audio File
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <p className="text-xs text-primary/60 mt-4">
                Supports MP3, WAV, M4A and other audio formats
              </p>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <p className="text-primary/70 text-sm">
            Powered by Shaqodoon Organization for the Somali-speaking community
          </p>
        </div>
      </div>
    </div>
  );
};