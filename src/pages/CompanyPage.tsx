import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Users, Wallet, TrendingUp, Star, CheckCircle } from "lucide-react";
import chamaHeroImage from "@/assets/chama-hero.jpg";
import walletFeatureImage from "@/assets/wallet-feature.jpg";
import communitySuccessImage from "@/assets/community-success.jpg";
import chamaMeetingImage from "@/assets/chama-meeting.jpg";
import mobileMoneyImage from "@/assets/mobile-money.jpg";
import financialSuccessImage from "@/assets/financial-success.jpg";
import teamWorkspaceImage from "@/assets/team-workspace.jpg";

const CompanyPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Wallet className="h-8 w-8" />,
      title: "Digital Wallets",
      description: "Connect M-Pesa, Airtel Money, and bank accounts for seamless financial integration."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Group Savings & Merry-Go-Round",
      description: "Automate contributions, manage group savings, and handle rotating credit associations."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Loan Management",
      description: "Apply, approve, and disburse loans digitally with AI-powered credit assessments."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Transparency & Analytics",
      description: "Real-time reports visible to all members with comprehensive financial tracking."
    }
  ];

  const additionalFeatures = [
    "AI Credit Scoring for member trustworthiness assessment",
    "Investor Access for verified Chamas to raise external funds",
    "Mobile App & Web App accessible anytime, anywhere",
    "Automated compliance and audit trails",
    "Multi-language support for diverse communities",
    "Real-time notifications and alerts"
  ];

  const businessModel = [
    {
      title: "Freemium & Premium Subscriptions",
      description: "Basic features free, advanced tools for premium members"
    },
    {
      title: "Transaction Fees",
      description: "Small fees on withdrawals, contributions, and investments"
    },
    {
      title: "Data Analytics",
      description: "Insights and reporting services (with user consent)"
    },
    {
      title: "Strategic Partnerships",
      description: "Collaborations with banks, SACCOs, and institutional investors"
    }
  ];

  const teamMembers = [
    {
      name: "Harun Nzai Randu",
      role: "CEO & Co-Founder",
      bio: "Former banking executive with 10+ years in African financial services"
    },
    {
      name: "David Mwangi",
      role: "CTO & Co-Founder", 
      bio: "Software architect specializing in fintech and mobile payment systems"
    },
    {
      name: "Grace Wanjiku",
      role: "Product Lead",
      bio: "UX expert focused on financial inclusion and community-driven design"
    },
    {
      name: "Michael Ochieng",
      role: "Head of Operations",
      bio: "Operations specialist with deep knowledge of Chama culture and practices"
    }
  ];

  const benefits = [
    "Mobile-first design for easy access anywhere",
    "Integrated M-Pesa and mobile money support",
    "Transparent contribution tracking",
    "Automated payout systems",
    "Real-time financial analytics",
    "Community networking features"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">ChamaWallet</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/auth")}
                className="text-foreground hover:text-primary"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Star className="h-3 w-3 mr-1" />
                  Trusted by 100+ Active Chamas
                </Badge>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Digitizing Africa's
                  <span className="text-primary block">Grassroots</span>
                  Savings Culture
                </h1>
                
                <p className="text-lg text-muted-foreground max-w-lg">
                  Empowering communities by transforming Chamas into secure, transparent, 
                  and scalable digital financial ecosystems across Africa.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground px-8"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate("/auth")}
                  className="border-border hover:border-primary hover:text-primary"
                >
                  Request Demo
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src={chamaHeroImage} 
                  alt="Chama group savings" 
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Overview Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              About ChamaWallet
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Founded in 2025 and headquartered in Mombasa, Kenya, we're transforming Africa's traditional savings groups into modern digital financial ecosystems.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-8">
              <div className="grid md:grid-cols-1 gap-6">
                <Card className="border-border bg-background/50 backdrop-blur-sm text-center p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Our Mission</h3>
                  <p className="text-muted-foreground">
                    We empower communities by transforming Chamas into secure, transparent, and scalable digital financial ecosystems.
                  </p>
                </Card>
                
                <Card className="border-border bg-background/50 backdrop-blur-sm text-center p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Our Vision</h3>
                  <p className="text-muted-foreground">
                    To become Africa's leading platform for group savings, lending, and financial inclusion.
                  </p>
                </Card>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={chamaMeetingImage} 
                alt="Chama group meeting" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-2xl -z-10"></div>
            </div>
          </div>

          <div className="text-center">
            <Card className="border-border bg-background/50 backdrop-blur-sm p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-foreground mb-4">Industry Focus</h3>
              <p className="text-muted-foreground">
                FinTech / Financial Services with emphasis on community-driven financial solutions.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Everything You Need for Group Savings
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools your chama needs to thrive
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="border-border hover:border-primary/50 transition-colors bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile Money Integration Showcase */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <img 
                src={mobileMoneyImage} 
                alt="Mobile money integration" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-2xl -z-10"></div>
            </div>
            
            <div className="space-y-6 order-1 lg:order-2">
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                Seamless Mobile Money Integration
              </h3>
              <p className="text-lg text-muted-foreground">
                Connect effortlessly with M-Pesa, Airtel Money, and major banks. 
                Make contributions and withdrawals with just a few taps on your phone.
              </p>
              <div className="space-y-3">
                {benefits.slice(0, 3).map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Advanced Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed specifically for African financial communities
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-background/50 rounded-lg border border-border">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Traction & Impact Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Our Impact
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Addressing Africa's financial inclusion challenge with digital-first solutions
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-8">
              <div className="grid md:grid-cols-1 gap-6">
                <div className="text-center space-y-4 p-6 bg-background/50 rounded-xl border border-border">
                  <div className="text-4xl font-bold text-primary">100+</div>
                  <div className="text-xl font-semibold text-foreground">Active Chamas</div>
                  <div className="text-muted-foreground">Successfully onboarded in beta phase</div>
                </div>
                
                <div className="text-center space-y-4 p-6 bg-background/50 rounded-xl border border-border">
                  <div className="text-4xl font-bold text-primary">80%+</div>
                  <div className="text-xl font-semibold text-foreground">Market Need</div>
                  <div className="text-muted-foreground">Of Africans rely on informal finance systems</div>
                </div>
                
                <div className="text-center space-y-4 p-6 bg-background/50 rounded-xl border border-border">
                  <div className="text-4xl font-bold text-primary">5+</div>
                  <div className="text-xl font-semibold text-foreground">Countries</div>
                  <div className="text-muted-foreground">Planned for regional expansion</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={financialSuccessImage} 
                alt="Community financial success" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Model Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              How We Generate Revenue
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sustainable business model designed to scale with our community
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {businessModel.map((model, index) => (
              <Card key={index} className="border-border hover:border-primary/50 transition-colors bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">{model.title}</h3>
                  <p className="text-muted-foreground">{model.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experienced professionals dedicated to transforming African finance
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative">
              <img 
                src={teamWorkspaceImage} 
                alt="Team workspace" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-2xl -z-10"></div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                Building the Future of Finance
              </h3>
              <p className="text-lg text-muted-foreground">
                Our diverse team combines deep financial expertise with cutting-edge technology 
                to create solutions that truly serve African communities.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-border bg-background/50 backdrop-blur-sm text-center">
                <CardContent className="p-6 space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full mx-auto flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                    <p className="text-primary font-medium">{member.role}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Ready to Transform Your Chama?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of groups already using ChamaWallet to manage their savings, 
              track contributions, and achieve their financial goals together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground px-8"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/auth")}
                className="border-border hover:border-primary hover:text-primary"
              >
                Login to Your Account
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-border">
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-2">For Partnerships</h3>
                <p className="text-sm text-muted-foreground">partnerships@chamawallet.com</p>
              </div>
              
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-2">For Investors</h3>
                <p className="text-sm text-muted-foreground">investors@chamawallet.com</p>
              </div>
              
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-2">General Inquiries</h3>
                <p className="text-sm text-muted-foreground">hello@chamawallet.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-primary to-primary/80 rounded flex items-center justify-center">
                <Wallet className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">ChamaWallet</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2024 ChamaWallet. Empowering communities through smart savings.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CompanyPage;