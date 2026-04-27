"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  LayoutDashboard,
  Share2,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

const steps = [
  {
    title: "Complete Your Profile",
    description:
      "Add your photo, phone, and address so services can work best for you. A complete profile helps us personalise your experience.",
    icon: User,
    action: { label: "Go to Profile", href: "/profile/view" },
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Explore Services",
    description:
      "Browse Education, Healthcare, Finance, News, Agriculture, and IT Services from the dashboard. Everything you need in one place.",
    icon: LayoutDashboard,
    action: { label: "Start Exploring", href: "/services" },
    color: "from-indigo-500 to-purple-600",
  },
  {
    title: "Refer Friends & Earn",
    description:
      "Share your unique referral link and earn MLM commissions up to 5 levels deep when your friends join and make purchases.",
    icon: Share2,
    action: { label: "View Earnings", href: "/services/mlm" },
    color: "from-amber-500 to-orange-600",
  },
];

export default function OnboardingTutorial() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [exiting, setExiting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const completed = localStorage.getItem("onboarding_completed");
    if (!completed) {
      // Small delay so the page content loads first
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const finish = () => {
    setExiting(true);
    setTimeout(() => {
      localStorage.setItem("onboarding_completed", "true");
      setVisible(false);
    }, 300);
  };

  const nextStep = () => {
    if (current < steps.length - 1) {
      setCurrent(current + 1);
    } else {
      finish();
    }
  };

  const prevStep = () => {
    if (current > 0) setCurrent(current - 1);
  };

  if (!visible) return null;

  const step = steps[current];
  const Icon = step.icon;
  const isLast = current === steps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative"
        >
          {/* Colored header bar */}
          <div className={`h-2 bg-gradient-to-r ${step.color}`} />

          {/* Skip button – always visible */}
          <button
            onClick={finish}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition z-10"
          >
            <X size={18} />
          </button>

          <div className="p-6 sm:p-8">
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-1.5 mb-6">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i <= current
                      ? "bg-[#1a237e] w-8"
                      : "bg-gray-200 w-4"
                  }`}
                />
              ))}
            </div>

            {/* Icon with gradient circle */}
            <div className="flex justify-center mb-6">
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
              >
                <Icon className="w-9 h-9 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-3">
              <button
                disabled={current === 0}
                onClick={prevStep}
                className="p-2.5 rounded-full disabled:opacity-30 hover:bg-gray-100 transition"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex-1 flex justify-center">
                <span className="text-sm text-gray-400 font-medium">
                  {current + 1} of {steps.length}
                </span>
              </div>

              {isLast ? (
                <button
                  onClick={finish}
                  className={`flex items-center gap-2 bg-gradient-to-r ${step.color} text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition`}
                >
                  <Check size={16} /> Get Started
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="p-2.5 rounded-full hover:bg-gray-100 transition"
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </div>

            {/* Quick action link */}
            {step.action && (
              <div className="mt-5 text-center">
                <button
                  onClick={() => {
                    router.push(step.action!.href);
                    finish();
                  }}
                  className="text-sm text-[#1a237e] font-semibold hover:underline"
                >
                  {step.action.label} →
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}