import Image from "next/image";
import Hero from "../Components/Hero";

export default function Home() {
  return (
    <main className="bg-[--color-background]">
      {/* HERO SECTION */}
      <Hero />

      {/* ABOUT SECTION */}
      <section
        className="flex flex-col items-center text-center px-6 py-10"
      >
        {/* Heading */}
       <div id="about" className="p-10 rounded-3xl ">
           <h2 className="text-[6rem] md:text-[5rem] font-semibold mb-6 ml-6">About Us</h2>
        <div className="flex p-3 justify-center items-center gap-28">
        <Image src="/about-us.jpeg" alt="About Us" width={600} height={600} className="rounded-2xl"></Image>
        <p className="max-w-2xl text-gray-600 w-96 text-[1.1rem] text-left">
         ONS Logistics India Pvt. Ltd. is your trusted partner in global shipping, logistics, and custom clearance. We deliver efficiency, reliability, and transparency across every shipment — ensuring your goods reach their destination safely and on time.
Backed by industry expertise and a strong global network, we offer end-to-end logistics solutions tailored to the unique requirements of each client. Our dedicated team manages every stage of the supply chain with precision, from documentation and compliance to transportation and last-mile delivery. With a strong focus on customer satisfaction, operational excellence, and timely execution, we help businesses move cargo seamlessly across borders and grow with confidence in international trade.
        </p>  
        </div>
       </div>

        {/* Glass Container */}
        
        <div className="w-full max-w-6xl bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.06)] p-10 mt-16">
          
          {/* ROW 1 — IMAGE LEFT, TEXT RIGHT */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            {/* Image */}
            <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-md">
              <img
                src="/about-photo.jpg"
                alt="Global logistics and freight forwarding operations by ONS Logistics"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="text-left">
              <h3 className="text-3xl font-semibold mb-4 text-gray-900">
                We move the world.
              </h3>
              <p className="text-gray-700 leading-relaxed">
                At ONS Logistics India Pvt. Ltd., every shipment reflects our commitment to
                precision, trust, and seamless global movement. We understand
                that in today’s fast-paced trade environment, businesses rely on
                logistics partners who can deliver reliability, transparency,
                and speed across every stage of transportation.
                <br />
                <br />
                Our expertise spans international freight forwarding,
                multimodal transportation, customs clearance, warehousing, and
                supply chain optimization. With strong partnerships across
                shipping lines, air carriers, and port authorities, we ensure
                every shipment is handled with the highest standards of safety
                and efficiency.
              </p>
            </div>
          </div>

          {/* ROW 2 — TEXT LEFT, IMAGE RIGHT */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-left">
              <p className="text-gray-700 leading-relaxed">
                From containerized shipments and industrial cargo to
                time-critical deliveries and specialized freight, we tailor our
                logistics solutions to your exact requirements.
                <br />
                <br />
                Our advanced tracking systems provide real-time visibility,
                while our dedicated operations team manages documentation,
                compliance, customs guidance, and last-mile coordination with
                unmatched accuracy.
                <br />
                <br />
                At ONS Logistics India Pvt. Ltd. , we don’t just move cargo — we move global trade
                forward with reliability, expertise, and a promise of on-time
                delivery across oceans, skies, roads, and borders. 
              </p>
            </div>

            {/* Image */}
            <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-md">
              <img
                src="/about-photo2.jpg"
                alt="International shipping containers and cranes handled by ONS Logistics"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

<div className="w-full mt-20 overflow-x-hidden">
  <div className="flex w-max animate-loop gap-12 px-4 object-fit">
    {[
      { img: "/concor.png", text: "Concor's empanalled CHA" },
      { img: "/crissCross.png", text: "Member" },
      { img: "/msme.png", text: "" },
      { img: "/dgos.png", text: "MTO Registration" },
    ]
      .concat([
        { img: "/concor.png", text: "Concor's empanalled CHA" },
        { img: "/crissCross.png", text: "Member" },
        { img: "/msme.png", text: "" },
        { img: "/dgos.png", text: "MTO Registration" },
      ])
      .map((item, index) => (
        <div
          key={index}
          className="min-w-[260px] flex flex-col items-center"
        >
          <img
            src={item.img}
            alt={item.text}
            className="w-full h-40 object-cover rounded-xl"
          />
          <p className="mt-4 text-sm font-medium text-gray-800">
            {item.text}
          </p>
        </div>
      ))}
  </div>
</div>

      </section>
    </main>
  ); 
}
