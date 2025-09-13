import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkshopIntroProps {
  onStart: () => void;
}

const WorkshopIntro = ({ onStart }: WorkshopIntroProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-workshop p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold mb-4">
            🎓 BlindFolded WorkShop
          </CardTitle>
          <CardDescription className="text-lg">
            Experience different disability perspectives through interactive challenges
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              This workshop simulates various accessibility challenges to build empathy and understanding.
              Complete each section by finding the hidden password to unlock the next challenge.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-primary mb-2">🎧 Hearing Challenge</h3>
              <p className="text-sm text-muted-foreground">
                Identify a password through lip reading without audio
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-primary mb-2">👁️ Vision Challenge</h3>
              <p className="text-sm text-muted-foreground">
                Navigate poor contrast with screen reader assistance
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-primary mb-2">🖱️ Motor Challenge</h3>
              <p className="text-sm text-muted-foreground">
                Use only keyboard navigation to find the password
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-primary mb-2">🧠 Cognitive Challenge</h3>
              <p className="text-sm text-muted-foreground">
                Multitask while handling constant distractions
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button 
              variant="workshop" 
              size="lg" 
              onClick={onStart}
              className="text-lg px-8 py-3"
            >
              Begin Workshop
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>⚠️ This workshop includes flashing content and intentionally difficult interfaces</p>
            <p>Use screen readers, keyboard navigation, and assistive technologies as needed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkshopIntro;