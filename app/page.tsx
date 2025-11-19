import Hero from "../Components/Hero.jsx";

export default function Home() {
  return (
    <main className="bg-[--color-background]">
      <Hero />
<section
  id="about"
  className="min-h-screen flex flex-col justify-top items-center text-center px-6 py-20 bg-[#F5F5F7]" > 
  <h2 className="text-3xl font-semibold mb-4">About Us</h2> 
  <p className="max-w-2xl text-gray-600 leading-relaxed"> 
    ONS Logistics is your trusted partner in global shipping, logistics, and custom clearance.
    We deliver efficiency, reliability, and transparency across every shipment — ensuring your goods reach their destination safely and on time.
  </p>

  {/* Main Rounded Container */}
  <div className="w-full max-w-6xl bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.06)] p-10 mt-16">


    {/* FIRST ROW — PHOTO LEFT + CONTENT RIGHT */}
    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
      {/* Photo */}
      <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-md">
        <img
          src="/about-photo.jpg"
          alt="Global logistics and freight forwarding operations by ONS Logistics"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div>
        <h3 className="text-3xl font-semibold mb-4 text-gray-900">
          We move the world.
        </h3>
        <p className="text-gray-700 leading-relaxed">
          At ONS Logistics, every shipment reflects our commitment to precision,
          trust, and seamless global movement. We understand that in today’s
          fast-paced trade environment, businesses rely on logistics partners
          who can deliver reliability, transparency, and speed across every
          stage of transportation. That’s why our team is dedicated to
          transforming complex logistics challenges into smooth,
          well-coordinated journeys—whether your cargo is moving across India
          or across continents. Our expertise covers a complete spectrum of
          logistics operations, including international freight forwarding,
          multimodal transportation, customs clearance, warehousing, and supply
          chain optimization. With strong partnerships across major shipping
          lines, air carriers, transport networks, and port authorities, we
          ensure that every shipment is handled with the highest standards of
          safety and efficiency.
        </p>
      </div>
    </div>

    {/* SECOND ROW — CONTENT LEFT + PHOTO RIGHT */}
    <div className="grid md:grid-cols-2 gap-12 items-center">
      {/* Content */}
      <div>
        <p className="text-gray-700 leading-relaxed">
          From containerized shipments and large-scale industrial cargo to
          time-critical deliveries and specialized freight, we tailor our
          solutions to fit your exact requirements. Our advanced tracking systems
          give you real-time visibility, enabling you to monitor your cargo at
          every milestone—enhancing planning, minimizing delays, and improving
          operational predictability. What truly sets ONS Logistics apart is our
          commitment to unified service excellence. Our dedicated operations team
          manages documentation, regulatory compliance, customs guidance, route
          planning, and last-mile coordination with unmatched accuracy. Every
          step is designed to reduce complexity, improve transit speed, and give
          your business the confidence to expand into new markets without
          logistical barriers.
          <br />
          <br />
          At ONS Logistics, we don’t just move cargo—we move global trade
          forward with reliability, expertise, and a promise of on-time delivery
          across oceans, skies, roads, and borders.
        </p>
      </div>

      {/* Photo */}
      <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-md">
        <img
          src="/about-photo2.jpg"
          alt="International shipping containers and cranes handled by ONS Logistics"
          className="w-full h-full object-cover"
        />
      </div>
    </div>

  </div>
</section>



    </main>
  );
}
