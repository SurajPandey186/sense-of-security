import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VisionSectionProps {
  onPasswordSubmit: (password: string) => void;
}

const VisionSection = ({ onPasswordSubmit }: VisionSectionProps) => {
  const [password, setPassword] = useState("");
  const [showScreenReader, setShowScreenReader] = useState(false);

  const correctPassword = "VISION";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toUpperCase() === correctPassword) {
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
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          👁️ Vision Disability Simulation
          <span className="text-sm font-normal bg-accent text-accent-foreground px-2 py-1 rounded">
            Section 2
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            The password is hidden in the content below, but it's nearly impossible to see due to poor contrast. 
            Use the screen reader simulation to find it.
          </p>
        </div>

        {/* Poor contrast content */}
        <div className="poor-contrast p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Important Information</h3>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              Welcome to our accessibility workshop. This section demonstrates how poor color contrast 
              affects users with visual impairments including low vision, color blindness, and other conditions.
            </p>
            <p>
              Many websites fail to meet WCAG contrast requirements, making content difficult or impossible to read.
              The minimum contrast ratio should be 4.5:1 for normal text and 3:1 for large text.
            </p>
            <p>
              <span className="sr-only">Password: VISION</span>
              The password for this section is hidden somewhere in this text but you cannot see it due to 
              the poor contrast. This demonstrates why proper contrast ratios are essential for accessibility.
            </p>
            <p>
              Users with visual impairments rely on screen readers, magnification software, and proper 
              contrast to navigate digital content effectively.
            </p>
          </div>
        </div>

        {/* Screen Reader Simulation */}
        <div className="space-y-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowScreenReader(!showScreenReader)}
          >
            {showScreenReader ? "🔊 Disable" : "🔇 Enable"} Screen Reader Simulation
          </Button>

          {showScreenReader && (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm animate-bounce-in">
              <div className="mb-2 text-green-300">Screen Reader Output:</div>
              <div className="space-y-1">
                <p>"Heading level 3: Important Information"</p>
                <p>"Welcome to our accessibility workshop. This section demonstrates how poor color contrast affects users..."</p>
                <p>"Many websites fail to meet WCAG contrast requirements, making content difficult or impossible to read..."</p>
                <p>"Password: V-I-S-I-O-N. The password for this section is hidden somewhere in this text..."</p>
                <p>"Users with visual impairments rely on screen readers, magnification software..."</p>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="text-xs text-muted-foreground">
          <p>💡 <strong>Learning:</strong> People with visual impairments use screen readers and need proper contrast ratios.</p>
          <p>Always test color contrast and provide screen reader compatible content with proper semantic markup.</p>
        </div>
      </CardContent>
    </div>
  );
};

export default VisionSection;