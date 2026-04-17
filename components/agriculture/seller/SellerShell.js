"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    PlusCircle,
    ShoppingBag,
    User,
    ShieldCheck
} from "lucide-react";

const navItems = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/agriculture/seller/dashboard"
    },
    {
        label: "Products",
        icon: Package,
        path: "/agriculture/seller/products"
    },
    {
        label: "Add Product",
        icon: PlusCircle,
        path: "/agriculture/seller/products/new"
    },
    {
        label: "Orders",
        icon: ShoppingBag,
        path: "/agriculture/seller/orders"
    },
    {
        label: "Profile",
        icon: User,
        path: "/agriculture/seller/profile"
    }
];

export default function SellerShell({
    title,
    subtitle,
    badge = "Contractor Portal",
    children
}) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 text-slate-800">
            <div className="mx-auto flex max-w-7xl gap-5 px-4 py-5">
                <aside className="hidden w-[260px] shrink-0 lg:block">
                    <div className="sticky top-5 rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 shadow-sm">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-b from-[#2f6b45] to-[#234d36] text-white shadow-sm">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2f6b45]">
                                    Seller Module
                                </p>
                                <h2 className="text-sm font-bold text-slate-900">
                                    Agriculture Portal
                                </h2>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = pathname === item.path;

                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => router.push(item.path)}
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active
                                                ? "border border-green-200 bg-green-50 text-green-700"
                                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                            }`}
                                    >
                                        <Icon size={17} />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                <main className="min-w-0 flex-1">
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#2f6b45] to-[#234d36] text-white shadow-sm">
                                    <ShieldCheck size={22} />
                                </div>

                                <div>
                                    <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#2f6b45]">
                                        {badge}
                                    </p>
                                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                                        {title}
                                    </h1>
                                    <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5">{children}</div>
                </main>
            </div>
        </div>
    );
}