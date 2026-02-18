import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Coins, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface HeaderProps {
  onNewApplication?: () => void;
}

export function Header({ onNewApplication }: HeaderProps) {
  const navigate = useNavigate();
  const { profile, signOut, user } = useAuth();
  const creditsUsed = 12;
  const totalCredits = 50;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-card">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo & Workspace */}
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => navigate('/dashboard')}
          >
            <div className="gradient-primary h-9 w-9 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold text-foreground">
                Supermoney Credit Intelligence
              </h1>
              <p className="text-xs text-muted-foreground">Enterprise Workspace</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Credits Indicator */}
          <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
            <Coins className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium text-foreground">
              {creditsUsed} of {totalCredits} Credits Used
            </span>
            <div className="ml-2 h-2 w-20 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full gradient-accent transition-all"
                style={{ width: `${(creditsUsed / totalCredits) * 100}%` }}
              />
            </div>
          </div>

          {/* New Application Button */}
          <Button
            onClick={onNewApplication}
            className="gradient-accent text-accent-foreground shadow-md hover:shadow-lg transition-shadow"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback className="gradient-primary text-primary-foreground text-sm">
                    {profile?.full_name ? getInitials(profile.full_name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-foreground">{profile?.full_name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{profile?.designation || 'Credit Analyst'}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-border">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const admins = ['yashdjain1824@gmail.com', 'harilalar1987@gmail.com'];
                  const email = (user?.email || '').toLowerCase();
                  if (admins.includes(email)) {
                    // Navigate to settings
                    // Using window.location to avoid circular hook issues inside dropdown item
                    window.location.href = '/settings';
                  } else {
                    toast.error('This is available only for admin');
                  }
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
