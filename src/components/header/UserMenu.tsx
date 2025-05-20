import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  isScrolled?: boolean;
}

export const UserMenu = ({ isScrolled = false }: UserMenuProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      // Keep error toast as it's an exception scenario
    }
  };

  if (!user) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        asChild 
        className={cn(
          "ml-2 transition-all duration-300",
          isScrolled 
            ? "bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white" 
            : "bg-white/10 border-white/20 text-white hover:bg-white/20"
        )}
      >
        <Link to="/auth">Sign In</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "ml-2 rounded-full transition-all duration-300 z-[50]",
            isScrolled 
              ? "text-white hover:bg-white/10" 
              : "text-white hover:bg-white/10"
          )}
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-lg">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="hover:bg-accent/5 hover:text-accent cursor-pointer">
          <Link to="/profile">My Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
