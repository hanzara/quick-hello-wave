import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TopNavigation } from "@/components/TopNavigation";
import { Footer } from "@/components/Footer";
import { 
  ArrowRight, 
  Users,
  Globe,
  Shield,
  Award,
  Heart,
  Zap,
  Target,
  Building,
  MapPin,
  Calendar,
  TrendingUp,
  CheckCircle
} from "lucide-react";
import companyImage from "@/assets/company-about.jpg";
import globalPaymentsImage from "@/assets/global-payments.jpg";
import securityImage from "@/assets/security-shield.jpg";

const CompanyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-dashboard overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                  About Universal Pay
                </h1>
                <p className="text-xl text-white/90 leading-relaxed max-w-2xl">
                  We're building the future of global payments. One platform to connect 
                  the world's financial systems and make payments truly universal.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild className="text-lg px-8 py-4">
                  <Link to="/auth">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Link to="/auth">
                    Log In
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={companyImage} 
                alt="Universal Pay Company" 
                className="rounded-2xl shadow-2xl border border-white/20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Mission</h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  To democratize global payments by creating a universal platform that connects 
                  every payment method, currency, and financial system worldwide. We believe 
                  that moving money should be as simple as sending a message.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-gradient-card border-primary/20">
                  <Globe className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Global Reach</h3>
                  <p className="text-sm text-muted-foreground">
                    Supporting 180+ currencies and 200+ payment methods across 50+ countries.
                  </p>
                </Card>
                
                <Card className="p-6 bg-gradient-card border-primary/20">
                  <Zap className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Innovation First</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered routing and cutting-edge technology to optimize every transaction.
                  </p>
                </Card>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Vision</h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  A world where payments flow seamlessly across borders, currencies, and 
                  platforms. Where businesses can focus on growth while we handle the 
                  complexity of global payment infrastructure.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-gradient-card border-primary/20">
                  <Shield className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Trust & Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Bank-grade security with PCI DSS Level 1 compliance and fraud protection.
                  </p>
                </Card>
                
                <Card className="p-6 bg-gradient-card border-primary/20">
                  <Heart className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Customer Success</h3>
                  <p className="text-sm text-muted-foreground">
                    Dedicated to helping businesses succeed with world-class support.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">By the Numbers</h2>
            <p className="text-xl text-muted-foreground">
              Our growth reflects the trust businesses place in Universal Pay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-8">
              <div className="text-4xl font-bold text-primary mb-2">$5B+</div>
              <div className="text-muted-foreground">Payment Volume Processed</div>
              <div className="text-sm text-green-500 mt-2">+250% YoY growth</div>
            </Card>
            
            <Card className="text-center p-8">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Active Businesses</div>
              <div className="text-sm text-green-500 mt-2">From 50+ countries</div>
            </Card>
            
            <Card className="text-center p-8">
              <div className="text-4xl font-bold text-primary mb-2">99.99%</div>
              <div className="text-muted-foreground">Platform Uptime</div>
              <div className="text-sm text-green-500 mt-2">SLA guaranteed</div>
            </Card>
            
            <Card className="text-center p-8">
              <div className="text-4xl font-bold text-primary mb-2">200+</div>
              <div className="text-muted-foreground">Payment Methods</div>
              <div className="text-sm text-green-500 mt-2">And growing</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Team & Culture */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Team</h2>
              <p className="text-xl text-muted-foreground mb-8">
                We're a diverse team of payment experts, engineers, and innovators 
                from around the world, united by a shared mission to revolutionize global payments.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Global Expertise</h3>
                    <p className="text-muted-foreground text-sm">
                      Team members from leading fintech companies across North America, Europe, Africa, and Asia.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Customer-Focused</h3>
                    <p className="text-muted-foreground text-sm">
                      Every decision we make is driven by what's best for our customers and their success.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Innovation Culture</h3>
                    <p className="text-muted-foreground text-sm">
                      We continuously push the boundaries of what's possible in payments technology.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={globalPaymentsImage} 
                alt="Our Team" 
                className="rounded-2xl shadow-xl border border-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground">
              Key milestones in building the universal payment platform
            </p>
          </div>

          <div className="space-y-8">
            <Card className="p-8">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold">2020 - Founded</h3>
                    <Badge variant="secondary">Origin</Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Universal Pay was founded with the vision of creating a truly universal payment platform 
                    that could connect all payment methods and currencies worldwide.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold">2021 - Series A</h3>
                    <Badge variant="secondary">Growth</Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Raised $15M Series A to expand our team and build the core platform infrastructure. 
                    Launched our first API endpoints and processed our first million in payments.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold">2022 - Global Expansion</h3>
                    <Badge variant="secondary">Scale</Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Expanded to support mobile money across Africa, cryptocurrency payments, 
                    and launched our AI-powered SmartRoute technology.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold">2023 - Recognition</h3>
                    <Badge variant="secondary">Achievement</Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Named "Fintech Company of the Year" and achieved PCI DSS Level 1 compliance. 
                    Processed over $1B in payment volume with 99.99% uptime.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold">2024 - AI Revolution</h3>
                    <Badge variant="secondary">Innovation</Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Launched advanced AI capabilities including intelligent routing, fraud detection, 
                    and automated payment optimization. Now processing $5B+ annually.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 text-center bg-gradient-card border-primary/20 shadow-glow hover:shadow-glow/50 transition-all">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Trust & Security</h3>
              <p className="text-muted-foreground">
                We protect every transaction with bank-grade security and maintain the highest standards of compliance.
              </p>
            </Card>

            <Card className="p-8 text-center bg-gradient-card border-primary/20 shadow-glow hover:shadow-glow/50 transition-all">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Customer Success</h3>
              <p className="text-muted-foreground">
                Our customers' success is our success. We're committed to providing exceptional support and service.
              </p>
            </Card>

            <Card className="p-8 text-center bg-gradient-card border-primary/20 shadow-glow hover:shadow-glow/50 transition-all">
              <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously innovate to solve complex payment challenges and create new possibilities.
              </p>
            </Card>

            <Card className="p-8 text-center bg-gradient-card border-primary/20 shadow-glow hover:shadow-glow/50 transition-all">
              <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Global Impact</h3>
              <p className="text-muted-foreground">
                We're building infrastructure that empowers businesses worldwide to participate in the global economy.
              </p>
            </Card>

            <Card className="p-8 text-center bg-gradient-card border-primary/20 shadow-glow hover:shadow-glow/50 transition-all">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Transparency</h3>
              <p className="text-muted-foreground">
                We believe in clear communication, honest pricing, and transparent business practices.
              </p>
            </Card>

            <Card className="p-8 text-center bg-gradient-card border-primary/20 shadow-glow hover:shadow-glow/50 transition-all">
              <Target className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-muted-foreground">
                We strive for excellence in everything we do, from code quality to customer experience.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Global Presence</h2>
            <p className="text-xl text-muted-foreground">
              Our offices around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">San Francisco, USA</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-2">Headquarters</p>
              <p className="text-muted-foreground text-sm">
                100 California Street, Suite 700<br />
                San Francisco, CA 94108
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">London, UK</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-2">European Operations</p>
              <p className="text-muted-foreground text-sm">
                1 King William Street<br />
                London EC4N 7AF
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">Lagos, Nigeria</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-2">African Hub</p>
              <p className="text-muted-foreground text-sm">
                Victoria Island<br />
                Lagos, Nigeria
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-dashboard">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Join the Universal Pay revolution
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Be part of the future of global payments. Start building with Universal Pay today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-4">
              <Link to="/auth">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link to="/auth">
                Log In
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CompanyPage;