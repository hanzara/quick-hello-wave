import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Home, Users, TrendingUp, Wallet, Calculator, 
  PiggyBank, Smartphone, Award, BarChart3, 
  Building2, Shield, ChevronLeft, ChevronRight,
  CreditCard, Target, HandCoins, Gamepad2,
  BookOpen, Settings, LogOut, Menu, Handshake,
  ChevronDown, ChevronUp, Brain
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const VerticalNavigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<{[key: string]: boolean}>({});

  // Auto-collapse on mobile and set initial state
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  const navigationItems = [
    {
      title: 'Home',
      icon: Home,
      path: '/',
      badge: null,
    },
    {
      title: 'Chamas',
      icon: Users,
      path: '/chamas',
      badge: '2',
      subItems: [
        { title: 'My Chamas', path: '/chamas' },
        { title: 'Create Chama', path: '/create-chama' },
        { title: 'Join Chama', path: '/join-chama' },
        { title: 'Advanced Features', path: '/advanced-chama' },
      ]
    },
    {
      title: 'Investments',
      icon: TrendingUp,
      path: '/investment',
      badge: null,
      subItems: [
        { title: 'Portfolio', path: '/investment' },
        { title: 'Staking', path: '/staking' },
        { title: 'P2P Trading', path: '/p2p-trading' },
      ]
    },
    {
      title: 'Wallets',
      icon: Wallet,
      path: '/smart-wallet',
      badge: 'New',
      subItems: [
        { title: 'Smart Wallet', path: '/smart-wallet' },
        { title: 'Mobile Money', path: '/mobile-money' },
        { title: 'Personal Savings', path: '/personal-savings' },
      ]
    },
    {
      title: 'Loans',
      icon: HandCoins,
      path: '/loan-management',
      badge: null,
      subItems: [
        { title: 'My Loans', path: '/loan-management' },
        { title: 'Adaptive Credit', path: '/adaptive-credit' },
        { title: 'Blockchain Lending', path: '/blockchain-lending' },
      ]
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      badge: null,
    },
    {
      title: 'Community',
      icon: Award,
      path: '/community-hub',
      badge: null,
      subItems: [
        { title: 'Community Hub', path: '/community-hub' },
        { title: 'Voting System', path: '/voting-system' },
        { title: 'Financial Navigator', path: '/financial-navigator' },
      ]
    },
    {
      title: 'Smart Finance',
      icon: Brain,
      path: '/smart-finance',
      badge: 'AI',
      subItems: [
        { title: 'AI Advisor', path: '/smart-finance' },
        { title: 'Smart Tracker', path: '/smart-finance?tab=tracker' },
        { title: 'Financial Goals', path: '/smart-finance?tab=goals' },
        { title: 'AI Suggestions', path: '/smart-finance?tab=suggestions' },
        { title: 'Learn Money', path: '/smart-finance?tab=learn' },
      ]
    },
    {
      title: 'Partner Dashboard',
      icon: Handshake,
      path: '/partner-dashboard',
      badge: 'Partner',
      requiresAuth: true,
    },
    {
      title: 'Admin Portal',
      icon: Shield,
      path: '/admin-portal',
      badge: 'Admin',
      requiresAuth: true,
    },
    {
      title: 'Bank Portal',
      icon: Building2,
      path: '/bank-portal',
      badge: 'Bank',
      requiresAuth: true,
    },
    {
      title: 'Trivia Game',
      icon: Gamepad2,
      path: '/trivia-game',
      badge: 'Fun',
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const hasActiveSubItem = (subItems: any[]) => {
    return subItems?.some(item => isActivePath(item.path));
  };

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
      
      <div className={`h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-50 ${
        isMobile 
          ? `fixed left-0 top-0 ${isCollapsed ? '-translate-x-full w-0' : 'translate-x-0 w-64'}` 
          : isCollapsed 
            ? 'w-16' 
            : 'w-64'
      }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <PiggyBank className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Chama Circle
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : (isMobile ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />)}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          {navigationItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = isActivePath(item.path) || (item.subItems && hasActiveSubItem(item.subItems));
            const isGroupOpen = openGroups[item.title] || isActive;
            
            return (
              <div key={index} className="space-y-1">
                {item.subItems ? (
                  <Collapsible open={isGroupOpen} onOpenChange={() => toggleGroup(item.title)}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50 ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <IconComponent className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-left">{item.title}</span>
                            <div className="flex items-center gap-2">
                              {item.badge && (
                                <Badge 
                                  variant={item.badge === 'Admin' || item.badge === 'Bank' ? 'destructive' : 'secondary'}
                                  className="text-xs"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                              {isGroupOpen ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </div>
                          </>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    
                    {!isCollapsed && (
                      <CollapsibleContent className="space-y-1">
                        <div className="ml-8 space-y-1 pt-2">
                          {item.subItems.map((subItem, subIndex) => (
                            <NavLink
                              key={subIndex}
                              to={subItem.path}
                              className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                isActivePath(subItem.path)
                                  ? 'text-blue-700 bg-blue-100 font-medium border-l-2 border-blue-500'
                                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {subItem.title}
                            </NavLink>
                          ))}
                        </div>
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                ) : (
                  <NavLink
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <Badge 
                            variant={item.badge === 'Admin' || item.badge === 'Bank' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </NavLink>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User Profile & Sign Out */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && user && (
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500">Active User</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        )}
        {isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
      </div>

      {/* Mobile Toggle Button - Always Visible */}
      {isMobile && isCollapsed && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          className="fixed top-4 left-4 z-50 bg-white shadow-lg border-gray-300"
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}
    </>
  );
};

export default VerticalNavigation;
