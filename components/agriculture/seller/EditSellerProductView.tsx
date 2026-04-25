"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import SellerShell from "./SellerShell";
import {
    Loader2,
    Save,
    ArrowLeft,
    Package,
    MapPin,
    IndianRupee,
    Leaf,
    FileText
} from "lucide-react";

const API_BASE: string = process.env.NEXT_PUBLIC_API_URL || "";

type FormDataType = {
    name: string;
    category: string;
    price: string | number;
    unit: string;
    quantity: string | number;
    location: string;
    description: string;
    imageUrl: string;
    isOrganic: boolean;
};

export default function EditSellerProductView(): JSX.Element {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const { user, loading: authLoading } = useAuth();

    const productId = params?.id;

    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [imagePreview, setImagePreview] = useState<string>("");

    const [formData, setFormData] = useState<FormDataType>({
        name: "",
        category: "",
        price: "",
        unit: "",
        quantity: "",
        location: "",
        description: "",
        imageUrl: "",
        isOrganic: false
    });

    const unitOptions: string[] = [
        "kg",
        "litre",
        "piece",
        "bundle",
        "dozen",
        "tonne",
        "bag"
    ];

    useEffect(() => {
        if (authLoading) return;

        const token = localStorage.getItem("token");

        if (!token || !user) {
            router.replace("/login");
            return;
        }

        const isContractFarmer = user?.farmerProfile?.isContractFarmer === true;

        if (!isContractFarmer) {
            router.replace("/agriculture/marketplace");
            return;
        }

        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(
                    `${API_BASE}/agriculture/seller/products/${productId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                if (data.success) {
                    const item = data.data;

                    setFormData({
                        name: item.name || "",
                        category: item.category || "",
                        price: item.price ?? "",
                        unit: item.unit || "",
                        quantity: item.quantity ?? "",
                        location: item.location || "",
                        description: item.description || "",
                        imageUrl: item.imageUrl || "",
                        isOrganic: item.isOrganic || false
                    });

                    setImagePreview(item.imageUrl || "");
                }
            } catch (err) {
                console.error("Failed to fetch product:", err);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [authLoading, productId, router, user]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        const nextValue =
            type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : value;

        setFormData((prev) => ({
            ...prev,
            [name]: nextValue
        }));

        if (name === "imageUrl") {
            setImagePreview(value);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) return;

        setSaving(true);

        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                quantity: Number(formData.quantity)
            };

            const { data } = await axios.put(
                `${API_BASE}/agriculture/seller/products/${productId}`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (data.success) {
                router.push("/agriculture/seller/products");
            }
        } catch (err) {
            console.error("Failed to update product:", err);
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <Loader2 className="h-10 w-10 animate-spin text-[#2f6b45]" />
            </div>
        );
    }

    return (
        <SellerShell
            title="Edit Product"
            subtitle="Update your product listing details for the marketplace."
        >
            {/* UI remains SAME */}
        </SellerShell>
    );
}