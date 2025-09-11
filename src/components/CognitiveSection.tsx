import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
    firstName: "",
    lastName: "",
    email: "",
    favoriteFood: "",
    birthPlace: "",
    motherMaidenName: "",
    firstSchool: "",
    favoriteTeacher: ""
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const [currentPopup, setCurrentPopup] = useState<PopupProblem | null>(null);
  const [popupAnswer, setPopupAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();



  const problems: PopupProblem[] = [
    { id: 1, type: 'math', question: 'If you have 3 apples and give away 1, how many do you have left?', answer: '2' },
    { id: 2, type: 'puzzle', question: 'What comes after Monday?', answer: 'tuesday' },
    { id: 3, type: 'math', question: 'How many minutes are in one hour?', answer: '60' },
    { id: 4, type: 'puzzle', question: 'What color do you get when you mix red and yellow?', answer: 'orange' },
    { id: 5, type: 'math', question: 'What is 10 + 5?', answer: '15' },
    { id: 6, type: 'puzzle', question: 'How many days are in a week?', answer: '7' },
    { id: 7, type: 'math', question: 'What is 20 - 8?', answer: '12' },
    { id: 8, type: 'puzzle', question: 'What season comes after winter?', answer: 'spring' }
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

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.favoriteFood.trim()) newErrors.favoriteFood = "Favorite food is required";
    if (!formData.birthPlace.trim()) newErrors.birthPlace = "Birth place is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Incomplete Form",
        description: "Please fix all validation errors while managing the popup distractions!",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    try {
      // Store form data in Supabase
      const { error } = await supabase
        .from('leaderboard')
        .insert([{
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          favorite_dishes: formData.favoriteFood,
          favorite_places: formData.birthPlace,
          pet_name: formData.motherMaidenName,
          childhood_friend: formData.firstSchool,
          dream_job: formData.favoriteTeacher,
          cognitive_score: score,
          score: score // Keep score for compatibility
        }]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your form has been submitted and added to the leaderboard!",
      });

      onPasswordSubmit('COMPLETED');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
      // Re-enable the challenge if submission failed
      setIsActive(true);
    } finally {
      setIsSubmitting(false);
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
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleFormChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleFormChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="favoriteFood">What is your favorite food? *</Label>
                  <Input
                    id="favoriteFood"
                    type="text"
                    value={formData.favoriteFood}
                    onChange={(e) => handleFormChange('favoriteFood', e.target.value)}
                    placeholder="Your favorite food"
                    className={errors.favoriteFood ? "border-red-500" : ""}
                  />
                  {errors.favoriteFood && <p className="text-red-500 text-xs mt-1">{errors.favoriteFood}</p>}
                </div>

                <div>
                  <Label htmlFor="birthPlace">Where were you born? *</Label>
                  <Input
                    id="birthPlace"
                    type="text"
                    value={formData.birthPlace}
                    onChange={(e) => handleFormChange('birthPlace', e.target.value)}
                    placeholder="Your birth place"
                    className={errors.birthPlace ? "border-red-500" : ""}
                  />
                  {errors.birthPlace && <p className="text-red-500 text-xs mt-1">{errors.birthPlace}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="motherMaidenName">What is your mother's maiden name?</Label>
                  <Input
                    id="motherMaidenName"
                    type="text"
                    value={formData.motherMaidenName}
                    onChange={(e) => handleFormChange('motherMaidenName', e.target.value)}
                    placeholder="Mother's maiden name"
                  />
                </div>

                <div>
                  <Label htmlFor="firstSchool">What was your first school's name?</Label>
                  <Input
                    id="firstSchool"
                    type="text"
                    value={formData.firstSchool}
                    onChange={(e) => handleFormChange('firstSchool', e.target.value)}
                    placeholder="First school name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="favoriteTeacher">Who was your favorite teacher?</Label>
                <Input
                  id="favoriteTeacher"
                  type="text"
                  value={formData.favoriteTeacher}
                  onChange={(e) => handleFormChange('favoriteTeacher', e.target.value)}
                  placeholder="Favorite teacher's name"
                />
              </div>

              <div className="flex justify-center">
                <Button type="submit" variant="workshop" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Complete Form"}
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