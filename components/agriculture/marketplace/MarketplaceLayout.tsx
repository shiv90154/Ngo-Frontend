// components/agriculture/marketplace/MarketplaceLayout.tsx
"use client";

import { MdAgriculture } from "react-icons/md";
import { FiPackage, FiShoppingCart, FiClipboard } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Menu,
  X,
  Package,
  Home,
  LogOut,
  User,
  Search,
  Filter,
  Sparkles,
  TrendingUp,
} from "lucide-react";

type StatCardProps = {
  label: string;
  value: number;
  chip: string;
  icon?: React.ReactNode;
};

const StatCard = ({ label, value, chip, icon }: StatCardProps) => (
  <div className="group relative overflow-hidden rounded-2xl border border-stone-200/70 bg-gradient-to-br from-white to-stone-50/50 px-5 py-4 transition-all duration-300 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5">
    <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-500/5 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/10" />
    <div className="relative">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-stone-500">
          {label}
        </p>
        {icon}
      </div>
      <div className="mt-2 flex items-end justify-between">
        <p className="text-2xl font-bold tracking-tight text-stone-900">
          {value}
        </p>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-100">
          {chip}
        </span>
      </div>
    </div>
  </div>
);

export type TabType = "products" | "cart" | "orders";

interface MarketplaceLayoutProps {
  productsContent: React.ReactNode;
  cartContent: React.ReactNode;
  ordersContent: React.ReactNode;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  categories: string[];
  productsCount: number;
  filteredCount: number;
  categoriesCount: number;
  cartCount: number;
  onLogout?: () => void;
}

export const MarketplaceLayout: React.FC<MarketplaceLayoutProps> = ({
  productsContent,
  cartContent,
  ordersContent,
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  categories,
  productsCount,
  filteredCount,
  categoriesCount,
  cartCount,
  onLogout,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TabType>("products");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const parsedUser = JSON.parse(storedUser);
      setUserName(
        parsedUser?.fullName ||
          parsedUser?.name ||
          parsedUser?.username ||
          parsedUser?.email ||
          "User"
      );
    } catch {
      setUserName("User");
    }
  }, []);

  const navItems = [
    { name: "Products", tab: "products" as TabType, icon: Package },
    { name: "Cart", tab: "cart" as TabType, icon: ShoppingCart, badge: cartCount },
    { name: "Orders", tab: "orders" as TabType, icon: Home },
  ];

  const renderContent = () => {
    if (selectedTab === "cart") return cartContent;
    if (selectedTab === "orders") return ordersContent;
    return productsContent;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/20 to-stone-100/50 text-stone-800">
      {/* Ambient background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-emerald-300/10 blur-[120px]" />
        <div className="absolute right-0 top-1/2 h-96 w-96 rounded-full bg-amber-200/10 blur-[120px]" />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-stone-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-72 border-r border-stone-200/60 bg-white/80 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Brand */}
          <div className="flex h-20 items-center justify-between border-b border-stone-200/60 px-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-700 shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400/30">
                  <MdAgriculture className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 ring-2 ring-white shadow-sm">
                  <FaLeaf className="h-2 w-2 text-white" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-bold tracking-tight text-stone-900">
                    Marketplace
                  </h2>
                </div>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="rounded-full bg-gradient-to-r from-emerald-50 to-green-50 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-emerald-700 ring-1 ring-emerald-200/60">
                    INDIA
                  </span>
                 
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100 lg:hidden"
            >
              <X size={18} />
            </button>
          </div>

        
          {/* Nav */}
          <nav className="flex-1 space-y-1.5 px-4 py-2">
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">
              Navigation
            </p>
            {navItems.map((item) => {
              const active = selectedTab === item.tab;
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    setSelectedTab(item.tab);
                    setSidebarOpen(false);
                  }}
                  className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-lg shadow-emerald-600/25"
                      : "text-stone-600 hover:bg-stone-100/70 hover:text-stone-900"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-white/40" />
                  )}
                  <Icon size={17} className={active ? "drop-shadow" : ""} />
                  <span className="tracking-tight">{item.name}</span>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                        active
                          ? "bg-white text-emerald-700"
                          : "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer / Logout */}
          <div className="border-t border-stone-200/60 p-4">
             {/* User card */}
          <div className="px-5 py-4">
            <div className="group relative overflow-hidden rounded-2xl border border-stone-200/60 bg-gradient-to-br from-stone-50 to-white px-4 py-3.5 transition hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-900/5">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-md shadow-emerald-700/20">
                  <User size={16} />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-stone-900">
                    {userName || "Logged in user"}
                  </p>
                  <p className="text-[11px] font-medium text-stone-500">
                    Active session
                  </p>
                </div>
              </div>
            </div>
          </div>

            <button
              type="button"
              onClick={() => {
                onLogout?.();
                setSidebarOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Topbar */}
      <header className="fixed left-0 right-0 top-0 z-20 h-16 border-b border-stone-200/60 bg-white/70 backdrop-blur-2xl lg:left-72">
        <div className="flex h-full items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-stone-200 bg-white/80 p-2 text-stone-600 shadow-sm transition hover:bg-stone-50 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-green-100/50 ring-1 ring-emerald-200/60">
                {selectedTab === "products" && (
                  <FiPackage className="h-4 w-4 text-emerald-700" />
                )}
                {selectedTab === "cart" && (
                  <FiShoppingCart className="h-4 w-4 text-emerald-700" />
                )}
                {selectedTab === "orders" && (
                  <FiClipboard className="h-4 w-4 text-emerald-700" />
                )}
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-tight text-stone-900 lg:text-xl">
                  {selectedTab === "products"
                    ? "Products"
                    : selectedTab === "cart"
                    ? "My Cart"
                    : "My Orders"}
                </h1>
                <p className="hidden text-[11px] font-medium text-stone-500 sm:block">
                  {selectedTab === "products"
                    ? "Discover agricultural goods"
                    : selectedTab === "cart"
                    ? "Review your selected items"
                    : "Track your purchase history"}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedTab("cart")}
            className="group relative flex items-center gap-2 rounded-xl bg-gradient-to-br from-green-900 to-green-800 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-stone-900/20 transition hover:shadow-xl hover:shadow-stone-900/30"
          >
            <ShoppingCart size={15} />
            <span className="hidden sm:inline">Cart</span>

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 px-1 text-[10px] font-bold text-stone-900 ring-2 ring-white shadow-md">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="relative min-h-screen pt-16 lg:ml-72">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {selectedTab === "products" && (
            <section className="mb-6 overflow-hidden rounded-3xl border border-stone-200/70 bg-white/70 p-5 shadow-sm shadow-stone-900/5 backdrop-blur-xl sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold tracking-tight text-stone-900">
                    Browse catalogue
                  </h2>
                  <p className="text-[11px] text-stone-500">
                    Search, filter & explore curated produce
                  </p>
                </div>
                <div className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 ring-1 ring-emerald-100 sm:flex">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    Live inventory
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="group relative">
                  <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 transition group-focus-within:text-emerald-600"
                  />
                  <input
                    type="text"
                    placeholder="Search products or sellers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-stone-200 bg-white/80 pl-11 pr-4 text-sm font-medium text-stone-900 placeholder:text-stone-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div className="group relative">
                  <Filter
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 transition group-focus-within:text-emerald-600"
                  />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="h-12 w-full appearance-none rounded-2xl border border-stone-200 bg-white/80 pl-11 pr-4 text-sm font-medium text-stone-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatCard
                  label="Products"
                  value={productsCount}
                  chip="All"
                  icon={<Package size={14} className="text-stone-400" />}
                />
                <StatCard
                  label="Results"
                  value={filteredCount}
                  chip="Live"
                  icon={<TrendingUp size={14} className="text-stone-400" />}
                />
                <StatCard
                  label="Categories"
                  value={categoriesCount}
                  chip="Active"
                  icon={<Filter size={14} className="text-stone-400" />}
                />
              </div>
            </section>
          )}

          <section className="rounded-3xl border border-stone-200/70 bg-white/80 p-5 shadow-sm shadow-stone-900/5 backdrop-blur-xl sm:p-6">
            {renderContent()}
          </section>
        </div>
      </main>
    </div>
  );
};
