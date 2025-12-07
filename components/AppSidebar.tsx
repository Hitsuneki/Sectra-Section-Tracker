'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  ClipboardList, 
  TrendingUp,
  Settings,
  GraduationCap,
  LogOut,
  Megaphone,
  BookOpen,
  Calendar,
  BarChart3,
  FileText,
  ClipboardCheck,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Sections', href: '/sections', icon: FolderKanban },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Tasks', href: '/tasks', icon: ClipboardList },
  { name: 'Progress', href: '/progress', icon: TrendingUp },
  { name: 'Announcements', href: '/announcements', icon: Megaphone },
  { name: 'Gradebook', href: '/gradebook', icon: BookOpen },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Submissions', href: '/submissions', icon: FileText },
  { name: 'Attendance', href: '/attendance', icon: ClipboardCheck },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <GraduationCap className="h-6 w-6" />
          <span className="text-heading-3 font-bold">SECTRA</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-label transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4 space-y-3">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium">{user?.name || 'Teacher'}</p>
            <p className="truncate">{user?.email}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}