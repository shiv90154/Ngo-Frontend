"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ExternalLink, X, Flag, MoreHorizontal, Info, TrendingUp } from "lucide-react";
import { getMediaUrl } from "@/utils/mediaUrl";
import { adsAPI } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface AdCardProps {
  ad: {
    _id: string;
    adId: string;
    isAd: boolean;
    businessName: string;
    content: string;
    media: Array<{ type: string; url: string; thumbnail?: string }>;
    ctaText: string;
    targetUrl: string;
    createdAt: string;
    author: {
      fullName: string;
      profileImage?: string;
    };
  };
  onHide?: () => void;
}

export default function AdCard({ ad, onHide }: AdCardProps) {
  const [clicked, setClicked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showWhyThisAd, setShowWhyThisAd] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Close menu on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowMenu(false);
        setShowWhyThisAd(false);
      }
    };
    if (showMenu || showWhyThisAd) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showMenu, showWhyThisAd]);

  const handleAdClick = async () => {
    if (clicked) return;
    setClicked(true);
    
    try {
      await adsAPI.trackClick(ad.adId);
      window.open(ad.targetUrl, '_blank');
    } catch (error) {
      console.error('Failed to track ad click:', error);
      window.open(ad.targetUrl, '_blank');
    }
  };

  const handleImpression = async () => {
    try {
      await adsAPI.trackImpression(ad.adId);
    } catch (error) {
      console.error('Failed to track impression:', error);
    }
  };

  // Track impression when ad is viewed
  useEffect(() => {
    handleImpression();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Sponsored Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-amber-50/50 to-white border-b border-amber-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-amber-600" />
            </div>
            <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wide">Sponsored</span>
            <span className="text-xs text-amber-300">•</span>
            <span className="text-xs text-amber-500 font-medium">{ad.businessName}</span>
          </div>
          
          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 hover:bg-amber-100 rounded-lg transition-colors"
              aria-label="Ad options"
            >
              <MoreHorizontal className="w-4 h-4 text-amber-400" />
            </button>
            
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 4 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-slate-900/5 z-20 py-1 overflow-hidden"
                >
                  <button
                    onClick={() => {
                      onHide?.();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Hide this ad
                  </button>
                  <button
                    onClick={() => {
                      alert('Thank you for your feedback. This ad has been reported.');
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <Flag className="w-4 h-4" />
                    Report ad
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Ad Content */}
      <div className="p-5">
        {/* Business Info - Simplified */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm">
            {ad.author.profileImage && !imageError ? (
              <Image
                src={getMediaUrl(ad.author.profileImage)}
                alt={ad.businessName}
                width={48}
                height={48}
                className="object-cover"
                onError={() => setImageError(true)}
                unoptimized
              />
            ) : (
              <span className="text-xl font-bold text-amber-700">
                {ad.businessName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-base">{ad.businessName}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <span>Advertisement</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span>{new Date(ad.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </p>
          </div>
        </div>

        {/* Ad Text */}
        {ad.content && (
          <p className="text-gray-700 mb-4 leading-relaxed text-sm">
            {ad.content}
          </p>
        )}

        {/* Ad Media */}
        {ad.media && ad.media.length > 0 && ad.media[0]?.url && (
          <div 
            className="rounded-xl overflow-hidden mb-4 bg-gray-100 cursor-pointer group relative"
            onClick={handleAdClick}
          >
            {ad.media[0].type === 'image' ? (
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                <Image
                  src={getMediaUrl(ad.media[0].url)}
                  alt={`Advertisement from ${ad.businessName}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            ) : ad.media[0].type === 'video' && (
              <video
                src={getMediaUrl(ad.media[0].url)}
                className="w-full"
                style={{ maxHeight: '400px' }}
                controls
                preload="metadata"
                poster={ad.media[0].thumbnail ? getMediaUrl(ad.media[0].thumbnail) : undefined}
              />
            )}
          </div>
        )}

        {/* Call to Action Button - Prominent */}
        <button
          onClick={handleAdClick}
          className="w-full group relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3.5 px-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            {ad.ctaText || "Learn More"}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>

        {/* Why this ad? link with tooltip */}
        <div className="relative mt-4 text-center">
          <button
            onClick={() => setShowWhyThisAd(!showWhyThisAd)}
            className="text-xs text-gray-400 hover:text-gray-500 transition-colors inline-flex items-center gap-1"
          >
            <Info className="w-3 h-3" />
            Why this ad?
          </button>
          
          <AnimatePresence>
            {showWhyThisAd && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl z-30"
              >
                <p className="text-center leading-relaxed">
                  This ad is shown based on your interests and browsing activity.
                  We strive to show relevant advertisements that match your preferences.
                </p>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sponsored Badge - Bottom edge */}
      <div className="px-5 pb-3 pt-0">
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-300 border-t border-gray-100 pt-3">
          <span className="inline-block w-1 h-1 rounded-full bg-gray-300" />
          <span>Sponsored Content</span>
          <span className="inline-block w-1 h-1 rounded-full bg-gray-300" />
        </div>
      </div>
    </motion.div>
  );
}