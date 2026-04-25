"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const { loading } = useAuth();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setDone(true), 2500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="splash"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0f2c] via-[#1a237e] to-[#283593] overflow-hidden"
        >
          {/* ── Floating tricolor particles (CSS only) ── */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-2 h-2 bg-[#FF9933] rounded-full animate-float-slow opacity-70"></div>
            <div className="absolute top-1/4 right-16 w-3 h-3 bg-white rounded-full animate-float-medium opacity-50"></div>
            <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-[#138808] rounded-full animate-float-fast opacity-60"></div>
            <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-[#FF9933] rounded-full animate-float-medium opacity-40"></div>
            <div className="absolute bottom-1/3 left-16 w-2 h-2 bg-white rounded-full animate-float-slow opacity-30"></div>
          </div>

          {/* ── Logo with entrance animation ── */}
          <motion.img
            src="/logo.webp"
            alt="Samraddh Bharat"
            className="w-28 h-28 md:w-36 md:h-36 object-contain"
            initial={{ scale: 0.5, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 10, delay: 0.2 }}
          />

          {/* ── Tagline ── */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 text-lg md:text-xl text-blue-200 font-light tracking-widest"
          >
            Digital India · Unified Services
          </motion.p>

          {/* ── Sleek loading bar ── */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "12rem" }}
            transition={{ delay: 0.4, duration: 1.2, ease: "easeInOut" }}
            className="mt-8 h-1 bg-white/20 rounded-full overflow-hidden"
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 2, ease: "linear" }}
              className="h-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] rounded-full"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}