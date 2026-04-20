import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLogs } from "@/hooks/useLogs";
import { useUser } from "@/hooks/useUser";
import { parseMealText } from "@/lib/ai-parser";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LogEntry() {
  const { addLog } = useLogs();
  const { user } = useUser();
  const { toast } = useToast();

  const [text, setText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleParse = async () => {
    if (!text.trim()) return;
    setIsParsing(true);
    setResult(null);

    try {
      const parsed = await parseMealText(text);
      setResult({ ...parsed, text });
    } catch (err) {
      toast({ title: "Error parsing text", description: "Please try again.", variant: "destructive" });
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
    
    // Reset state
    setText("");
    setResult(null);
  };

  const formatCalories = (cals: number) => {
    if (!user.isGoodEnoughMode) return `${cals} kcal`;
    const lower = Math.round(cals * 0.95 / 10) * 10;
    const upper = Math.round(cals * 1.05 / 10) * 10;
    return `${lower} - ${upper} kcal`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 pt-12 flex flex-col h-full bg-background"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight mb-2">What did you eat?</h1>
        <p className="text-muted-foreground text-sm">Just type it out naturally. No scanning, no searching.</p>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {!result ? (
          <>
            <Textarea 
              className="resize-none h-40 text-lg p-4 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary shadow-inner transition-all"
              placeholder="e.g., Had 2 eggs and coffee for breakfast..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isParsing}
            />
            
            <Button 
              size="lg" 
              className="w-full text-md h-14 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              onClick={handleParse}
              disabled={isParsing || !text.trim()}
            >
              {isParsing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Estimating...
                </>
              ) : (
                "Estimate Calories"
              )}
            </Button>
          </>
        ) : (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col items-center text-center space-y-4"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div className="space-y-1">
                <div className="text-4xl font-light tracking-tight text-foreground">
                  {formatCalories(result.estimatedCalories)}
                </div>
                {user.isGoodEnoughMode && (
                  <div className="text-sm text-emerald-600 font-medium">Looks good! Close enough.</div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-4 px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                <AlertCircle className="w-3.5 h-3.5" />
                Confidence: {result.confidence}
              </div>

              <div className="w-full gap-3 flex flex-col mt-6">
                <Button size="lg" className="h-14 rounded-xl w-full" onClick={handleSave}>
                  Log It
                </Button>
                <Button variant="ghost" className="h-14" onClick={() => setResult(null)}>
                  Try Again
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
