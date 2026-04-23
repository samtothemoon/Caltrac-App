import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValue, useTransform } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { useLocation } from "wouter";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Check, ChevronDown } from "lucide-react";

function ScrollPicker({ min, max, value, onChange, unit }: { min: number, max: number, value: number, onChange: (val: number) => void, unit: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  useEffect(() => {
    if (containerRef.current) {
      const index = value - min;
      const itemWidth = 80;
      containerRef.current.scrollLeft = index * itemWidth;
    }
  }, []);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      const itemWidth = 80;
      const index = Math.round(scrollLeft / itemWidth);
      const newValue = min + index;
      if (newValue !== value && newValue >= min && newValue <= max) {
        onChange(newValue);
      }
    }
  };

  return (
    <div className="relative w-full py-8">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-0.5 h-full bg-primary/30 z-0" />
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory px-[calc(50%-40px)] gap-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <div 
            key={item}
            className="flex-none w-[80px] h-20 flex flex-col items-center justify-center snap-center"
          >
            <span className={`text-2xl font-bold transition-all duration-300 ${value === item ? 'text-primary scale-125' : 'text-muted-foreground/30 scale-100'}`}>
              {item}
            </span>
            <div className={`w-0.5 h-2 mt-2 rounded-full transition-all duration-300 ${value === item ? 'bg-primary' : 'bg-muted/20'}`} />
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <span className="text-sm font-semibold text-primary uppercase tracking-wide">{unit}</span>
      </div>
    </div>
  );
}

export default function Onboarding() {
  const { user, saveUser } = useUser();
  const [, setLocation] = useLocation();

  const [step, setStep] = useState(0);
  const [name, setName] = useState(user.name || "");
  const [sex, setSex] = useState(user.sex || "");
  const [dob, setDob] = useState(user.dob || "");
  const [height, setHeight] = useState<{ value: number; unit: 'cm' | 'ft' }>(user.height || { value: 170, unit: 'cm' });
  const [weight, setWeight] = useState<{ value: number; unit: 'kg' | 'lbs' }>(user.weight || { value: 70, unit: 'kg' });
  const [activityLevel, setActivityLevel] = useState(user.activityLevel || "");
  const [goal, setGoal] = useState(user.goal || "");
  const [plan, setPlan] = useState(user.plan || "");

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => Math.max(0, s - 1));

  const completeOnboarding = () => {
    saveUser({ 
      name, 
      sex, 
      dob, 
      height, 
      weight, 
      activityLevel, 
      goal, 
      plan,
      isComplete: true, 
      isGoodEnoughMode: true 
    });
    setLocation("/");
  };

  const steps = [
    {
      title: "Welcome.",
      subtitle: "The Good Enough Tracker.",
      content: (
        <div className="space-y-8 text-left">
          <div className="space-y-6 text-muted-foreground font-medium leading-relaxed">
            <p>We believe calorie counting shouldn't be a source of anxiety. Our AI-driven approach focuses on your long-term trends.</p>
            <p className="px-4 py-3 bg-primary/5 border border-primary/10 rounded-xl text-primary text-sm font-semibold">
              No stressful dashboards, no micro-management. Just what works.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "What's your name?",
      subtitle: "Let's keep it personal.",
      content: (
        <div className="mt-8 space-y-4">
          <Input
            autoFocus
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-lg h-12 rounded-xl border-none bg-muted px-4 focus:bg-muted/80 transition-all font-semibold tracking-tight"
            onKeyDown={(e) => e.key === 'Enter' && name.trim() && nextStep()}
          />
          <p className="text-xs text-muted-foreground font-medium px-4">This helps us personalize your AI nutrition experience.</p>
        </div>
      )
    },
    {
      title: "What is your sex?",
      subtitle: "To calculate your metabolic rate.",
      content: (
        <div className="mt-8">
          <RadioGroup value={sex} onValueChange={setSex} className="grid grid-cols-1 gap-3">
            {['Male', 'Female', 'Other'].map((option) => (
              <Label
                key={option}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  sex === option ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <span className="text-lg font-semibold">{option}</span>
                <RadioGroupItem value={option} className="sr-only" />
                {sex === option && <Check className="w-5 h-5 text-primary" />}
              </Label>
            ))}
          </RadioGroup>
        </div>
      )
    },
    {
      title: "Date of Birth",
      subtitle: "Your age helps us refine your goals.",
      content: (
        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold uppercase tracking-tight text-muted-foreground ml-1">Day</Label>
            <Input
              type="number"
              placeholder="DD"
              min={1}
              max={31}
              value={dob.split('-')[2] || ''}
              onChange={(e) => {
                const parts = dob.split('-');
                const day = e.target.value.padStart(2, '0');
                setDob(`${parts[0] || '1990'}-${parts[1] || '01'}-${day}`);
              }}
              className="text-center text-xl h-12 rounded-xl border-none bg-muted focus:bg-muted/80 transition-all font-semibold tracking-tight"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold uppercase tracking-tight text-muted-foreground ml-1">Month</Label>
            <Input
              type="number"
              placeholder="MM"
              min={1}
              max={12}
              value={dob.split('-')[1] || ''}
              onChange={(e) => {
                const parts = dob.split('-');
                const month = e.target.value.padStart(2, '0');
                setDob(`${parts[0] || '1990'}-${month}-${parts[2] || '01'}`);
              }}
              className="text-center text-xl h-12 rounded-xl border-none bg-muted focus:bg-muted/80 transition-all font-semibold tracking-tight"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold uppercase tracking-tight text-muted-foreground ml-1">Year</Label>
            <Input
              type="number"
              placeholder="YYYY"
              min={1900}
              max={new Date().getFullYear()}
              value={dob.split('-')[0] || ''}
              onChange={(e) => {
                const parts = dob.split('-');
                const year = e.target.value;
                setDob(`${year}-${parts[1] || '01'}-${parts[2] || '01'}`);
              }}
              className="text-center text-xl h-12 rounded-xl border-none bg-muted focus:bg-muted/80 transition-all font-semibold tracking-tight"
            />
          </div>
        </div>
      )
    },
    {
      title: "What is your height?",
      subtitle: "Enter your height below.",
      content: (
        <div className="mt-8 space-y-8">
          <Tabs 
            value={height.unit} 
            onValueChange={(v) => setHeight(h => ({ ...h, unit: v as 'cm' | 'ft' }))}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted rounded-xl">
              <TabsTrigger value="cm" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all font-semibold">cm</TabsTrigger>
              <TabsTrigger value="ft" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all font-semibold">ft/in</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <ScrollPicker 
            min={height.unit === 'cm' ? 100 : 3} 
            max={height.unit === 'cm' ? 250 : 8} 
            value={height.value} 
            onChange={(v) => setHeight(h => ({ ...h, value: v }))}
            unit={height.unit}
          />
        </div>
      )
    },
    {
      title: "What is your weight?",
      subtitle: "Enter your current weight.",
      content: (
        <div className="mt-8 space-y-8">
          <Tabs 
            value={weight.unit} 
            onValueChange={(v) => setWeight(w => ({ ...w, unit: v as 'kg' | 'lbs' }))}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted rounded-xl">
              <TabsTrigger value="kg" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all font-semibold">kg</TabsTrigger>
              <TabsTrigger value="lbs" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all font-semibold">lbs</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <ScrollPicker 
            min={weight.unit === 'kg' ? 30 : 60} 
            max={weight.unit === 'kg' ? 200 : 450} 
            value={weight.value} 
            onChange={(v) => setWeight(w => ({ ...w, value: v }))}
            unit={weight.unit}
          />
        </div>
      )
    },
    {
      title: "Activity Level",
      subtitle: "How active are you daily?",
      content: (
        <div className="mt-8">
          <RadioGroup value={activityLevel} onValueChange={setActivityLevel} className="grid grid-cols-1 gap-3">
            {[
              { label: 'Sedentary', desc: 'Little to no exercise' },
              { label: 'Lightly Active', desc: '1-3 days/week' },
              { label: 'Moderately Active', desc: '3-5 days/week' },
              { label: 'Very Active', desc: '6-7 days/week' }
            ].map((option) => (
              <Label
                key={option.label}
                className={`flex flex-col p-4 rounded-xl border transition-all ${
                  activityLevel === option.label ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <span className="text-lg font-semibold">{option.label}</span>
                <span className="text-sm text-muted-foreground">{option.desc}</span>
                <RadioGroupItem value={option.label} className="sr-only" />
              </Label>
            ))}
          </RadioGroup>
        </div>
      )
    },
    {
      title: "What is your goal?",
      subtitle: "Select your primary objective.",
      content: (
        <div className="mt-8">
          <RadioGroup value={goal} onValueChange={setGoal} className="grid grid-cols-1 gap-3">
            {['Lose Weight', 'Maintain Weight', 'Gain Weight'].map((option) => (
              <Label
                key={option}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  goal === option ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <span className="text-lg font-semibold">{option}</span>
                <RadioGroupItem value={option} className="sr-only" />
                {goal === option && <Check className="w-5 h-5 text-primary" />}
              </Label>
            ))}
          </RadioGroup>
        </div>
      )
    },
    {
      title: "Why us?",
      subtitle: "The last tracker you'll need.",
      content: (
        <div className="space-y-4 mt-8">
          {[
            { title: "AI Precision", desc: "No more searching for specific brands. Just type it.", icon: "✨" },
            { title: "Trend Focused", desc: "We look at your week, not just your day.", icon: "📈" },
            { title: "No Stress", desc: "No red bars. No judgment. Just progress.", icon: "🧘" }
          ].map((item) => (
            <div key={item.title} className="flex gap-4 items-start p-4 bg-card rounded-xl border shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-xl shrink-0 border">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground tracking-tight">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-snug font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Choose your plan",
      subtitle: "Invest in your health.",
      content: (
        <div className="mt-8 space-y-4">
          <RadioGroup value={plan} onValueChange={setPlan} className="grid grid-cols-1 gap-3">
            {[
              { id: 'monthly', title: "1 Month", price: "$10.99", period: "month" },
              { id: 'annual', title: "Annual", price: "$71.99", period: "year", popular: true, saving: "45% OFF" },
              { id: 'six_month', title: "6 Months", price: "$41.99", period: "6 months" }
            ].map((p) => (
              <Label
                key={p.id}
                className={`relative flex flex-col p-5 rounded-xl border transition-all ${
                  plan === p.id ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                    Most Popular
                  </div>
                )}
                <div className="flex justify-between items-center mb-1">
                  <span className="text-lg font-semibold">{p.title}</span>
                  <span className="text-xl font-bold">{p.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground font-medium">Billed per {p.period}</span>
                  {p.saving && <span className="text-xs font-semibold text-primary">{p.saving}</span>}
                </div>
                <RadioGroupItem value={p.id} className="sr-only" />
              </Label>
            ))}
          </RadioGroup>
          <p className="text-[10px] text-center text-muted-foreground mt-4 px-4 leading-tight font-medium">
            Subscription automatically renews. Cancel anytime in your app store settings.
          </p>
        </div>
      )
    }
  ];

  const canContinue = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return sex !== "";
    if (step === 3) return dob !== "";
    if (step === 6) return activityLevel !== "";
    if (step === 7) return goal !== "";
    if (step === 9) return plan !== "";
    return true;
  };

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
            className="flex-1 flex flex-col pt-12"
          >
            <div className="space-y-2 mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                {steps[step].title}
              </h1>
              <p className="text-muted-foreground text-lg font-medium">
                {steps[step].subtitle}
              </p>
            </div>

            <div className="flex-1">
              {steps[step].content}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pt-8 pb-12 max-w-sm mx-auto w-full flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === step ? "w-6 bg-primary shadow-[0_0_8px_rgba(var(--primary),0.3)]" : "w-1.5 bg-muted/30"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {step > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={prevStep}
                className="text-muted-foreground font-bold"
              >
                Back
              </Button>
            )}
            <Button
              size="default"
              onClick={() => {
                if (step === steps.length - 1) {
                  completeOnboarding();
                } else {
                  nextStep();
                }
              }}
              disabled={!canContinue()}
              className="rounded-full px-8 py-4 h-auto text-sm font-black tracking-tighter shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
            >
              {step === steps.length - 1 ? "Start Now" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
