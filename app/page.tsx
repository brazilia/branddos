import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-#3e5879 text-213555 flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
