'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  FolderKanban,
  GitFork,
  Trophy,
  Award,
  Search,
  Upload,
  Rocket,
  ArrowRight,
  FileText,
  Image,
  Files,
  Share2,
  Target,
  BookOpen,
  Users,
  Star,
  Medal,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Crown,
  Code2,
  Github,
  Bug,
  MessageSquare
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface MainFeature {
  title: string;
  description: string;
  icon: LucideIcon;
  steps?: Step[];
  features?: Feature[];
  link: string;
}

const FeaturesShowcase = () => {
  const mainFeatures: MainFeature[] = [
    {
      title: "Project Portfolio Creation",
      description: "Create comprehensive project showcases with all essential details in one place",
      icon: FolderKanban,
      steps: [
        {
          title: "Project Documentation",
          description: "Detailed problem statement upload",
          icon: FileText
        },
        {
          title: "Visual Content",
          description: "Project images and screenshots",
          icon: Image
        },
        {
          title: "Resources",
          description: "Supporting documentation and resources",
          icon: Files
        },
        {
          title: "Share",
          description: "Generate shareable project links",
          icon: Share2
        }
      ],
      link: "/upload-project"
    },
    {
      title: "Open Source Exploration",
      description: "Discover and contribute to college-wide open source projects",
      icon: GitFork,
      features: [
        {
          title: "Browse Projects",
          description: "Browse all college open source projects",
          icon: Search
        },
        {
          title: "Skill Matching",
          description: "Find projects matching your skills",
          icon: Target
        },
        {
          title: "Guidelines",
          description: "View contribution guidelines",
          icon: BookOpen
        },
        {
          title: "Connect",
          description: "Connect with project maintainers",
          icon: Users
        }
      ],
      link: "/explore-projects"
    }
  ];

  const highlightFeatures = [];

  const MainIcon = ({ icon: Icon }: { icon: LucideIcon }) => (
    <div className="inline-block p-3 rounded-2xl bg-foreground/5 mb-4">
      <Icon className="w-8 h-8 text-foreground" />
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-background/50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-20 relative px-4"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/50" />
          <div className="relative z-10">
            <h1 className="text-6xl font-bold mb-6 text-foreground">
              Welcome to Open Space Platform
            </h1>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Your Gateway to Project Excellence and Open Source Innovation
            </p>
            <div className="flex gap-3 justify-center mb-8 flex-wrap">
              {['Portfolio', 'Open Source', 'Recognition', 'Verification'].map((tag, i) => (
                <Badge 
                  key={tag}
                  variant="secondary" 
                  className="text-sm"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Features Section */}
        <div className="px-4 pb-20">
          {/* Project Portfolio Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <MainIcon icon={mainFeatures[0].icon} />
              <h2 className="text-3xl font-bold text-foreground mb-3">{mainFeatures[0].title}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">{mainFeatures[0].description}</p>
            </div>
            
            <div className="relative">
              <div className="absolute top-0 left-1/2 h-full w-px bg-foreground/10" />
              <div className="space-y-12">
                {mainFeatures[0]?.steps?.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex items-center gap-8 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <div className={`flex-1 ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center relative z-10">
                        {React.createElement(step.icon, { className: "w-8 h-8 text-foreground" })}
                      </div>
                      <div className="absolute top-1/2 -translate-y-1/2 w-8 h-px bg-foreground/10" />
                    </div>
                    <div className="flex-1" />
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link href={mainFeatures[0].link}>
                <Button 
                  size="lg"
                  className="bg-foreground/10 hover:bg-foreground/20 text-foreground border-0"
                >
                  Create Your Portfolio
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Getting Started Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-32 px-4 md:px-0"
          >
            <div className="text-center mb-16">
              <MainIcon icon={Rocket} />
              <h2 className="text-3xl font-bold text-foreground mb-3">Start Your Open Source Journey</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Follow these simple steps to begin contributing and earning recognition</p>
            </div>

            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-foreground/10 md:-translate-x-1/2 hidden sm:block" />
              {[
                {
                  title: "Sign In & Connect",
                  description: "Sign in to our platform and link your GitHub account to get started",
                  icon: Users
                },
                {
                  title: "Explore Projects",
                  description: "Browse through our collection of open source projects from your college",
                  icon: Search
                },
                {
                  title: "Choose & Contribute",
                  description: "Select projects that interest you and start making meaningful contributions",
                  icon: GitFork
                },
                {
                  title: "Earn Recognition",
                  description: "Get points automatically for your valuable contributions and interactions",
                  icon: Trophy
                }
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="relative mb-8 md:mb-12"
                >
                  <div className={`flex flex-col md:flex-row items-center gap-8 ${
                    idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}>
                    <div className={`w-full md:w-1/2 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center`}>
                      <Card className="inline-block bg-foreground/5 border-foreground/10 w-full md:w-auto">
                        <CardContent className="p-6">
                          <div className={`flex flex-col md:flex-row items-center gap-4 ${
                            idx % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'
                          }`}>
                            <div className="w-12 h-12 rounded-lg bg-foreground/10 flex items-center justify-center flex-shrink-0">
                              {React.createElement(step.icon, { className: "w-6 h-6 text-foreground" })}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                              <p className="text-muted-foreground text-sm">{step.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="w-4 h-4 bg-foreground/20 rounded-full absolute left-4 md:left-1/2 md:-translate-x-1/2 hidden sm:block" 
                      style={{ top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Automatic Profile Updates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-32 mb-32"
          >
            <div className="text-center mb-16">
              <MainIcon icon={BarChart3} />
              <h2 className="text-3xl font-bold text-foreground mb-3">Automatic Profile Updates</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Your Open Space profile automatically tracks and showcases all your contributions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Project Contributions",
                  description: "Every code contribution is automatically added to your profile",
                  icon: GitFork
                },
                {
                  title: "Activity Tracking",
                  description: "Your project interactions and updates are tracked in real-time",
                  icon: TrendingUp
                },
                {
                  title: "Profile Showcase",
                  description: "Build a comprehensive portfolio of your open source work",
                  icon: Trophy
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="bg-foreground/5 border-foreground/10 hover:bg-foreground/10 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-foreground/10 flex items-center justify-center mb-4">
                          {React.createElement(feature.icon, { className: "w-8 h-8 text-foreground" })}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Official Achievement Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-32 mb-32 px-4 md:px-0"
          >
            <div className="text-center mb-16">
              <MainIcon icon={Award} />
              <h2 className="text-3xl font-bold text-foreground mb-3">Official Achievement Tags</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Your projects receive verified recognition directly from event organizers</p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-foreground/5 blur-3xl -z-10" />
              <Card className="bg-foreground/5 border-foreground/10">
                <CardContent className="p-4 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Achievement Types */}
                    <div className="space-y-6 relative pb-8 md:pb-0">
                      <div className="absolute top-0 right-4">
                        <CheckCircle2 className="w-6 h-6 text-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">Achievement Types</h3>
                      <div className="space-y-4">
                        <Badge className="bg-foreground/10 text-foreground hover:bg-foreground/20 transition-colors px-4 py-2 text-sm flex items-center gap-2 w-full justify-center md:justify-start">
                          <Trophy className="w-4 h-4" />
                          Hackathon Wins
                        </Badge>
                        <Badge className="bg-foreground/10 text-foreground hover:bg-foreground/20 transition-colors px-4 py-2 text-sm flex items-center gap-2 w-full justify-center md:justify-start">
                          <Medal className="w-4 h-4" />
                          Competition Awards
                        </Badge>
                        <Badge className="bg-foreground/10 text-foreground hover:bg-foreground/20 transition-colors px-4 py-2 text-sm flex items-center gap-2 w-full justify-center md:justify-start">
                          <Star className="w-4 h-4" />
                          Event Recognition
                        </Badge>
                      </div>
                    </div>

                    {/* Verification Process */}
                    <div className="space-y-6 md:border-l md:border-r border-foreground/10 md:px-8 border-t border-b md:border-t-0 md:border-b-0 py-8 md:py-0">
                      <h3 className="text-xl font-semibold text-foreground text-center md:text-left">Verification Process</h3>
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-sm font-medium text-foreground">1</div>
                          <p className="flex-1">Upload your project and achievements</p>
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-sm font-medium text-foreground">2</div>
                          <p className="flex-1">Organizers review and verify claims</p>
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-sm font-medium text-foreground">3</div>
                          <p className="flex-1">Receive official verification badges</p>
                        </div>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-6 pt-8 md:pt-0">
                      <h3 className="text-xl font-semibold text-foreground text-center md:text-left">Benefits</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded bg-foreground/10 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-foreground" />
                          </div>
                          <p className="text-muted-foreground text-sm flex-1">Official proof of participation and achievements</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded bg-foreground/10 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-foreground" />
                          </div>
                          <p className="text-muted-foreground text-sm flex-1">Enhanced visibility in the platform</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded bg-foreground/10 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-foreground" />
                          </div>
                          <p className="text-muted-foreground text-sm flex-1">Permanent record of your accomplishments</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* CTA Section */}
          <div className="mt-32 py-16 px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Ready to Showcase Your Projects?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join the community of innovative developers and start building your portfolio today
              </p>
              <div className="inline-block">
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center px-8 py-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-lg font-medium transition-all duration-200"
                >
                  <Rocket className="w-6 h-6 mr-3" />
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesShowcase;