import MarketProducts from "@/components/agriculture/MarketProducts";

export default function Page({ params }) {
    return <MarketProducts productId={params.productId} />;
}