
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

export function UserMenu() {
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
        className="w-48 bg-slate-800 border border-slate-700 shadow-lg shadow-black/25 text-white"
        sideOffset={8}
      >
        <div className="px-2 py-1.5 text-sm font-medium text-slate-400">
          {user?.email}
        </div>
        <DropdownMenuSeparator className="bg-slate-700" />
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-slate-700 focus:bg-slate-700 font-medium">
          <Link to="/profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-700" />
        <DropdownMenuItem 
          onClick={handleSignOut} 
          className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-slate-700 focus:bg-slate-700 font-medium"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;
