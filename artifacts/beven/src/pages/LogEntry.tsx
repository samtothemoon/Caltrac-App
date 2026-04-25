import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLogs } from "@/hooks/useLogs";
import { useUser } from "@/hooks/useUser";
import { parseMealText } from "@/lib/ai-parser";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Check, X, Info, Zap, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

// Web Speech API Types
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export default function LogEntry() {
  const { addLog } = useLogs();
  const { user } = useUser();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [text, setText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setText(prev => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({ title: "Voice Error", description: "Could not access microphone.", variant: "destructive" });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({ title: "Not Supported", description: "Voice input is not supported in this browser.", variant: "destructive" });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleParse = async () => {
    if (!text.trim()) return;
    setIsParsing(true);
    setResult(null);

    try {
      const parsed = await parseMealText(text);
      setResult({ ...parsed, text });
    } catch (err: any) {
      console.error("Parse Error:", err);
      toast({ 
        title: "Analysis Failed", 
        description: err.message || "Please check your internet connection or API key.", 
        variant: "destructive" 
      });
    } finally {
      setIsParsing(false);
    }

  };


  const handleSave = () => {
    if (!result) return;
    addLog({
      date: new Date().toISOString(),
      text: result.text,
      estimatedCalories: result.estimatedCalories,
      confidence: result.confidence,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
    });
    
    toast({
      title: "Logged successfully",
      description: user.isGoodEnoughMode ? "Looks good!" : `Saved ${result.estimatedCalories} kcal.`
    });
    
    // Reset state and go home
    setText("");
    setResult(null);
    setLocation("/");
  };

  const formatCalories = (cals: number) => {
    if (!user.isGoodEnoughMode) return `${cals} kcal`;
    const lower = Math.round(cals * 0.95 / 10) * 10;
    const upper = Math.round(cals * 1.05 / 10) * 10;
    return `${lower} - ${upper}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 pt-12 flex flex-col h-full bg-background pb-24"
    >
      <div className="mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
          <Sparkles className="w-3 h-3" />
          AI Analysis
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">What did you eat?</h1>
        <p className="text-muted-foreground text-sm font-medium leading-relaxed">Type naturally, like you're texting a friend. Our AI handles the rest.</p>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        {!result ? (
          <div className="flex-1 flex flex-col gap-6">
            <div className="relative flex-1 group">
              <Textarea 
                className="resize-none h-full text-xl p-8 bg-card rounded-[2rem] border-2 border-muted focus-visible:ring-4 focus-visible:ring-primary/10 shadow-sm transition-all font-medium placeholder:text-muted-foreground/40 leading-relaxed pr-16"
                placeholder="e.g., Had 2 eggs and coffee for breakfast..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isParsing}
              />
              <button
                onClick={toggleListening}
                className={cn(
                  "absolute top-6 right-6 p-3 rounded-2xl transition-all active:scale-95 shadow-lg",
                  isListening 
                    ? "bg-red-500 text-white animate-pulse shadow-red-500/20" 
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <div className="absolute bottom-6 right-6 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest pointer-events-none group-focus-within:opacity-0 transition-opacity">
                {isListening ? "Listening..." : "AI Powered Input"}
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="w-full h-16 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
              onClick={handleParse}
              disabled={isParsing || !text.trim() || isListening}
            >
              {isParsing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Analyzing Meal...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-3 fill-current" />
                  Estimate Calories
                </>
              )}
            </Button>
          </div>
        ) : (

          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border-2 rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center text-center space-y-8 relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-2 bg-primary/20" />
              
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary border border-primary/10">
                <Check className="w-10 h-10" strokeWidth={3} />
              </div>
              
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Estimated Intake</div>
                <div className="text-6xl font-bold tracking-tighter text-foreground flex items-baseline gap-2 justify-center">
                  {formatCalories(result.estimatedCalories)}
                  <span className="text-sm font-bold opacity-30 uppercase tracking-widest">kcal</span>
                </div>
                {user.isGoodEnoughMode && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                    Good Enough
                  </div>
                )}
              </div>

              <div className="w-full grid grid-cols-3 gap-3">
                {[
                  { label: "P", value: result.protein, color: "bg-red-500/10 text-red-600" },
                  { label: "C", value: result.carbs, color: "bg-blue-500/10 text-blue-600" },
                  { label: "F", value: result.fat, color: "bg-yellow-500/10 text-yellow-600" }
                ].map(macro => (
                  <div key={macro.label} className={cn("p-3 rounded-2xl flex flex-col items-center gap-1 border border-transparent", macro.color)}>
                    <span className="text-[10px] font-bold opacity-60">{macro.label}</span>
                    <span className="text-sm font-bold">{macro.value}g</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-xl text-[10px] font-bold text-muted-foreground uppercase tracking-wider border">
                <Info className="w-3.5 h-3.5" />
                Confidence: {result.confidence}%
              </div>

              <div className="w-full gap-4 flex flex-col pt-4">
                <Button size="lg" className="h-16 rounded-2xl w-full text-lg font-bold shadow-xl shadow-primary/20 active:scale-95 transition-all" onClick={handleSave}>
                  Confirm & Log
                </Button>
                <Button variant="ghost" className="h-12 font-bold text-muted-foreground hover:text-foreground" onClick={() => setResult(null)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
