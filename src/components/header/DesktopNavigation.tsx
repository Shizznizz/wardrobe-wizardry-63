
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
}

export const DesktopNavigation = ({ navItems, currentPath }: DesktopNavigationProps) => {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-2">
        {navItems.map((item) => (
          <NavigationMenuItem key={item.path}>
            <NavigationMenuLink
              asChild
              className={cn(
                "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                currentPath === item.path
                  ? "text-accent bg-accent/10"
                  : "text-muted-foreground hover:text-accent hover:bg-accent/10"
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
