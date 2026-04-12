// app/disclaimer/page.js
import React from "react";
import DisclaimerContent from "@/components/Disclaimer";

export const metadata = {
    title: "Disclaimer | Samraddh Bharat",
    description: "Disclaimer and terms of use for Samraddh Bharat platform",
};

export default function Disclaimer() {
    return <DisclaimerContent />;
}