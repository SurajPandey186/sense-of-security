import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Lock, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import WorkshopIntro from "./WorkshopIntro";
import HearingSection from "./HearingSection";
import VisionSection from "./VisionSection";
import MotorSection from "./MotorSection";
import CognitiveSection from "./CognitiveSection";

const AccessibilityWorkshop = () => {
  const [currentSection, setCurrentSection] = useState<'intro' | 'hearing' | 'vision' | 'motor' | 'cognitive' | 'complete'>('intro');
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [passwords, setPasswords] = useState<Record<string, string>>({});

  const sections = [
    { id: 'hearing', title: '🎧 Hearing Challenge', password: 'ACCESS' },
    { id: 'vision', title: '👁️ Vision Challenge', password: 'VISION' },
    { id: 'motor', title: '🖱️ Motor Challenge', password: 'KEYBOARD' },
    { id: 'cognitive', title: '🧠 Cognitive Challenge', password: 'FOCUS' }
  ];

  const handlePasswordSubmit = (section: string, password: string) => {
    const newCompleted = [...completedSections, section];
    const newPasswords = { ...passwords, [section]: password };
    
    setCompletedSections(newCompleted);
    setPasswords(newPasswords);

    // Move to next section
    const currentIndex = sections.findIndex(s => s.id === section);
    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      setCurrentSection(nextSection.id as any);
    } else {
      setCurrentSection('complete');
    }
  };

  const isUnlocked = (sectionId: string) => {
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === 0) return true;
    const previousSection = sections[sectionIndex - 1];
    return completedSections.includes(previousSection.id);
  };

  const resetWorkshop = () => {
    setCurrentSection('intro');
    setCompletedSections([]);
    setPasswords({});
  };

  if (currentSection === 'intro') {
    return <WorkshopIntro onStart={() => setCurrentSection('hearing')} />;
  }

  if (currentSection === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-workshop p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8 text-center space-y-6">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-4xl font-bold text-primary">Workshop Complete!</h1>
            <p className="text-lg text-muted-foreground">
              Congratulations! You've experienced all four accessibility perspectives and completed the challenges.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {sections.map((section) => (
                <div key={section.id} className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{section.title}</h3>
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Password: <code className="font-mono bg-background px-1 rounded">{passwords[section.id]}</code>
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-4 text-left mt-8">
              <h2 className="text-2xl font-bold text-center">Key Takeaways</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Hearing:</strong> Always provide captions, transcripts, and visual alternatives</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Vision:</strong> Ensure proper contrast ratios and screen reader compatibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Motor:</strong> Make all functionality accessible via keyboard navigation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Cognitive:</strong> Minimize distractions and provide clear, simple interfaces</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="workshop" onClick={resetWorkshop} size="lg">
                Restart Workshop
              </Button>
              <Link to="/leaderboard">
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  View Leaderboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-workshop p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress Bar */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Accessibility Workshop</h1>
            <div className="flex items-center gap-4">
              <Link to="/leaderboard">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Leaderboard
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground">
                {completedSections.length}/{sections.length} completed
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {sections.map((section, index) => {
              const isCompleted = completedSections.includes(section.id);
              const isCurrent = currentSection === section.id;
              const isLocked = !isUnlocked(section.id);

              return (
                <div
                  key={section.id}
                  className={`p-2 rounded-lg text-center text-sm transition-all ${
                    isCompleted
                      ? 'bg-success text-success-foreground'
                      : isCurrent
                      ? 'bg-primary text-primary-foreground animate-pulse'
                      : isLocked
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4" />
                    ) : null}
                    <span className="font-medium">{index + 1}</span>
                  </div>
                  <div className="text-xs mt-1">{section.title.split(' ')[1]}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Current Section */}
        <div className="space-y-6">
          {currentSection === 'hearing' && (
            <HearingSection 
              onPasswordSubmit={(password) => handlePasswordSubmit('hearing', password)} 
            />
          )}
          {currentSection === 'vision' && (
            <VisionSection 
              onPasswordSubmit={(password) => handlePasswordSubmit('vision', password)} 
            />
          )}
          {currentSection === 'motor' && (
            <MotorSection 
              onPasswordSubmit={(password) => handlePasswordSubmit('motor', password)} 
            />
          )}
          {currentSection === 'cognitive' && (
            <CognitiveSection 
              onPasswordSubmit={(password) => handlePasswordSubmit('cognitive', password)} 
            />
          )}
        </div>

        {/* Footer */}
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            This workshop simulates accessibility challenges for educational purposes. 
            Real accessibility requirements should always be implemented in production applications.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default AccessibilityWorkshop;