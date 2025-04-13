
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Bell, 
  Bookmark, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  ClipboardCheck, 
  CreditCard, 
  FileText, 
  GraduationCap, 
  Home, 
  LayoutDashboard, 
  LineChart, 
  LogOut, 
  MessageCircle, 
  School, 
  Settings, 
  Star, 
  User, 
  Users,
  Zap,
  Code,
  BookOpen,
  PieChart,
  Award,
  Briefcase,
  Bus,
  Heart,
  Scroll,
  Lightbulb,
  Headphones,
  PenTool,
  FilePlus
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  studentOnly?: boolean;
  facultyOnly?: boolean;
  adminOnly?: boolean;
}

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [section, setSection] = useState<'menu' | 'settings'>('menu');

  // Common menu items for all users
  const commonMenuItems: SidebarItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    // { name: 'Messages', path: '/dashboard/messages', icon: <MessageCircle className="h-5 w-5" /> },
    { name: 'Profile', path: '/dashboard/profile', icon: <User className="h-5 w-5" /> },
    // { name: 'Settings', path: '/dashboard/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  // Student-specific menu items
  const studentMenuItems: SidebarItem[] = [
    // { name: 'My Institution', path: '/dashboard/institution', icon: <School className="h-5 w-5" />, studentOnly: true },
    //{ name: 'Attendance', path: '/dashboard/attendance', icon: <ClipboardCheck className="h-5 w-5" />, studentOnly: true },
    //{ name: 'Assignments', path: '/dashboard/assignments', icon: <FileText className="h-5 w-5" />, studentOnly: true },
    { name: 'Exam Schedules', path: '/dashboard/exams', icon: <Calendar className="h-5 w-5" />, studentOnly: true },
    { name: 'Reports', path: '/dashboard/reports', icon: <LineChart className="h-5 w-5" />, studentOnly: true },
    { name: 'Assessments', path: '/dashboard/assessments', icon: <Bookmark className="h-5 w-5" />, studentOnly: true },
    { name: 'Holidays', path: '/dashboard/holidays', icon: <Calendar className="h-5 w-5" />, studentOnly: true },
    { name: 'Timetable', path: '/dashboard/timetable', icon: <Calendar className="h-5 w-5" />, studentOnly: true },
    // { name: 'Leave', path: '/dashboard/leave', icon: <FileText className="h-5 w-5" />, studentOnly: true },
    // { name: 'Billing', path: '/dashboard/billing', icon: <CreditCard className="h-5 w-5" />, studentOnly: true },
    // { name: 'Counselling', path: '/dashboard/counselling', icon: <Heart className="h-5 w-5" />, studentOnly: true },
    // { name: 'Enrollment', path: '/dashboard/enrollment', icon: <Scroll className="h-5 w-5" />, studentOnly: true },
    // { name: 'Clearance', path: '/dashboard/clearance', icon: <Award className="h-5 w-5" />, studentOnly: true },
    { name: 'Announcements', path: '/dashboard/announcements', icon: <Bell className="h-5 w-5" />, studentOnly: true },
    // { name: 'Feedback', path: '/dashboard/feedback', icon: <PenTool className="h-5 w-5" />, studentOnly: true },
    { name: 'Results', path: '/dashboard/results', icon: <Star className="h-5 w-5" />, studentOnly: true },
    // { name: 'Revaluation', path: '/dashboard/revaluation', icon: <FilePlus className="h-5 w-5" />, studentOnly: true },
    { name: 'Transport', path: '/dashboard/transport', icon: <Bus className="h-5 w-5" />, studentOnly: true },
    { name: 'AI Assistant', path: '/dashboard/ai-assistant', icon: <Zap className="h-5 w-5" />, studentOnly: true },
    { name: 'Code Studio', path: '/dashboard/code-studio', icon: <Code className="h-5 w-5" />, studentOnly: true },
  ];

  // Faculty-specific menu items
  const facultyMenuItems: SidebarItem[] = [
    { name: 'Course Management', path: '/dashboard/courses', icon: <BookOpen className="h-5 w-5" />, facultyOnly: true },
    { name: 'Attendance Management', path: '/dashboard/attendance-management', icon: <ClipboardCheck className="h-5 w-5" />, facultyOnly: true },
    // { name: 'Gradebook', path: '/dashboard/gradebook', icon: <Star className="h-5 w-5" />, facultyOnly: true },
    { name: 'Assignment Management', path: '/dashboard/assignments-management', icon: <FileText className="h-5 w-5" />, facultyOnly: true },
    // { name: 'Student Analytics', path: '/dashboard/student-analytics', icon: <PieChart className="h-5 w-5" />, facultyOnly: true },
    // { name: 'Communication', path: '/dashboard/communication', icon: <MessageCircle className="h-5 w-5" />, facultyOnly: true },
    // { name: 'Advising Tools', path: '/dashboard/advising', icon: <Lightbulb className="h-5 w-5" />, facultyOnly: true },
    // { name: 'Research', path: '/dashboard/research', icon: <Bookmark className="h-5 w-5" />, facultyOnly: true },
    // { name: 'Departmental', path: '/dashboard/departmental', icon: <Briefcase className="h-5 w-5" />, facultyOnly: true },
    //{ name: 'Resources', path: '/dashboard/resources', icon: <Headphones className="h-5 w-5" />, facultyOnly: true },
    // { name: 'Accreditation', path: '/dashboard/accreditation', icon: <Award className="h-5 w-5" />, facultyOnly: true },
  ];

  // Admin-specific menu items
  const adminMenuItems: SidebarItem[] = [
    // { name: 'User Management', path: '/dashboard/users', icon: <Users className="h-5 w-5" />, adminOnly: true },
    { name: 'Course Management', path: '/dashboard/admin-courses', icon: <BookOpen className="h-5 w-5" />, adminOnly: true },
    //{ name: 'Attendance Overview', path: '/dashboard/admin-attendance', icon: <ClipboardCheck className="h-5 w-5" />, adminOnly: true },
    { name: 'Grade Reports', path: '/dashboard/admin-grades', icon: <Star className="h-5 w-5" />, adminOnly: true },
    //{ name: 'Assignment Oversight', path: '/dashboard/admin-assignments', icon: <FileText className="h-5 w-5" />, adminOnly: true },
    { name: 'Manage Announcements', path: '/dashboard/admin-announcements', icon: <Bell className="h-5 w-5" />, adminOnly: true },
    { name: 'Timetable Management', path: '/dashboard/admin-timetable', icon: <Calendar className="h-5 w-5" />, adminOnly: true },
    // { name: 'Event Management', path: '/dashboard/admin-events', icon: <Calendar className="h-5 w-5" />, adminOnly: true },
    //{ name: 'Reports & Analytics', path: '/dashboard/admin-reports', icon: <PieChart className="h-5 w-5" />, adminOnly: true },
    // { name: 'System Settings', path: '/dashboard/admin-settings', icon: <Settings className="h-5 w-5" />, adminOnly: true },
  ];

  // Combine all menu items and filter based on user role
  const allMenuItems = [...commonMenuItems];
  
  if (user?.role === 'student') {
    allMenuItems.push(...studentMenuItems);
  } else if (user?.role === 'faculty') {
    allMenuItems.push(...facultyMenuItems);
  } else if (user?.role === 'admin') {
    allMenuItems.push(...adminMenuItems);
  }

  const filteredMenuItems = allMenuItems.filter(item => {
    if ((item.studentOnly && user?.role !== 'student') ||
        (item.facultyOnly && user?.role !== 'faculty') ||
        (item.adminOnly && user?.role !== 'admin')) {
      return false;
    }
    return true;
  });

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-sidebar transition-width duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-3 py-4">
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-campus-primary" />
              <span className="font-bold text-lg text--primary">Campus Bridge</span>
            </Link>
          )}
          {collapsed && (
            <Link to="/dashboard" className="mx-auto">
              <GraduationCap className="h-6 w-6 text-campus-primary" />
            </Link>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggle}
            className={cn(
              "ml-auto h-8 w-8",
              collapsed && "mx-auto"
            )}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="flex items-center gap-2 border-b p-4">
          <Avatar className={cn(collapsed ? "h-10 w-10" : "h-9 w-9")}>
            <AvatarImage src={user?.profilePicture} alt={user?.name || "User"} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-medium">{user?.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
            </div>
          )}
        </div>
        
        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-1 p-2">
            {filteredMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                  "transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  location.pathname === item.path 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground",
                  collapsed && "justify-center"
                )}
              >
                {item.icon}
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        
        <div className="border-t p-2">
          <Button
            variant="ghost"
            onClick={logout}
            className={cn(
              "w-full justify-start gap-3 text-sidebar-foreground",
              collapsed && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>Log out</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
