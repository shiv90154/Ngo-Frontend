"use client";

import { useState } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    TextField,
    Chip,
    Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function FaqPage() {
    const faqData = [
        {
            id: 1,
            category: "General",
            question: "What is Samraddh Bharat?",
            answer:
                "Samraddh Bharat is a digital platform dedicated to supporting education, skill development, and holistic growth for individuals across India.",
        },
        {
            id: 2,
            category: "General",
            question: "What is the mission of Samraddh Bharat?",
            answer:
                "Our mission is to empower every individual with accessible education and development opportunities.",
        },
        {
            id: 3,
            category: "Account",
            question: "How can I register on Samraddh Bharat?",
            answer:
                "Click on the 'Sign Up' button on the login page and provide your details.",
        },
        {
            id: 4,
            category: "Account",
            question: "How do I reset my password?",
            answer:
                "Use the 'Forgot Password' option and follow instructions sent to your email.",
        },
        {
            id: 5,
            category: "Account",
            question: "Can I delete my account?",
            answer:
                "Yes, from Settings > Account > Delete Account. This action is permanent.",
        },
        {
            id: 6,
            category: "Payment",
            question: "Is Samraddh Bharat free to use?",
            answer:
                "Basic features are free. Premium courses require payment.",
        },
        {
            id: 7,
            category: "Payment",
            question: "What payment methods do you accept?",
            answer:
                "We accept cards, UPI, net banking, and EMI options.",
        },
        {
            id: 8,
            category: "Payment",
            question: "Can I get a refund?",
            answer:
                "Yes, within 7 days if less than 20% course is completed.",
        },
        {
            id: 9,
            category: "Courses",
            question: "What types of courses are available?",
            answer:
                "Digital skills, professional development, academic, and vocational courses.",
        },
        {
            id: 10,
            category: "Courses",
            question: "How do I enroll?",
            answer:
                "Click 'Enroll Now' on the course page.",
        },
        {
            id: 11,
            category: "Courses",
            question: "Will I receive a certificate?",
            answer:
                "Yes, after successful completion.",
        },
        {
            id: 12,
            category: "Courses",
            question: "Can I access on mobile?",
            answer:
                "Yes, platform is fully responsive.",
        },
        {
            id: 13,
            category: "Technical Support",
            question: "Videos not loading?",
            answer:
                "Check internet, clear cache, or switch browser.",
        },
        {
            id: 14,
            category: "Technical Support",
            question: "How to contact support?",
            answer:
                "Email or use live chat from dashboard.",
        },
        {
            id: 15,
            category: "Community",
            question: "Is there a community forum?",
            answer:
                "Yes, available in dashboard.",
        },
        {
            id: 16,
            category: "Community",
            question: "Can I become a mentor?",
            answer:
                "Apply via 'Become a Mentor' page.",
        },
        {
            id: 17,
            category: "General",
            question: "Are scholarships available?",
            answer:
                "Yes, need-based and merit-based.",
        },
        {
            id: 18,
            category: "Account",
            question: "How to update profile?",
            answer:
                "Go to 'My Profile' and edit details.",
        },
    ];

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [expanded, setExpanded] = useState([]);

    const categories = ["All", ...new Set(faqData.map((f) => f.category))];

    const handleToggle = (id) => {
        setExpanded((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const filteredData = faqData.filter((item) => {
        const matchesCategory =
            selectedCategory === "All" || item.category === selectedCategory;

        const matchesSearch =
            item.question.toLowerCase().includes(search.toLowerCase()) ||
            item.answer.toLowerCase().includes(search.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <Box maxWidth="900px" mx="auto" p={3}>
            <Typography variant="h4" textAlign="center" mb={3} fontWeight="bold">
                Frequently Asked Questions
            </Typography>

            <TextField
                fullWidth
                label="Search FAQs..."
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Box mb={3} display="flex" gap={1} flexWrap="wrap">
                {categories.map((cat) => (
                    <Chip
                        key={cat}
                        label={cat}
                        clickable
                        color={selectedCategory === cat ? "primary" : "default"}
                        onClick={() => setSelectedCategory(cat)}
                        variant={selectedCategory === cat ? "filled" : "outlined"}
                    />
                ))}
            </Box>

            {filteredData.map((item) => (
                <Accordion
                    key={item.id}
                    expanded={expanded.includes(item.id)}
                    onChange={() => handleToggle(item.id)}
                    sx={{ mb: 1 }}
                >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight="bold">
                            {item.question}
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        <Typography color="text.secondary">
                            {item.answer}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ))}

            {filteredData.length === 0 && (
                <Typography textAlign="center" mt={3} color="text.secondary">
                    No FAQs found 😔
                </Typography>
            )}
        </Box>
    );
}