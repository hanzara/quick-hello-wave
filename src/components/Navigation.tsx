
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAuth } from '@/hooks/useAuth';
import AuthModal from './AuthModal';
import LanguageSelector from './LanguageSelector';
import NotificationCenter from './NotificationCenter';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Users, TrendingUp, Plus, LogOut, Bell, CreditCard, Vote, Smartphone, 
  ArrowLeftRight, Shield, Coins, Brain, Wallet, User, HelpCircle, 
  ChevronDown, Target, BookOpen, MessageSquare, Building2, Settings
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/hooks/useNotifications';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const { notifications } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItemClass = (path: string) => 
    `flex items-center gap-2 transition-colors ${isActive(path) 
      ? 'text-primary' 
      : 'text-muted-foreground hover:text-primary'
    }`;

  return (
    <>
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div 
                className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate('/')}
              >
                ChamaVault
              </div>
              
              {user && (
                <div className="hidden md:flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/')}
                    className={navItemClass('/')}
                  >
                    <Home className="h-4 w-4" />
                    {t('nav.home', 'Home')}
                  </Button>

                  {/* AI Navigator */}
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className={navItemClass('/financial-navigator')}>
                          <Brain className="h-4 w-4" />
                          AI Navigator
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            <div className="row-span-3">
                              <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                                <Brain className="h-6 w-6" />
                                <div className="mb-2 mt-4 text-lg font-medium">
                                  AI Financial Navigator
                                </div>
                                <p className="text-sm leading-tight text-muted-foreground">
                                  Advanced AI-powered financial insights and predictions
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/financial-navigator')}
                              className="justify-start"
                            >
                              <Target className="mr-2 h-4 w-4" />
                              Dashboard
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/cash-flow-predictor')}
                              className="justify-start"
                            >
                              <TrendingUp className="mr-2 h-4 w-4" />
                              Cash Flow Predictor
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/financial-health')}
                              className="justify-start"
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Health Score
                            </Button>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>

                  {/* Advanced Lending */}
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className={navItemClass('/adaptive-credit')}>
                          <CreditCard className="h-4 w-4" />
                          Smart Lending
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/adaptive-credit')}
                              className="justify-start"
                            >
                              <Brain className="mr-2 h-4 w-4" />
                              Adaptive Credit Lab
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/loans')}
                              className="justify-start"
                            >
                              <CreditCard className="mr-2 h-4 w-4" />
                              Traditional Loans
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/blockchain-lending')}
                              className="justify-start"
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              DeFi Loans
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/asset-financing')}
                              className="justify-start"
                            >
                              <Coins className="mr-2 h-4 w-4" />
                              Asset Financing
                            </Button>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>

                  {/* Smart Wallet */}
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/smart-wallet')}
                    className={navItemClass('/smart-wallet')}
                  >
                    <Wallet className="h-4 w-4" />
                    Smart Wallet
                  </Button>

                  {/* Chama Features */}
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className={navItemClass('/chamas')}>
                          <Users className="h-4 w-4" />
                          Chamas
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/chamas')}
                              className="justify-start"
                            >
                              <Users className="mr-2 h-4 w-4" />
                              My Chamas
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/create-chama')}
                              className="justify-start"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Create Chama
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/make-contribution')}
                              className="justify-start"
                            >
                              <CreditCard className="mr-2 h-4 w-4" />
                              Contribute
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/voting')}
                              className="justify-start"
                            >
                              <Vote className="mr-2 h-4 w-4" />
                              Voting
                            </Button>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>

                  {/* Trading & Investment */}
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className={navItemClass('/p2p-trading')}>
                          <ArrowLeftRight className="h-4 w-4" />
                          Trading
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/p2p-trading')}
                              className="justify-start"
                            >
                              <ArrowLeftRight className="mr-2 h-4 w-4" />
                              P2P Trading
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/staking')}
                              className="justify-start"
                            >
                              <Coins className="mr-2 h-4 w-4" />
                              Staking
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/investments')}
                              className="justify-start"
                            >
                              <TrendingUp className="mr-2 h-4 w-4" />
                              Investments
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/mobile-money')}
                              className="justify-start"
                            >
                              <Smartphone className="mr-2 h-4 w-4" />
                              Mobile Money
                            </Button>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>

                  {/* Analytics */}
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/analytics')}
                    className={navItemClass('/analytics')}
                  >
                    <TrendingUp className="h-4 w-4" />
                    {t('nav.analytics', 'Analytics')}
                  </Button>

                  {/* Community Hub */}
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/community-hub')}
                    className={navItemClass('/community-hub')}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Community
                  </Button>

                  {/* Admin Portal */}
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/admin-portal')}
                    className={navItemClass('/admin-portal')}
                  >
                    <Settings className="h-4 w-4" />
                    Admin Portal
                  </Button>

                  {/* Bank Portal */}
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/bank-portal')}
                    className={navItemClass('/bank-portal')}
                  >
                    <Building2 className="h-4 w-4" />
                    Bank Portal
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSelector />
              
              {user ? (
                <div className="flex items-center space-x-4">
                  {/* Notification Bell */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setNotificationOpen(true)}
                    className="relative"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                  
                  <span className="text-sm text-gray-600">
                    {t('nav.welcome', 'Welcome')}, {user.email?.split('@')[0]}
                  </span>
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('nav.signOut', 'Sign Out')}
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setAuthModalOpen(true)}
                  >
                    {t('nav.signIn', 'Sign In')}
                  </Button>
                  <AuthModal 
                    open={authModalOpen} 
                    onOpenChange={setAuthModalOpen} 
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <NotificationCenter 
        isOpen={notificationOpen} 
        onClose={() => setNotificationOpen(false)} 
      />
    </>
  );
};

export default Navigation;
