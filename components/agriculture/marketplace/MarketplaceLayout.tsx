// components/agriculture/marketplace/MarketplaceLayout.tsx
"use client";

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
} from "lucide-react";

type StatCardProps = {
  label: string;
  value: number;
  chip: string;
};

const StatCard = ({ label, value, chip }: StatCardProps) => (
  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </p>
    <div className="mt-1 flex items-center justify-between">
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
        {chip}
      </span>
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
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-72 border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-lg">
                🌾
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Krishi Bazaar
                </h2>
                <p className="text-xs text-slate-500">Agriculture marketplace</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <X size={18} />
            </button>
          </div>

          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200">
                <User size={17} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {userName || "Logged in user"}
                </p>
                <p className="text-xs text-slate-500">Currently logged in</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
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
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                      : "border border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-slate-200 p-3">
            <button
              type="button"
              onClick={() => {
                onLogout?.();
                setSidebarOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-red-600 transition hover:border-red-100 hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Fixed Topbar */}
      <header className="fixed left-0 right-0 top-0 z-20 h-16 border-b border-slate-200 bg-white/95 backdrop-blur lg:left-72">
        <div className="flex h-full items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div>
              <h1 className="text-lg font-bold text-slate-900 lg:text-xl">
                {selectedTab === "products"
                  ? "Products"
                  : selectedTab === "cart"
                  ? "My Cart"
                  : "My Orders"}
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                Fresh from farm to your table
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedTab("cart")}
            className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Cart</span>

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen pt-16 lg:ml-72">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          {selectedTab === "products" && (
            <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search products or sellers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div className="relative">
                  <Filter
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
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
                <StatCard label="Products" value={productsCount} chip="All" />
                <StatCard label="Results" value={filteredCount} chip="Live" />
                <StatCard
                  label="Categories"
                  value={categoriesCount}
                  chip="Active"
                />
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            {renderContent()}
          </section>
        </div>
      </main>
    </div>
  );
};