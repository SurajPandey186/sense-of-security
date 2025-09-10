import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CognitiveSectionProps {
  onPasswordSubmit: (password: string) => void;
}

interface PopupProblem {
  id: number;
  type: 'math' | 'puzzle';
  question: string;
  answer: string;
  options?: string[];
}

const CognitiveSection = ({ onPasswordSubmit }: CognitiveSectionProps) => {
  const [formData, setFormData] = useState({
    name: "",
    favoriteDishes: "",
    favoritePlaces: "",
    petName: "",
    childhoodFriend: "",
    dreamJob: "",
    password: ""
  });
  
  const [currentPopup, setCurrentPopup] = useState<PopupProblem | null>(null);
  const [popupAnswer, setPopupAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const correctPassword = "FOCUS";

  const problems: PopupProblem[] = [
    { id: 1, type: 'math', question: 'What is 15 × 7?', answer: '105' },
    { id: 2, type: 'puzzle', question: 'What has keys but no locks, space but no room?', answer: 'keyboard' },
    { id: 3, type: 'math', question: 'What is 234 ÷ 6?', answer: '39' },
    { id: 4, type: 'puzzle', question: 'I am not alive, but I grow. I have no lungs, but I need air. What am I?', answer: 'fire' },
    { id: 5, type: 'math', question: 'What is 12² - 8²?', answer: '80' },
    { id: 6, type: 'puzzle', question: 'What gets wetter the more it dries?', answer: 'towel' },
    { id: 7, type: 'math', question: 'What is 7 × 8 + 12?', answer: '68' },
    { id: 8, type: 'puzzle', question: 'What has one eye but cannot see?', answer: 'needle' }
  ];

  const generatePopup = () => {
    const randomProblem = problems[Math.floor(Math.random() * problems.length)];
    setCurrentPopup(randomProblem);
    setPopupAnswer("");
    setTimeLeft(10);
  };

  const closePopup = () => {
    setCurrentPopup(null);
    setTimeLeft(10);
  };

  const submitPopupAnswer = () => {
    if (popupAnswer.toLowerCase().trim() === currentPopup?.answer.toLowerCase()) {
      setScore(score + 1);
    }
    closePopup();
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        generatePopup();
      }, 10000);
      
      // Generate first popup after 3 seconds
      setTimeout(generatePopup, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  useEffect(() => {
    if (currentPopup && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (currentPopup && timeLeft === 0) {
      closePopup();
    }
  }, [currentPopup, timeLeft]);

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if form is complete
    const requiredFields = ['name', 'favoriteDishes', 'favoritePlaces', 'petName', 'password'];
    const isComplete = requiredFields.every(field => formData[field as keyof typeof formData].trim() !== '');
    
    if (!isComplete) {
      alert('Please fill in all required fields while managing the popup distractions!');
      return;
    }

    if (formData.password.toUpperCase() === correctPassword) {
      setIsActive(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      onPasswordSubmit(formData.password);
    } else {
      const input = document.querySelector('.cognitive-password-input');
      input?.classList.add('animate-shake');
      setTimeout(() => input?.classList.remove('animate-shake'), 500);
      setFormData({ ...formData, password: "" });
    }
  };

  const startChallenge = () => {
    setIsActive(true);
  };

  return (
    <div className="workshop-section">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          🧠 Cognitive Disability Simulation
          <span className="text-sm font-normal bg-accent text-accent-foreground px-2 py-1 rounded">
            Section 4
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Fill out the form completely while managing constant popup distractions. 
            The password is hidden in this instruction: "Stay FOCUSED on the task at hand."
          </p>
        </div>

        {!isActive ? (
          <div className="text-center">
            <Button variant="workshop" onClick={startChallenge} size="lg">
              Start Cognitive Challenge
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Math problems and puzzles will pop up every 10 seconds once started
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Distractions handled:</strong> {score} | 
                <strong> Status:</strong> {currentPopup ? 'Popup Active!' : 'Focus on form'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="petName">Pet's Name *</Label>
                  <Input
                    id="petName"
                    type="text"
                    value={formData.petName}
                    onChange={(e) => handleFormChange('petName', e.target.value)}
                    placeholder="Your pet's name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="favoriteDishes">Favorite Dishes (3 minimum) *</Label>
                <Textarea
                  id="favoriteDishes"
                  value={formData.favoriteDishes}
                  onChange={(e) => handleFormChange('favoriteDishes', e.target.value)}
                  placeholder="List your favorite dishes..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="favoritePlaces">Favorite Places to Visit *</Label>
                <Textarea
                  id="favoritePlaces"
                  value={formData.favoritePlaces}
                  onChange={(e) => handleFormChange('favoritePlaces', e.target.value)}
                  placeholder="Describe places you love to visit..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="childhoodFriend">Childhood Best Friend</Label>
                  <Input
                    id="childhoodFriend"
                    type="text"
                    value={formData.childhoodFriend}
                    onChange={(e) => handleFormChange('childhoodFriend', e.target.value)}
                    placeholder="Your childhood friend's name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="dreamJob">Dream Job</Label>
                  <Input
                    id="dreamJob"
                    type="text"
                    value={formData.dreamJob}
                    onChange={(e) => handleFormChange('dreamJob', e.target.value)}
                    placeholder="Your dream career"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password (hint: stay _____ on the task) *</Label>
                <Input
                  id="password"
                  type="text"
                  value={formData.password}
                  onChange={(e) => handleFormChange('password', e.target.value)}
                  className="cognitive-password-input password-input"
                  placeholder="Enter the password..."
                />
              </div>

              <div className="flex justify-center">
                <Button type="submit" variant="workshop" size="lg">
                  Submit Complete Form
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Popup Overlay */}
        {currentPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 popup-enter">
            <Card className="w-96 mx-4 animate-bounce-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  {currentPopup.type === 'math' ? '🔢' : '🧩'} Solve This!
                  <span className="text-sm bg-destructive text-destructive-foreground px-2 py-1 rounded">
                    {timeLeft}s
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-medium">{currentPopup.question}</p>
                <Input
                  type="text"
                  value={popupAnswer}
                  onChange={(e) => setPopupAnswer(e.target.value)}
                  placeholder="Your answer..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      submitPopupAnswer();
                    } else if (e.key === 'Escape') {
                      closePopup();
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Button onClick={submitPopupAnswer} size="sm" variant="workshop" className="flex-1">
                    Submit
                  </Button>
                  <Button onClick={closePopup} size="sm" variant="outline">
                    Skip
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>💡 <strong>Learning:</strong> People with cognitive disabilities may have difficulty with attention, memory, or processing.</p>
          <p>Minimize distractions, provide clear instructions, and allow extra time for task completion.</p>
        </div>
      </CardContent>
    </div>
  );
};

export default CognitiveSection;