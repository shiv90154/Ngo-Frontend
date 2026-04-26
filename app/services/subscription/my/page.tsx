"use client";
import { useEffect, useState } from "react";
import { subscriptionAPI } from "@/lib/api";
import {
  Loader2,
  Clock,
  BadgeCheck,
  Calendar,
  CreditCard,
  AlertCircle,
  RefreshCw,
  History,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function MySubscriptionPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    subscriptionAPI
      .mySubscription()
      .then((res) => setData(res.data))
      .catch(() => toast.error("Failed to load subscription"))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await subscriptionAPI.cancel();
      toast.success("Auto‑renew turned off");
      const res = await subscriptionAPI.mySubscription();
      setData(res.data);
    } catch (err) {
      toast.error("Failed to cancel");
    } finally {
      setCancelling(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
      </div>
    );

  const sub = data?.activeSubscription;
  const history = data?.subscriptionHistory || [];
  const daysLeft = sub?.expiresAt
    ? Math.ceil(
        (new Date(sub.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <BadgeCheck className="text-indigo-600 w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Subscription
            </h1>
            <p className="text-gray-500 text-sm">
              Manage your premium plan
            </p>
          </div>
        </div>

        {/* Active Subscription Card */}
        {!sub || sub.plan === "NONE" ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-indigo-400 w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              No Active Subscription
            </h2>
            <p className="text-gray-500 mb-6">
              You don't have an active subscription yet.
            </p>
            <Link
              href="/services/subscription"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
            >
              Browse Plans <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Status Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 sm:px-8 sm:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                    <BadgeCheck className="text-white w-8 h-8" />
                  </div>
                  <div className="text-white">
                    <p className="text-sm font-medium text-indigo-100">
                      Active Plan
                    </p>
                    <p className="text-2xl font-extrabold">
                      {sub.plan}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-5 py-2">
                  <Clock size={16} className="text-white" />
                  <span className="text-white font-medium text-sm">
                    Expires {new Date(sub.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Days remaining</span>
                  <span className="font-semibold text-gray-800">
                    {daysLeft} days
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (daysLeft / 30) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <Calendar className="text-gray-400 mb-2" size={20} />
                  <p className="text-xs text-gray-500">Started</p>
                  <p className="font-semibold text-gray-800">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <CreditCard className="text-gray-400 mb-2" size={20} />
                  <p className="text-xs text-gray-500">Auto‑Renew</p>
                  <p className="font-semibold text-gray-800">
                    {sub.autoRenew ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {sub.autoRenew ? (
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="flex-1 bg-red-50 text-red-700 py-3 rounded-xl font-bold hover:bg-red-100 transition flex items-center justify-center gap-2"
                  >
                    {cancelling ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <RefreshCw size={18} />
                    )}
                    Turn Off Auto‑Renew
                  </button>
                ) : (
                  <p className="flex-1 text-center py-3 text-sm text-gray-500">
                    Auto‑renew is off. Your access will end on expiration.
                  </p>
                )}
                <Link
                  href="/services/subscription"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                  Upgrade Plan <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* History Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 sm:px-8 py-5 border-b border-gray-100 flex items-center gap-2">
            <History size={20} className="text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-800">
              Subscription History
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            {history.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No past subscriptions.
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((h: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {h.plan}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(h.startDate).toLocaleDateString()} –{" "}
                        {new Date(h.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-indigo-600">
                      ₹{h.amountPaid}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}