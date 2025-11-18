import ContactHero from "../../components/ContactHero.jsx";
import ContactForm from "../../components/ContactForm.jsx";

export default function ContactPage() {
  return (
    <main className="bg-[#F5F5F7] min-h-screen">
      <ContactHero />
      <ContactForm />
    </main>
  );
}