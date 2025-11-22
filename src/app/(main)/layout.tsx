import { auth } from "@/auth";
import { AppSidebar } from "@/components/AppSidebar";
import { redirect } from "next/navigation";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return <AppSidebar>{children}</AppSidebar>;
}
