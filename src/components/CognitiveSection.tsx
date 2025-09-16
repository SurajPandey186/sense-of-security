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
    batteryLevel: "",
    emoji: "",
    specialTalent: "",
    changeWorld: "",
    likingSession: "",
    feedback: ""
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const [currentPopup, setCurrentPopup] = useState<PopupProblem | null>(null);
  const [popupAnswer, setPopupAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();



  const problems: PopupProblem[] = [
    { id: 1, type: 'math', question: 'If you have 3 apples and give away 1, how many do you have left?', answer: '2' },
    { id: 2, type: 'puzzle', question: 'What comes after Monday?', answer: 'tuesday' },
    { id: 3, type: 'math', question: 'How many minutes are in one hour?', answer: '60' },
    { id: 4, type: 'math', question: 'What is 10 + 5?', answer: '15' },
    { id: 5, type: 'puzzle', question: 'How many days are in a week?', answer: '7' },
    { id: 6, type: 'math', question: 'What is 20 - 8?', answer: '12' },
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
      closePopup();
    } else {
      // Wrong answer - shake animation and clear input
      const input = document.querySelector('.popup-input');
      input?.classList.add('animate-shake');
      setTimeout(() => input?.classList.remove('animate-shake'), 500);
      setPopupAnswer("");
    }
  };

  // Start the challenge automatically on mount and schedule first popup after 5s
  useEffect(() => {
    setIsActive(true);

    if (!currentPopup && !timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        generatePopup();
        timeoutRef.current = null;
      }, 10000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When popup closes (currentPopup becomes null) and challenge is active, start a new 5s timer
  useEffect(() => {
    if (!isActive) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    if (currentPopup) {
      // Ensure no timer is running while popup is open
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    // No popup open – schedule next one after 10s
    if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        generatePopup();
        timeoutRef.current = null;
      }, 10000);
    }
  }, [currentPopup, isActive]);

  // Removed auto-close timer - popup only closes when answered correctly

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
    if (!formData.batteryLevel.trim()) {
      newErrors.batteryLevel = "Battery level is required";
    } else if (!/^\d+$/.test(formData.batteryLevel) || parseInt(formData.batteryLevel) < 0 || parseInt(formData.batteryLevel) > 100) {
      newErrors.batteryLevel = "Please enter a valid percentage (0-100)";
    }
    if (!formData.likingSession.trim()) newErrors.likingSession = "Please select an option";
    if (!formData.feedback.trim() || formData.feedback.trim().length < 100) {
      newErrors.feedback = "Feedback must be at least 100 characters";
    }
    
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
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    try {
      // Store form data in Supabase
      const { error } = await supabase
        .from('leaderboard')
        .insert([{
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          battery_level: parseInt(formData.batteryLevel),
          favorite_emoji: formData.emoji,
          special_talent: formData.specialTalent,
          world_change: formData.changeWorld,
          session_rating: formData.likingSession,
          session_feedback: formData.feedback,
          cognitive_score: score
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
              Questions will pop up every 10 seconds - you must answer correctly to continue
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

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
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
                    autoComplete="off"
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
                    autoComplete="off"
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
                  autoComplete="off"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="batteryLevel">What's your battery level right now (in percentage)? *</Label>
                  <Input
                    id="batteryLevel"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.batteryLevel}
                    onChange={(e) => handleFormChange('batteryLevel', e.target.value)}
                    placeholder="Enter percentage (0-100)"
                    className={errors.batteryLevel ? "border-red-500" : ""}
                    autoComplete="off"
                  />
                  {errors.batteryLevel && <p className="text-red-500 text-xs mt-1">{errors.batteryLevel}</p>}
                </div>

                <div>
                  <Label htmlFor="emoji">If you were an emoji, which one?</Label>
                  <Input
                    id="emoji"
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => handleFormChange('emoji', e.target.value)}
                    placeholder="Enter your emoji"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="specialTalent">What's your special talent?</Label>
                <Textarea
                  id="specialTalent"
                  value={formData.specialTalent}
                  onChange={(e) => handleFormChange('specialTalent', e.target.value)}
                  placeholder="Tell us about your special talent"
                  rows={3}
                  autoComplete="off"
                />
              </div>

              <div>
                <Label htmlFor="changeWorld">If you were to change one thing in the world to make it a better place, what would you change?</Label>
                <Textarea
                  id="changeWorld"
                  value={formData.changeWorld}
                  onChange={(e) => handleFormChange('changeWorld', e.target.value)}
                  placeholder="What would you change in the world?"
                  rows={3}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="likingSession">Are you liking this session? *</Label>
                  <select
                    id="likingSession"
                    value={formData.likingSession}
                    onChange={(e) => handleFormChange('likingSession', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${errors.likingSession ? "border-red-500" : "border-input"} bg-background`}
                  >
                    <option value="">Select an option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {errors.likingSession && <p className="text-red-500 text-xs mt-1">{errors.likingSession}</p>}
                </div>

                <div>
                  <Label htmlFor="feedback">A short feedback for us on the basis of your experience in this session until now?</Label>
                  <Textarea
                    id="feedback"
                    value={formData.feedback}
                    onChange={(e) => handleFormChange('feedback', e.target.value)}
                    placeholder="Share your feedback"
                    rows={3}
                    autoComplete="off"
                    minLength={100}
                    className={errors.feedback ? "border-red-500" : ""}
                  />
                  {errors.feedback && <p className="text-red-500 text-xs mt-1">{errors.feedback}</p>}
                </div>
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
          <div style={{marginTop: '-16px'}} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 popup-enter">
            <Card className="w-96 mx-4 animate-bounce-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {currentPopup.type === 'math' ? '🔢' : '🧩'} Answer Required!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-medium">{currentPopup.question}</p>
                <Input
                  type="text"
                  value={popupAnswer}
                  onChange={(e) => setPopupAnswer(e.target.value)}
                  placeholder="Your answer..."
                  className="popup-input"
                  autoFocus
                  autoComplete="off"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      submitPopupAnswer();
                    }
                  }}
                />
                <div className="flex justify-center">
                  <Button onClick={submitPopupAnswer} size="sm" variant="workshop" className="w-full">
                    Submit Answer
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  You must answer correctly to continue
                </p>
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