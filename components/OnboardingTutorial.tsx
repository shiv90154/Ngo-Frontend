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
} from "lucide-react";
import { useRouter } from "next/navigation";

const steps = [
  {
    title: "Complete Your Profile",
    description:
      "Add your details to unlock personalized services.",
    icon: User,
    action: { label: "Go to Profile", href: "/profile/view" },
  },
  {
    title: "Explore Services",
    description:
      "Access education, healthcare, finance & more in one place.",
    icon: LayoutDashboard,
    action: { label: "Explore Now", href: "/services" },
  },
  {
    title: "Earn with Referrals",
    description:
      "Invite friends and earn rewards automatically.",
    icon: Share2,
    action: { label: "View Earnings", href: "/services/mlm" },
  },
];

export default function OnboardingTutorial() {
  const [visible, setVisible] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const completed = localStorage.getItem("onboarding_completed");
    if (!completed) {
      setTimeout(() => setVisible(true), 500);
    }
  }, []);

  const finish = () => {
    localStorage.setItem("onboarding_completed", "true");
    setVisible(false);
  };

  const next = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      finish();
    }
  };

  const prev = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  if (!visible) return null;

  const step = steps[stepIndex];
  const Icon = step.icon;
  const isLast = stepIndex === steps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-400">
              Step {stepIndex + 1}/{steps.length}
            </span>
            <button onClick={finish}>
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center">
              <Icon className="text-white w-7 h-7" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-2">{step.title}</h2>
            <p className="text-gray-600 text-sm">{step.description}</p>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <button
              onClick={next}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold"
            >
              {isLast ? "Get Started" : "Continue"}
            </button>

            {step.action && (
              <button
                onClick={() => {
                  router.push(step.action.href);
                  finish();
                }}
                className="w-full border border-gray-200 py-3 rounded-xl text-sm"
              >
                {step.action.label}
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-4">
            <button
              onClick={prev}
              disabled={stepIndex === 0}
              className="text-sm text-gray-400"
            >
              Back
            </button>

            <button
              onClick={next}
              className="text-sm text-indigo-600 font-semibold"
            >
              {isLast ? "Finish" : "Next"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}