import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { commonPasswords } from "@/lib/utils";

interface VisionSectionProps {
  onPasswordSubmit: (password: string) => void;
}

const VisionSection = ({ onPasswordSubmit }: VisionSectionProps) => {
  const [password, setPassword] = useState("");
  const [showScreenReader, setShowScreenReader] = useState(false);
  const [correctPassword] = useState<string>(() => {
    const idx = Math.floor(Math.random() * commonPasswords.length);
    return commonPasswords[idx].toUpperCase();
  });

  // Expose the current correct password on window for debugging/use in console
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).correctPassword = correctPassword;
      (window as any).correctPasswordUpper = correctPassword.toUpperCase();
    }
  }, [correctPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === correctPassword.toLowerCase()) {
      onPasswordSubmit(password);
    } else {
      const input = document.querySelector('.vision-password-input');
      input?.classList.add('animate-shake');
      setTimeout(() => input?.classList.remove('animate-shake'), 500);
      setPassword("");
    }
  };

  return (
    <div className="workshop-section">
      <CardHeader aria-hidden="true">
        <CardTitle className="flex items-center gap-3">
          👁️ Vision Disability Simulation
          <span className="text-sm font-normal bg-accent text-accent-foreground px-2 py-1 rounded">
            Section 2
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-left" aria-hidden="true">
          <p className="text-muted-foreground mb-4" aria-hidden="true">
            Use Screen Reader to navigate to the content below. The password is hidden in poor contrast text.
          </p>
          <div className="bg-muted p-4 rounded-lg" aria-hidden="true">
            <p className="text-sm text-muted-foreground" aria-hidden="true">
              <strong>💡 How to enable screen reader:</strong><br/>
              • <strong>Windows:</strong> Press Windows + Ctrl + Enter to start Narrator<br/>
              • <strong>Mac:</strong> Press Command + F5 to start VoiceOver<br/>
              • <strong>Chrome:</strong> Install ChromeVox extension<br/>
              • <strong>Android Mobile:</strong> Settings ➡️ Accessibility ➡️ TalkBack and toggle it on<br/>
              • <strong>IOS Mobile:</strong> Settings ➡️ Accessibility ➡️ VoiceOver and toggle it on<br/>
              • Use Tab and Arrow keys to navigate through the content below
            </p>
          </div>
        </div>

        {/* Poor contrast content - black on black */}
        <div className="bg-black p-6 rounded-lg border border-gray-800 select-none" style={{userSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', MozUserSelect: 'none'}}>
          <h3 className="text-lg font-semibold mb-4 text-black">Use Screen Reader to read the text</h3>
          <div className="space-y-3 text-sm leading-relaxed text-black" style={{userSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', MozUserSelect: 'none'}}>
            <p>
              Welcome to our accessibility workshop. This section demonstrates how poor color contrast 
              affects users with visual impairments including low vision, color blindness, and other conditions.
            </p>
            <p>
              Many websites fail to meet WCAG contrast requirements, making content difficult or impossible to read.
              The minimum contrast ratio should be 4.5:1 for normal text and 3:1 for large text.
            </p>
            <p>
              <VisuallyHidden>Your password is: {correctPassword.toUpperCase()}</VisuallyHidden>
              The password for this section is hidden somewhere in this text but you cannot see it due to 
              the poor contrast. This demonstrates why proper contrast ratios are essential for accessibility.
            </p>
            <p>
              Users with visual impairments rely on screen readers, magnification software, and proper 
              contrast to navigate digital content effectively.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" aria-hidden="true">
          <div>
            <Label htmlFor="vision-password">Enter the password from the content above:</Label>
            <Input
              id="vision-password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="vision-password-input password-input"
              placeholder="Enter password..."
              autoComplete="off"
            />
          </div>
          
          <div className="flex justify-center">
            <Button type="submit" variant="workshop">
              Submit Password
            </Button>
          </div>
        </form>

        <div className="text-xs text-muted-foreground" aria-hidden="true">
          <p>💡 <strong>Learning:</strong> People with visual impairments use screen readers and need proper contrast ratios.</p>
          <p>Always test color contrast and provide screen reader compatible content with proper semantic markup.</p>
        </div>
      </CardContent>
    </div>
  );
};

export default VisionSection;