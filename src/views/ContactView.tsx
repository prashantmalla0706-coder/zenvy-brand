import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Check, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ContactView: React.FC = () => {
  const { showToast } = useShop();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Client Care');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    setSubmitted(true);
    showToast('Inquiry Transmitted', 'Our Zenvy Concierge will respond within 24 hours.');
  };

  const faqs = [
    {
      q: 'What are the global delivery timelines?',
      a: 'We ship all international orders via DHL Express. Deliveries to North America and Western Europe arrive within 2–4 business days. All shipments include full insurance and end-to-end tracking.',
    },
    {
      q: 'How does your 30-day return service operate?',
      a: 'We provide complimentary pre-paid return labels included inside every delivery box. Simply affix the label and schedule a courier pickup or drop at any authorized DHL location.',
    },
    {
      q: 'Are customs duties and import taxes included?',
      a: 'Yes. All prices displayed on our website are inclusive of all import duties and local value-added taxes (DDP - Delivered Duty Paid). There are zero hidden fees upon delivery.',
    },
    {
      q: 'Can I book a private styling consultation at your flagships?',
      a: 'Absolutely. We offer 45-minute private styling appointments at our SoHo, Le Marais, and Omotesando showrooms. Contact concierge@zenvy.com to reserve your private suite.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#737373]">
          Client Services
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight uppercase font-['Syne'] text-[#121212] mt-2">
          Concierge & Showrooms
        </h1>
        <p className="text-xs sm:text-sm text-[#666666] mt-3 font-light leading-relaxed">
          Our client advisors are available to assist with sizing advice, bespoke tailoring appointments, and order tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-[#F4F4F0] border border-[#121212]/10 p-6 md:p-10">
          <h2 className="text-lg font-bold uppercase tracking-wider font-['Syne'] text-[#121212] mb-1">
            Send A Message
          </h2>
          <p className="text-xs text-[#666666] mb-6">
            Expected response time: within 4–12 hours.
          </p>

          {submitted ? (
            <div className="p-8 bg-white border border-[#121212]/15 text-center space-y-3">
              <div className="w-12 h-12 bg-[#121212] text-white rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#121212]">
                Inquiry Received
              </h3>
              <p className="text-xs text-[#666666] max-w-xs mx-auto">
                Thank you, {name || 'Client'}. A dedicated concierge specialist has been assigned to your message and will email you shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="mt-4 px-6 py-2.5 bg-[#121212] text-white text-xs font-semibold uppercase tracking-wider"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#555555] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marc Jacobs"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-[#121212]/15 px-3 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#121212]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#555555] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-[#121212]/15 px-3 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#121212]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#555555] mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-[#121212]/15 px-3 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#121212]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#555555] mb-1">
                    Inquiry Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-white border border-[#121212]/15 px-3 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#121212]"
                  >
                    <option value="Client Care">Client Care & Sizing</option>
                    <option value="Order Tracking">Order & Delivery Inquiries</option>
                    <option value="Private Showroom">Private Showroom Appointment</option>
                    <option value="Press & Wholesale">Press & Wholesale Partnerships</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#555555] mb-1">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us how we can assist you..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white border border-[#121212]/15 p-3 text-xs text-[#121212] focus:outline-none focus:border-[#121212]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#121212] hover:bg-black text-white text-xs font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Transmit Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Global Showrooms & Direct Details */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#121212] mb-4">
              Direct Contact Lines
            </h3>
            <div className="space-y-3 text-xs text-[#555555]">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#121212]" />
                <span>concierge@zenvy.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#121212]" />
                <span>+1 (800) 492-3837 (Toll-Free Worldwide)</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#121212]" />
                <span>Advisors Available: Mon–Sat 9:00 AM – 8:00 PM EST</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#121212]/10">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#121212] mb-4">
              Flagship Showrooms
            </h3>
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-white border border-[#121212]/10">
                <p className="font-bold text-[#121212] uppercase tracking-wider">SoHo Flagship · New York</p>
                <p className="text-[#666666] mt-0.5">45 Crosby Street, New York, NY 10012</p>
                <p className="text-[#888888] mt-1 text-[11px]">Hours: Mon–Sun 11:00 AM – 7:00 PM</p>
              </div>

              <div className="p-4 bg-white border border-[#121212]/10">
                <p className="font-bold text-[#121212] uppercase tracking-wider">Le Marais · Paris</p>
                <p className="text-[#666666] mt-0.5">18 Rue Vieille du Temple, 75004 Paris</p>
                <p className="text-[#888888] mt-1 text-[11px]">Hours: Mon–Sat 11:00 AM – 8:00 PM</p>
              </div>

              <div className="p-4 bg-white border border-[#121212]/10">
                <p className="font-bold text-[#121212] uppercase tracking-wider">Omotesando · Tokyo</p>
                <p className="text-[#666666] mt-0.5">4-12-10 Jingumae, Shibuya-ku, Tokyo 150-0001</p>
                <p className="text-[#888888] mt-1 text-[11px]">Hours: Daily 11:00 AM – 8:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <section className="mt-20 pt-12 border-t border-[#121212]/10 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#737373]">
            Common Queries
          </span>
          <h2 className="text-2xl font-bold uppercase font-['Syne'] text-[#121212] mt-1">
            Client FAQ
          </h2>
        </div>

        <div className="divide-y divide-[#121212]/10 border-y border-[#121212]/10">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-4">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left font-semibold text-xs sm:text-sm uppercase tracking-wider text-[#121212]"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
              </button>
              {openFaq === idx && (
                <p className="pt-3 text-xs sm:text-sm text-[#555555] leading-relaxed font-light">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
