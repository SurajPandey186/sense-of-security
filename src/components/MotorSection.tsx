import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { commonPasswords } from "@/lib/utils";

interface MotorSectionProps {
  onPasswordSubmit: (password: string) => void;
}

const MotorSection = ({ onPasswordSubmit }: MotorSectionProps) => {
  const [password, setPassword] = useState("");
  const [currentFocus, setCurrentFocus] = useState(0);
  const [isMouseDisabled, setIsMouseDisabled] = useState(false);
  const [correctPassword] = useState<string>(() => {
    const idx = Math.floor(Math.random() * commonPasswords.length);
    return commonPasswords[idx].toUpperCase();
  });
  
  // Expose the current correct password on window for debugging/use in console
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).motorCorrectPassword = correctPassword;
      (window as any).motorCorrectPasswordUpper = correctPassword.toUpperCase();
    }
  }, [correctPassword]);
  
  const focusableElements = [
    "enable-keyboard-btn",
    "hidden-letter-1", "hidden-letter-2", "hidden-letter-3", "hidden-letter-4",
    "hidden-letter-5", "hidden-letter-6", "hidden-letter-7", "hidden-letter-8",
    "motor-password", "submit-motor-btn"
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMouseDisabled) return;
      
      if (e.key === "Tab") {
        e.preventDefault();
        const nextIndex = e.shiftKey 
          ? (currentFocus - 1 + focusableElements.length) % focusableElements.length
          : (currentFocus + 1) % focusableElements.length;
        setCurrentFocus(nextIndex);
        
        const element = document.getElementById(focusableElements[nextIndex]);
        element?.focus();
      }
      
      if (e.key === "Enter" || e.key === " ") {
        const focusedElement = document.getElementById(focusableElements[currentFocus]);
        if (focusedElement?.classList.contains('hidden-letter')) {
          focusedElement.classList.add('revealed');
          focusedElement.style.backgroundColor = 'hsl(var(--success))';
          focusedElement.style.color = 'white';
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMouseDisabled, currentFocus]);

  const enableKeyboardMode = () => {
    setIsMouseDisabled(true);
    document.body.classList.add('mouse-disabled');
    const firstElement = document.getElementById(focusableElements[1]);
    firstElement?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toUpperCase() === correctPassword) {
      document.body.classList.remove('mouse-disabled');
      onPasswordSubmit(password);
    } else {
      const input = document.querySelector('.motor-password-input');
      input?.classList.add('animate-shake');
      setTimeout(() => input?.classList.remove('animate-shake'), 500);
      setPassword("");
    }
  };

  const letters = correctPassword.split('');

  return (
    <div className="workshop-section">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          🖱️ Motor Disability Simulation
          <span className="text-sm font-normal bg-accent text-accent-foreground px-2 py-1 rounded">
            Section 3
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Mouse functionality will be disabled. Use only keyboard navigation (Tab, Enter, Space) 
            to reveal hidden letters and form the password.
          </p>
        </div>

        {!isMouseDisabled ? (
          <div className="text-center">
            <Button
              id="enable-keyboard-btn"
              variant="workshop"
              onClick={enableKeyboardMode}
              className="keyboard-focusable"
            >
              Enable Keyboard-Only Mode
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Once enabled, your mouse cursor will disappear and mouse clicks will be disabled
            </p>
          </div>
        ) : (
          <>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-semibold mb-2">🎯 Instructions:</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Use <kbd className="px-1 bg-background rounded">Tab</kbd> to navigate between elements</li>
                <li>• Use <kbd className="px-1 bg-background rounded">Enter</kbd> or <kbd className="px-1 bg-background rounded">Space</kbd> to reveal letters</li>
                <li>• Find all 8 hidden letters to form the password</li>
                <li>• Navigate to the input field and type the password</li>
              </ul>
            </div>

            {/* Hidden letter grid */}
            <div className="grid grid-cols-4 gap-4 p-6 bg-muted/50 rounded-lg">
              <div className="col-span-4 text-center mb-4">
                <h3 className="font-semibold">Find the hidden letters (Tab to navigate, Enter/Space to reveal)</h3>
              </div>
              
              {letters.map((letter, index) => (
                <div key={index} className="text-center">
                  <button
                    id={`hidden-letter-${index + 1}`}
                    className="hidden-letter keyboard-focusable w-16 h-16 border-2 border-primary bg-background rounded-lg 
                             focus:ring-2 focus:ring-primary focus:bg-primary focus:text-primary-foreground
                             hover:bg-primary hover:text-primary-foreground transition-colors"
                    tabIndex={0}
                  >
                    <span className="sr-only">Hidden letter {index + 1}: {letter}</span>
                    <span className="invisible revealed-letter">{letter}</span>
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="motor-password">Enter the password formed by the letters:</Label>
                <Input
                  id="motor-password"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="motor-password-input password-input keyboard-focusable"
                  placeholder="Enter password..."
                  autoComplete="off"
                  tabIndex={0}
                />
              </div>
              
              <div className="flex justify-center">
                <Button 
                  id="submit-motor-btn"
                  type="submit" 
                  variant="keyboard"
                  className="keyboard-focusable"
                  tabIndex={0}
                >
                  Submit Password
                </Button>
              </div>
            </form>
          </>
        )}

        <div className="text-xs text-muted-foreground">
          <p>💡 <strong>Learning:</strong> People with motor disabilities may have difficulty using a mouse or trackpad.</p>
          <p>Ensure all functionality is accessible via keyboard and provide proper focus indicators.</p>
        </div>
      </CardContent>
    </div>
  );
};

export default MotorSection;