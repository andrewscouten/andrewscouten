import Navbar from "@/components/Navbar";
import Me from "@/components/Me";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Publications from "@/components/Publications";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Me />
      <About />
      <Experience />
      <Projects />
      <Publications />
      <Skills />
      <Contact />
      <Footer />
    </main>
  );
}
