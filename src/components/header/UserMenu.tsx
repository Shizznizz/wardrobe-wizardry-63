
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
          "ml-2 transition-all duration-300 pointer-events-auto",
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
            "ml-2 rounded-full transition-all duration-300 z-[51] pointer-events-auto", // Increased z-index
            isScrolled 
              ? "text-white hover:bg-white/10" 
              : "text-white hover:bg-white/10"
          )}
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg text-slate-800 rounded-lg py-2 font-medium z-[60]" // Higher z-index
        style={{ boxShadow: "0px 2px 12px rgba(0,0,0,0.15)" }}
      >
        <DropdownMenuItem asChild className="hover:bg-slate-100 hover:text-purple-700 font-medium cursor-pointer px-4 py-2.5">
          <Link to="/profile">My Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-200/70 mx-2" />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 hover:bg-red-50 hover:text-red-700 font-medium cursor-pointer px-4 py-2.5">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
