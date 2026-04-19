import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HeadFootLayout({ children }) {
    return (
        <>
          
            <main>
                {children}
            </main>
           
        </>
    );
}