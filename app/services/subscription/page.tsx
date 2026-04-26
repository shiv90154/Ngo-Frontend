// app/(services)/subscription/page.tsx
"use client";
import { useEffect, useState } from "react";
import { subscriptionAPI } from "@/lib/api";
import {
  Loader2,
  Check,
  Zap,
  Shield,
  Crown,
  Star,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const moduleLabels: Record<string, string> = {
  EDUCATION: "Education",
  HEALTH: "Healthcare",
  AGRICULTURE: "Agriculture",
  ALL: "All Services",
};

const moduleIcons: Record<string, React.ElementType> = {
  EDUCATION: Zap,
  HEALTH: Shield,
  AGRICULTURE: Star,
  ALL: Crown,
};

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    subscriptionAPI
      .getPlans()
      .then((res) => setPlans(res.data.plans))
      .catch(() => toast.error("Failed to load plans"))
      .finally(() => setLoading(false));
  }, []);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePurchase = async (planId: string) => {
    const ready = await loadRazorpay();
    if (!ready) return toast.error("Razorpay SDK failed to load");

    try {
      const res = await subscriptionAPI.purchase(planId);
      const { orderId, amount, plan } = res.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: "INR",
        name: "Samraddh Subscription",
        description: `${plan.name} - ${plan.durationDays} days`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            await subscriptionAPI.verify(response);
            toast.success("Subscription activated!");
            router.push("/services/subscription/my");
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: { name: "", email: "" },
        theme: { color: "#1a237e" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Purchase failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-10 max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <Zap size={20} className="text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Choose Your Plan</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Unlock premium features across Education, Healthcare, Agriculture.
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("/services/subscription/my")}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 shadow-sm transition"
          >
            <User size={16} />
            My Subscription
          </button>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Zap size={36} className="mx-auto text-gray-300 mb-3" />
            <p className="font-medium">No plans available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan: any, index: number) => {
              const Icon = moduleIcons[plan.module] || Zap;
              const isPopular = index === 1; // highlight the second plan
              return (
                <div
                  key={plan._id}
                  className={`relative rounded-2xl shadow-md transition-all hover:-translate-y-1 ${
                    isPopular
                      ? "bg-gradient-to-b from-indigo-600 to-indigo-800 text-white ring-2 ring-indigo-300 scale-[1.03]"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                      <Star size={14} /> Most Popular
                    </div>
                  )}
                  <div className="p-6 sm:p-7 flex flex-col h-full">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                        isPopular ? "bg-white/20" : "bg-indigo-100"
                      }`}
                    >
                      <Icon
                        size={24}
                        className={isPopular ? "text-white" : "text-indigo-600"}
                      />
                    </div>
                    <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
                    <p
                      className={`text-sm mb-5 ${
                        isPopular ? "text-indigo-100" : "text-gray-500"
                      }`}
                    >
                      {moduleLabels[plan.module]} · {plan.durationDays} Days
                    </p>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-xl">₹</span>
                      <span className="text-4xl sm:text-5xl font-extrabold">
                        {plan.price}
                      </span>
                    </div>
                    <ul className="space-y-2.5 mb-7 flex-1">
                      {plan.features.map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check
                            size={16}
                            className={`flex-shrink-0 mt-0.5 ${
                              isPopular ? "text-amber-400" : "text-green-500"
                            }`}
                          />
                          <span
                            className={`text-sm ${
                              isPopular ? "text-indigo-100" : "text-gray-600"
                            }`}
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handlePurchase(plan._id)}
                      className={`w-full py-3 rounded-xl font-bold transition ${
                        isPopular
                          ? "bg-white text-indigo-700 hover:bg-indigo-50 shadow-md"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      Subscribe Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}