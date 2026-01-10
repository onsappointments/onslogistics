    'use client';

    import { useState, useEffect } from 'react';
    import { useRouter } from 'next/navigation';

    export default function QuoteApprovedSuccess({ quoteData }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Default quote data if not provided
    const quote = quoteData || {
        referenceNo: 'RFQ-2025-00123',
        approvalDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
        }),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
        }),
        status: 'Approved',
        email: 'customer@example.com',
        phone: '+1 (234) 567-890'
    };

    return (
        <>
        <div 
            className="min-h-screen flex items-center justify-center p-5 relative overflow-x-hidden"
            style={{
            fontFamily: "'DM Sans', sans-serif",
            background: 'linear-gradient(135deg, #0a1628 0%, #1a2942 100%)'
            }}
        >
            {/* Background overlay */}
            <div 
            className="absolute inset-0 pointer-events-none"
            style={{
                backgroundImage: `
                radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(74, 139, 95, 0.1) 0%, transparent 50%)
                `
            }}
            />

            {/* Main container */}
            <div className="max-w-[700px] w-full bg-[#faf8f3] rounded-sm shadow-[0_25px_60px_rgba(0,0,0,0.4)] relative overflow-hidden animate-slideUp">
            {/* Accent bar */}
            <div 
                className="h-1.5"
                style={{
                background: 'linear-gradient(90deg, #d4af37 0%, #4a8b5f 100%)'
                }}
            />
            
            {/* Header */}
            <div className="px-12 pt-12 pb-7 text-center relative max-md:px-7">
                {/* Checkmark */}
                <div className="w-[100px] h-[100px] mx-auto mb-6 relative animate-scaleIn">
                <div 
                    className="w-full h-full rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(45,95,63,0.3)]"
                    style={{
                    background: 'linear-gradient(135deg, #2d5f3f 0%, #4a8b5f 100%)'
                    }}
                >
                    <svg className="w-11 h-11 stroke-white stroke-[3] fill-none animate-drawCheck" viewBox="0 0 52 52" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 27l8 8 16-16" />
                    </svg>
                </div>
                </div>

                <h1 
                className="text-[2.8rem] font-bold text-[#0a1628] mb-3 tracking-tight animate-fadeIn-1 max-md:text-4xl"
                style={{ fontFamily: "'Crimson Pro', serif" }}
                >
                Quote Approved Successfully
                </h1>
                <p className="text-lg text-[#5a5a5a] font-normal animate-fadeIn-2">
                Your technical quote has been confirmed
                </p>
            </div>

            {/* Content */}
            <div className="px-12 pb-10 max-md:px-7">

                {/* Next steps */}
                <div 
                className="p-7 rounded-sm mb-7 animate-fadeIn-4"
                style={{
                    background: 'linear-gradient(135deg, #f8f6f0 0%, #faf8f3 100%)'
                }}
                >
                <h2 
                    className="text-2xl text-[#0a1628] mb-5 font-bold"
                    style={{ fontFamily: "'Crimson Pro', serif" }}
                >
                    What Happens Next?
                </h2>
                
                {/* Step 1 */}
                <div className="flex gap-4 mb-5 items-start">
                    <div className="w-8 h-8 bg-[#d4af37] text-[#0a1628] rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    1
                    </div>
                    <div>
                    <h3 className="text-base text-[#0a1628] mb-1.5 font-semibold">
                        Confirmation Email Sent
                    </h3>
                    <p className="text-sm text-[#6a6a6a] leading-relaxed">
                        A detailed confirmation with your approved quote has been sent to our team.
                    </p>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 mb-5 items-start">
                    <div className="w-8 h-8 bg-[#d4af37] text-[#0a1628] rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    2
                    </div>
                    <div>
                    <h3 className="text-base text-[#0a1628] mb-1.5 font-semibold">
                        Account Manager Assignment
                    </h3>
                    <p className="text-sm text-[#6a6a6a] leading-relaxed">
                        Your dedicated quote manager will contact you within 24 hours to discuss the next steps and finalize arrangements.
                    </p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-[#d4af37] text-[#0a1628] rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    3
                    </div>
                    <div>
                    <h3 className="text-base text-[#0a1628] mb-1.5 font-semibold">
                        Documentation & Scheduling
                    </h3>
                    <p className="text-sm text-[#6a6a6a] leading-relaxed">
                        We'll work with you to complete necessary documentation and schedule your shipment according to your preferred timeline.
                    </p>
                    </div>
                </div>
                </div>
            </div>

            {/* Contact info */}
            <div className="text-center p-5 bg-white border-t border-[#e8e4d9] animate-fadeIn-6">
                <p className="text-[#7a7a7a] text-sm mb-2">
                Need immediate assistance?
                </p>
                <p className="text-[#7a7a7a] text-sm">
                Call us at <a href="tel:+1800-890-7365" className="text-[#2d5f3f] no-underline font-semibold transition-colors duration-300 hover:text-[#4a8b5f]">+91 1800-890-7365</a> or{' '}
                email <a href="mailto:info@onslog.com" className="text-[#2d5f3f] no-underline font-semibold transition-colors duration-300 hover:text-[#4a8b5f]">info@onslog.com</a>
                </p>
            </div>
            </div>
        </div>
        </>
    );
    }