import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HearingSectionProps {
  onPasswordSubmit: (password: string) => void;
}

const HearingSection = ({ onPasswordSubmit }: HearingSectionProps) => {
  const [password, setPassword] = useState("");
  const [showHint, setShowHint] = useState(false);

  const correctPassword = "ACCESS";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toUpperCase() === correctPassword) {
      onPasswordSubmit(password);
    } else {
      // Shake animation for wrong password
      const input = document.querySelector('.password-input');
      input?.classList.add('animate-shake');
      setTimeout(() => input?.classList.remove('animate-shake'), 500);
      setPassword("");
    }
  };

  return (
    <div className="workshop-section">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          🎧 Hearing Disability Simulation
          <span className="text-sm font-normal bg-accent text-accent-foreground px-2 py-1 rounded">
            Section 1
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Watch the video and read the speaker's lips to identify the password. Audio is intentionally disabled.
          </p>
        </div>

        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          <video
            className="w-full h-full object-cover"
            muted
            controls={false}
            autoPlay
            loop
            playsInline
          >
            {/* We'll create a simple video element - in a real workshop, you'd have an actual lip-reading video */}
            <source src="" type="video/mp4" />
          </video>
          
          {/* Simulated video overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🎭</div>
              <p className="text-lg mb-2">Person speaking (lips moving):</p>
              <p className="text-2xl font-mono tracking-wider">"A-C-C-E-S-S"</p>
              <p className="text-sm mt-4 text-gray-300">
                (In a real workshop, this would be a video of someone speaking the password)
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="hearing-password">Enter the password you heard:</Label>
            <Input
              id="hearing-password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
              placeholder="Enter password..."
              autoComplete="off"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowHint(!showHint)}
            >
              {showHint ? "Hide" : "Show"} Hint
            </Button>
            <Button type="submit" variant="workshop">
              Submit Password
            </Button>
          </div>
        </form>

        {showHint && (
          <div className="p-4 bg-muted rounded-lg animate-bounce-in">
            <p className="text-sm">
              <strong>Hint:</strong> Look carefully at the mouth movements. The word is related to gaining entry.
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>💡 <strong>Learning:</strong> People who are deaf or hard of hearing rely on lip reading, sign language, and visual cues.</p>
          <p>Always provide captions, transcripts, and visual alternatives for audio content.</p>
        </div>
      </CardContent>
    </div>
  );
};

export default HearingSection;