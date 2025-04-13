
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Menu, MessageCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notificationsCount] = useState(3);
  const [messagesCount] = useState(2);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Button variant="ghost" size="icon" className="sm:hidden" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      <div className="flex-1 md:grow-0 md:w-72">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[240px] lg:w-[340px]"
            />
          </div>
        </form>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/dashboard/messages')}>
          <MessageCircle className="h-5 w-5" />
          {messagesCount > 0 && (
            <Badge variant="destructive" className="absolute -right-0.5 -top-0.5 h-4 w-4 p-0 flex items-center justify-center">
              {messagesCount}
            </Badge>
          )}
        </Button> */}

        <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/dashboard/announcements')}>
          <Bell className="h-5 w-5" />
          {notificationsCount > 0 && (
            <Badge variant="destructive" className="absolute -right-0.5 -top-0.5 h-4 w-4 p-0 flex items-center justify-center">
              {notificationsCount}
            </Badge>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profilePicture} alt={user?.name || ""} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
              Profile
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator /> */}
            <DropdownMenuItem onClick={logout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
