"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import {
  Home,
  CheckSquare,
  FolderKanban,
  Plus,
  Settings,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getProjects } from "@/lib/api";

export default function AppSidebar() {
  const pathname = usePathname();

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const mainNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Tasks",
      href: "/tasks",
      icon: CheckSquare,
    },
    {
      title: "Projects",
      href: "/project-summery",
      icon: FolderKanban,
    },
  ];

  return (
    <SidebarProvider>
      <Sidebar className="border-r bg-gradient-to-b from-slate-50 to-slate-100/50">
        {/* Header */}
        <SidebarHeader className="border-b bg-white/60 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                <Image 
                  src="/logo.png" 
                  alt="CatWork Logo" 
                  width={32} 
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-slate-900">CatWork</span>
                <span className="text-[10px] text-slate-500">Work Management</span>
              </div>
            </div>
          </div>
        </SidebarHeader>

        {/* Content */}
        <SidebarContent className="px-3 py-4">
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {mainNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="h-10 hover:bg-white/80 hover:shadow-sm transition-all duration-200 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-50 data-[active=true]:to-purple-50 data-[active=true]:border data-[active=true]:border-blue-200/50 data-[active=true]:shadow-md data-[active=true]:text-blue-700 data-[active=true]:font-medium"
                      >
                        <Link href={item.href} className="flex items-center gap-3">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Workspaces */}
          <SidebarGroup className="mt-6">
            <div className="flex items-center justify-between px-2 mb-2">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Workspaces
              </SidebarGroupLabel>
              <button className="w-5 h-5 rounded-md hover:bg-slate-200/60 flex items-center justify-center transition-colors">
                <Plus className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-0.5">
                {projects.map((project) => {
                  const isActive = pathname === `/projects/${project.id}`;
                  return (
                    <SidebarMenuItem key={project.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="h-9 hover:bg-white/60 hover:translate-x-0.5 transition-all duration-200 data-[active=true]:bg-white data-[active=true]:shadow-sm data-[active=true]:border-l-2 data-[active=true]:border-blue-500 data-[active=true]:font-medium data-[active=true]:text-slate-900"
                      >
                        <Link href={`/projects/${project.id}`} className="flex items-center gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                          <span className="text-sm">{project.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="border-t bg-white/40 backdrop-blur-sm p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 px-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-900">User Name</span>
                <span className="text-[10px] text-slate-500">user@email.com</span>
              </div>
            </div>
            <button className="w-8 h-8 rounded-lg hover:bg-slate-200/60 flex items-center justify-center transition-colors">
              <Settings className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          <SidebarTrigger className="w-full h-8 hover:bg-slate-200/60 rounded-md transition-colors" />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}