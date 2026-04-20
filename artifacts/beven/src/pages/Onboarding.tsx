import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { useLocation } from "wouter";

export default function Onboarding() {
  const { user, saveUser } = useUser();
  const [, setLocation] = useLocation();

  const [step, setStep] = useState(0);
  const [name, setName] = useState(user.name || "");

  const nextStep = () => setStep(s => s + 1);

  const completeOnboarding = () => {
    saveUser({ name, isComplete: true, isGoodEnoughMode: true });
    setLocation("/");
  };

  const steps = [
    {
      title: "Welcome to Caltrac.",
      subtitle: "The Good Enough Tracker.",
      content: (
        <div className="space-y-4 text-left text-muted-foreground">
          <p>We believe calorie counting shouldn't be a source of anxiety.</p>
          <p>You won't find stressful red warnings or micro-management here.</p>
        </div>
      )
    },
    {
      title: "What's your name?",
      subtitle: "Let's keep it personal.",
      content: (
        <div className="mt-4">
          <Input
            autoFocus
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-lg py-6"
            onKeyDown={(e) => e.key === 'Enter' && name.trim() && nextStep()}
          />
        </div>
      )
    },
    {
      title: "How it works",
      subtitle: "Just type.",
      content: (
        <div className="space-y-4 text-left text-muted-foreground">
          <p><strong>1. Note it.</strong> Just type what you ate: "Had two slices of pizza."</p>
          <p><strong>2. Estimate.</strong> Our engine gives a "Good Enough" range.</p>
          <p><strong>3. Review.</strong> Focus on your 7-day average, not daily perfection.</p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col p-6 bg-background">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
                {steps[step].title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {steps[step].subtitle}
              </p>
            </div>

            {steps[step].content}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pt-8 pb-12 max-w-sm mx-auto w-full flex justify-between items-center">
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-primary" : "w-1.5 bg-muted"
                }`}
            />
          ))}
        </div>

        <Button
          size="lg"
          onClick={() => {
            if (step === 1 && !name.trim()) return;
            if (step === steps.length - 1) {
              completeOnboarding();
            } else {
              nextStep();
            }
          }}
          disabled={step === 1 && !name.trim()}
          className="rounded-full px-8"
        >
          {step === steps.length - 1 ? "Get Started" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
