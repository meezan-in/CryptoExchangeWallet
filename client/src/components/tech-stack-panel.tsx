import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";

export default function TechStackPanel() {
  const techStack = [
    { name: "Node.js", category: "Backend", color: "bg-primary" },
    { name: "React.js", category: "Frontend", color: "bg-primary" },
    { name: "MongoDB", category: "Database", color: "bg-primary" },
    { name: "BIP39", category: "🔐", color: "bg-success" },
    { name: "AES-256", category: "🔒", color: "bg-success" },
    { name: "SHA-256", category: "🔑", color: "bg-success" },
    { name: "CoinGecko", category: "API", color: "bg-warning" },
  ];

  return (
    <div className="fixed top-20 right-6 z-10">
      <Card className="w-64 bg-slate-50 border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700 flex items-center">
            <Settings className="w-4 h-4 text-primary mr-2" />
            Tech Stack Used
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {techStack.map((tech, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-xs text-slate-600">{tech.name}</span>
                <Badge 
                  className={`text-xs px-2 py-1 text-white ${tech.color}`}
                  variant="secondary"
                >
                  {tech.category}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
