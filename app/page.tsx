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
    ONS Logistics is your trusted partner in global shipping, logistics, and custom clearance. We deliver efficiency, reliability, and transparency across every shipment — ensuring your goods reach their destination safely and on time.
  </p>
  <div className="w-full max-w-6xl mt-16 bg-white/60 backdrop-blur-xl rounded-3xl 
                  border border-white/20 shadow-[0_0_60px_rgba(0,0,0,0.06)] p-10 fade-in">

    <div className="grid md:grid-cols-2 gap-10 items-center">

      {/* PHOTO BOX */}
      <div className="w-full h-[300px] bg-gray-200 rounded-3xl overflow-hidden">
        <img
          src="/about-photo.jpg"
          alt="Logistics"
          className="w-full h-full object-cover"
        />
      </div>

      {/* TEXT BOX */}
      <div>
        <h3 className="text-3xl font-semibold mb-4 text-gray-900">
          We move the world.
        </h3>
        <p className="max-w-2xl text-gray-600 leading-relaxed">
         At ONS Logistics, every shipment carries our promise of precision and care. From global freight forwarding to customs expertise, we streamline complex supply chains into smooth, reliable journeys. With advanced tracking, trusted carrier partnerships, and a dedicated operations team, we ensure your cargo moves safely, efficiently, and exactly on time — across oceans, skies, and borders.
        </p>
      </div>

    </div>

  </div>
</section>


    </main>
  );
}
