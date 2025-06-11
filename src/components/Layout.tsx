import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LightPullThemeSwitcher } from "@/components/ui/light-pull-theme-switcher";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground min-w-0">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-white/20 backdrop-blur-sm bg-white/10 flex items-center px-6 sticky top-0 z-40">
            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <div className="flex items-center space-x-4">
                <LightPullThemeSwitcher />
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 min-w-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
