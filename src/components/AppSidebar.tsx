import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  CheckSquare,
  LayoutDashboard,
  Plus,
  Calendar,
  BarChart3,
  Settings,
  Users,
  FolderOpen,
  User,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  { label: "Tasks", href: "/tasks", icon: <CheckSquare className="h-5 w-5" /> },
  {
    label: "Projects",
    href: "/projects",
    icon: <FolderOpen className="h-5 w-5" />,
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    // label: "Settings",
    // href: "/settings",
    // icon: <Settings className="h-5 w-5" />,
  },
];

export function AppSidebar() {
  const { open } = useSidebar();
  console.log("Sidebar open state:", open);
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<{
    avatar_url: string | null;
    full_name: string | null;
    email: string | null;
  } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("avatar_url, full_name, email")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setProfile(data);
      });
  }, [user]);

  // Prefer profile.avatar_url, then Google pfp, then fallback
  const avatarUrl =
    profile?.avatar_url ||
    user?.user_metadata?.picture ||
    user?.user_metadata?.avatar_url ||
    null;

  // Helper for initials fallback
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    if (profile?.email) {
      return profile.email[0]?.toUpperCase();
    }
    if (user?.email) {
      return user.email[0]?.toUpperCase();
    }
    return "?";
  };

  const handleLogout = async () => {
    await signOut();
    // Optionally, you can redirect or show a toast here
  };

  return (
    <Sidebar className="bg-white dark:bg-sidebar text-sidebar-foreground backdrop-blur-md bg-opacity-80 dark:bg-opacity-80 border-r border-border shadow-xl transition-colors duration-300">
      <SidebarBody>
        <nav className="mt-4 flex flex-col gap-8 items-start pl-0 ml-6">
          <div
            className={`h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 dark:from-sidebar-primary dark:to-sidebar-accent flex items-center justify-center -ml-[7px] flex-shrink-0 overflow-hidden shadow-md`}
          >
            <CheckSquare className="h-6 w-6 text-white" />
          </div>
          {navigationItems.map((item) => (
            <SidebarLink key={item.label} link={item} />
          ))}
        </nav>
        {open && (
          <div className="mt-auto p-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 dark:from-sidebar-primary dark:to-sidebar-accent rounded-lg p-4 text-white dark:text-sidebar-foreground shadow-lg">
              <h3 className="font-semibold text-sm mb-2">Upgrade to Pro</h3>
              <p className="text-xs text-blue-100 dark:text-sidebar-foreground/70 mb-3">
                Get unlimited tasks and advanced features
              </p>
              <button className="w-full bg-white/20 dark:bg-sidebar/30 hover:bg-white/30 dark:hover:bg-sidebar/50 rounded-md py-2 text-xs font-medium transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        )}
        <div className="w-full flex flex-col items-center mt-auto mb-2 gap-3">
          <div className="flex items-center justify-center w-full">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 dark:bg-sidebar-accent hover:bg-gray-200 dark:hover:bg-sidebar-primary transition-colors mb-1 shadow"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5 text-gray-600 dark:text-sidebar-foreground" />
            </button>
            {open && (
              <span className="ml-3 text-gray-700 dark:text-sidebar-foreground font-medium select-none">
                Logout
              </span>
            )}
          </div>
          <Avatar className="h-12 w-12 shadow-md cursor-pointer bg-white dark:bg-sidebar-accent border border-border">
            {avatarUrl && (
              <AvatarImage
                src={avatarUrl}
                alt={
                  profile?.full_name || profile?.email || user?.email || "User"
                }
              />
            )}
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
