"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    // 强制刷新页面或跳转到首页
    router.push("/");
    router.refresh(); // 确保客户端状态完全重置
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
    >
      <LogOut size={16} />
      Logout
    </button>
  );
}