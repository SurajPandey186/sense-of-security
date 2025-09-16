import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { timeEnd } from "console";

interface HearingSectionProps {
  onPasswordSubmit: (password: string) => void;
}

const HearingSection = ({ onPasswordSubmit }: HearingSectionProps) => {
  const [enable, setEnable] = useState(true);
  const [password, setPassword] = useState("");
  const [showHint, setShowHint] = useState(false);

  const correctPassword = "BANANA";

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setEnable(false);
    }, 1000 * 30);

    return () => {
      clearTimeout(timeOut);
    }
  }, [])

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
            loop
            muted
            autoPlay
            playsInline
            src="/movie.mp4"
            controls={false}
            disablePictureInPicture
            className="w-full h-full object-cover rotate-smoothly"
            controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
            aria-label="Lip reading practice video without audio or captions"
          />
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
              disabled={enable}
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
          <div className="p-4 bg-muted rounded-lg animate-bounce-in space-y-2">
            <p className="text-sm">
              <strong>Hint 1:</strong> You peel me, you eat me, I’m yellow when smug — what am I?
            </p>
            <p className="text-sm">
              <strong>Hint 2:</strong> Green turns to gold as I ripen in a bunch; who am I, in a lunch?
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