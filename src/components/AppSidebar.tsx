"use client";

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
import {
    LayoutDashboard,
    Settings,
    History,
    LogOut,
    Mic,
    BarChart3,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Meeting History",
        url: "/meetings",
        icon: History,
    },
    {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart3,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
];

export function AppSidebar({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
                <Sidebar>
                    <SidebarHeader className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center space-x-2">
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                                <img
                                    src="/automeet-icon.png"
                                    alt="AutoMeet"
                                    className="w-6 h-6"
                                />
                            </div>
                            <span className="font-bold text-xl tracking-tight">AutoMeet</span>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Application</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={pathname === item.url}
                                                className="transition-all duration-200"
                                            >
                                                <Link href={item.url}>
                                                    <item.icon className="w-5 h-5" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter className="p-4 border-t border-gray-200 dark:border-gray-800">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                            onClick={() => signOut({ callbackUrl: "/login" })}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </SidebarFooter>
                </Sidebar>
                <main className="flex-1 overflow-auto">
                    <div className="p-4 md:p-6 lg:p-8">
                        <SidebarTrigger className="mb-4 md:hidden" />
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
