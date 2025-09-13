
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SubNavItem {
  title: string;
  path: string;
  badge?: string;
  description?: string;
}

interface HorizontalSubNavProps {
  items: SubNavItem[];
  title?: string;
}

const HorizontalSubNav: React.FC<HorizontalSubNavProps> = ({ items, title }) => {
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      {title && (
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      )}
      <ScrollArea className="w-full">
        <div className="flex space-x-1 min-w-max">
          {items.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActivePath(item.path)
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span>{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HorizontalSubNav;
