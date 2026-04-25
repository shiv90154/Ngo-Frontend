import MarketProducts from "@/components/agriculture/MarketProducts";

type PageProps = {
    params: {
        productId: string;
    };
};

export default function Page({ params }: PageProps): JSX.Element {
    return <MarketProducts productId={params.productId} />;
}