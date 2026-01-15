'use client';
export default function QuoteRejectedPage() {



  return (
    <>
      <div 
        className="min-h-screen flex items-center justify-center p-5 relative overflow-x-hidden"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)'
        }}
      >
        {/* Background overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(107, 114, 128, 0.08) 0%, transparent 50%)
            `
          }}
        />

        {/* Main container */}
        <div className="max-w-[700px] w-full bg-[#fafafa] rounded-sm shadow-[0_25px_60px_rgba(0,0,0,0.4)] relative overflow-hidden animate-slideUp">
          {/* Accent bar */}
          <div 
            className="h-1.5"
            style={{
              background: 'linear-gradient(90deg, #ef4444 0%, #991b1b 100%)'
            }}
          />
          
          {/* Header */}
          <div className="px-12 pt-12 pb-7 text-center relative max-md:px-7">
            {/* X Mark */}
            <div className="w-[100px] h-[100px] mx-auto mb-6 relative animate-scaleIn">
              <div 
                className="w-full h-full rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(239,68,68,0.3)]"
                style={{
                  background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)'
                }}
              >
                <svg className="w-11 h-11 stroke-white stroke-[3] fill-none animate-drawX" viewBox="0 0 52 52" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 16l20 20M36 16l-20 20" />
                </svg>
              </div>
            </div>

            <h1 
              className="text-[2.8rem] font-bold text-[#1a1a2e] mb-3 tracking-tight animate-fadeIn-1 max-md:text-4xl"
              style={{ fontFamily: "'Crimson Pro', serif" }}
            >
              Quote has been Rejected
            </h1>
            <p className="text-lg text-[#5a5a5a] font-normal animate-fadeIn-2">
              Your quote request will be reviewed again. Please contact support if you have any questions.
            </p>

            
            {/* Message box */}
            <div 
              className="p-7 rounded-sm mb-7 animate-fadeIn-4"
              style={{
                background: 'linear-gradient(135deg, #fef2f2 0%, #fff5f5 100%)'
              }}
            >
              <h2 
                className="text-2xl text-[#1a1a2e] mb-5 font-bold"
                style={{ fontFamily: "'Crimson Pro', serif" }}
              >
                We're Here to Help
              </h2>
              
             

              <div className="bg-white p-5 rounded border border-[#fee2e2]">
                <h3 className="text-base text-[#1a1a2e] mb-3 font-semibold">
                  What You Can Do Next:
                </h3>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-3">
                    <span className="text-[#ef4444] font-bold mt-0.5">•</span>
                    <span className="text-sm text-[#4a4a4a] leading-relaxed">
                      <strong>Contact our team</strong> to discuss alternative options or clarify your requirements
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#ef4444] font-bold mt-0.5">•</span>
                    <span className="text-sm text-[#4a4a4a] leading-relaxed">
                      <strong>Wait until </strong>  we reach out with revised proposals or solutions tailored to your needs
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#ef4444] font-bold mt-0.5">•</span>
                    <span className="text-sm text-[#4a4a4a] leading-relaxed">
                      <strong>Schedule a consultation</strong> with our experts to explore other solutions
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="text-center p-5 bg-white border-t border-[#e5e5e5] animate-fadeIn-6">
            <p className="text-[#7a7a7a] text-sm mb-2">
              Have questions about this decision?
            </p>
            <p className="text-[#7a7a7a] text-sm">
              Call us at <a href="tel:+1800-890-7365" className="text-[#dc2626] no-underline font-semibold transition-colors duration-300 hover:text-[#991b1b]">+91 1800-890-7365</a> or{' '}
              email <a href="mailto:info@onslog.com" className="text-[#dc2626] no-underline font-semibold transition-colors duration-300 hover:text-[#991b1b]">info@onslog.com</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}