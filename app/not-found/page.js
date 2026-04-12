"use client";

import Link from "next/link";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
            <h1 className="text-6xl font-bold text-red-500">404</h1>
            <p className="text-xl mt-4">Oops! Page not found 😢</p>

            <Link
                href="/"
                className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;