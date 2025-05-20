
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from "@/components/ui/navigation-menu";

interface DesktopNavigationProps {
  navItems: Array<{ name: string; path: string }>;
  currentPath: string;
  isScrolled: boolean;
}

export const DesktopNavigation = ({ navItems, currentPath, isScrolled }: DesktopNavigationProps) => {
  return (
    <NavigationMenu className="flex">
      <NavigationMenuList className="gap-2">
        {navItems.map((item) => (
          <NavigationMenuItem key={item.path}>
            <NavigationMenuLink
              asChild
              className={cn(
                "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-300 pointer-events-auto",
                currentPath === item.path
                  ? isScrolled 
                    ? "text-white bg-white/20 shadow-sm shadow-purple-300/20" 
                    : "text-white bg-white/20 shadow-sm shadow-white/20"
                  : isScrolled
                    ? "text-white/90 hover:text-white hover:bg-white/10" 
                    : "text-white hover:text-white hover:bg-white/10 hover:scale-105"
              )}
            >
              <Link to={item.path}>{item.name}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
