import { RouterLogin } from "@/components/RouterLogin";
import { Card, CardContent } from "@/components/ui/card";
import { MoonIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <MoonIcon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Mikrotik Router Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Connect and manage your Mikrotik router securely
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <RouterLogin />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
