"use client";

export default function AppointmentHero() {
  const scrollToForm = () => {
    const formSection = document.getElementById("book-appointment");
    formSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[90vh] flex flex-col justify-center items-center text-center overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/booking-bg.jpg')" }}
      ></div>

      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl md:text-6xl font-semibold text-white mb-8 drop-shadow-lg font-['SF Pro Display']">
          Book Your Appointment
        </h1>

        <button
          onClick={scrollToForm}
          className="px-10 py-4 border-2 border-white text-white rounded-full text-lg font-medium
                     hover:bg-white hover:text-black transition duration-300 ease-in-out shadow-md"
        >
          BOOK NOW
        </button>

        {/* 🔔 PAYMENT NOTICE */}
        <p className="text-white/80 text-sm mt-3 italic">
          *Booking requires a paid confirmation fee
        </p>
      </div>
    </section>
  );
}
