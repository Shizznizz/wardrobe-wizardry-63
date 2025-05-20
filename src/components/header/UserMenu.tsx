
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  isScrolled?: boolean;
}

export function UserMenu({ isScrolled = false }: UserMenuProps) {
  const { user, signOut, isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  if (!isAuthenticated) return null;

  // Get first letter of email for avatar fallback
  const getAvatarFallback = () => {
    if (!user?.email) return "?";
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9 border border-white/20">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
              {getAvatarFallback()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className={cn(
          "w-56 bg-slate-800 border border-slate-700 text-white",
          "shadow-lg shadow-black/25",
          "rounded-lg overflow-hidden"
        )}
        sideOffset={8}
      >
        <div className="px-4 py-2 text-sm font-medium text-slate-300 border-b border-slate-700">
          {user?.email}
        </div>
        <div className="p-2">
          <DropdownMenuItem asChild className="cursor-pointer hover:bg-slate-700/70 focus:bg-slate-700/70 rounded-md font-medium p-2 my-1">
            <Link to="/profile" className="flex items-center gap-2 w-full">
              <User className="w-4 h-4" />
              My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleSignOut} 
            className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-slate-700/70 focus:bg-slate-700/70 font-medium rounded-md p-2 my-1"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;
