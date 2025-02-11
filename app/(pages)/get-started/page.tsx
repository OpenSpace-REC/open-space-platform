import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  Search, 
  Trophy, 
  Tags, 
  GitPullRequest, 
  Link2, 
  Shield, 
  FileText,
  Star
} from 'lucide-react';

const FeaturesShowcase = () => {
  const features = [
    {
      title: "Project Portfolio Creation",
      description: "Create comprehensive project showcases with all essential details in one place",
      icon: Upload,
      details: [
        {
          title: "Project Documentation",
          items: [
            "Detailed problem statement upload",
            "Project images and screenshots",
            "Supporting documentation and resources",
            "Generate shareable project links"
          ]
        }
      ]
    },
    {
      title: "Open Source Exploration",
      description: "Discover and contribute to college-wide open source projects",
      icon: Search,
      details: [
        {
          title: "Explore Features",
          items: [
            "Browse all college open source projects",
            "Find projects matching your skills",
            "View contribution guidelines",
            "Connect with project maintainers"
          ]
        }
      ]
    },
    {
      title: "Contribution Tracking",
      description: "Track and reward student contributions to open source projects",
      icon: GitPullRequest,
      details: [
        {
          title: "Leaderboard System",
          items: [
            "Points for project contributions",
            "Track interaction history",
            "View contribution statistics",
            "Earn recognition for participation"
          ]
        }
      ]
    },
    {
      title: "Verified Achievements",
      description: "Achievement tags assigned directly by official competition accounts",
      icon: Trophy,
      details: [
        {
          title: "Official Recognition",
          items: [
            "Direct verification from competition organizers",
            "Hackathon and contest achievement tags",
            "Inter and intra-college participation proof",
            "Permanent project achievement showcase"
          ]
        }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-transparent">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-white">Explore Open Space</h1>
        <p className="text-xl text-gray-300 mb-2">Your Gateway to College Open Source Projects</p>
        <Badge variant="secondary" className="mt-2">Build, Share, and Collaborate</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="group hover:border-white/40 transition-all duration-300 bg-black/40 border-white/10">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white/5">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-400">{feature.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator className="bg-white/10" />
            <CardContent className="pt-6">
              {feature.details.map((section, sIdx) => (
                <div key={sIdx} className="space-y-4">
                  <h3 className="font-medium text-white/80 text-sm">{section.title}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {section.items.map((item, iIdx) => (
                      <div key={iIdx} className="flex items-center text-gray-300 text-sm">
                        <div className="w-1 h-1 rounded-full bg-white/60 mr-3"></div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturesShowcase;