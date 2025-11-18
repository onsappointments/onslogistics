"use client";

export default function ContactForm() {
  return (
    <section
      id="contact-form"
      className="bg-[#F5F5F7] py-24 px-6 md:px-16 flex justify-center"
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-10 w-full max-w-2xl">
        <h2 className="text-4xl font-semibold text-center mb-10 font-['SF Pro Display']">
          Send a Message
        </h2>

        <form
          action="https://formspree.io/f/mjkjvqjp"
          method="POST"
          className="flex flex-col gap-6"
        >
          <input
            type="text"
            name="Full Name"
            placeholder="Full Name"
            required
            className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="Email"
            placeholder="Email"
            required
            className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            name="Phone"
            placeholder="Phone Number"
            required
            className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="Subject"
            placeholder="Subject"
            className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="Message"
            placeholder="Message"
            rows="5"
            required
            className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>

          <button
            type="submit"
            className="px-10 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-medium text-lg"
          >
            Submit Message
          </button>
        </form>
      </div>
    </section>
  );
}
