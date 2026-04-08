'use client';

import { useState, type FormEvent } from 'react';
import { RevealOnScroll } from '@/components/Motion';

interface ContactFormDict {
  heading: string;
  subheading: string;
  subjects: {
    placeholder: string;
    manufacturing: string;
    partnership: string;
    sampling: string;
    visit: string;
    other: string;
  };
  fields: {
    fullName: string;
    email: string;
    company: string;
    phone: string;
    subject: string;
    message: string;
  };
  placeholders: {
    name: string;
    email: string;
    company: string;
    phone: string;
    message: string;
  };
  sendButton: string;
  sending: string;
  sent: string;
  error: string;
  infoCards: {
    address: string;
    addressLines: string[];
    email: string;
    phone: string;
    hours: string;
    hourLines: string[];
  };
}

export default function ContactForm({ dict }: { dict: ContactFormDict }) {
  const subjects = [
    { value: '', label: dict.subjects.placeholder },
    { value: 'manufacturing', label: dict.subjects.manufacturing },
    { value: 'partnership', label: dict.subjects.partnership },
    { value: 'sampling', label: dict.subjects.sampling },
    { value: 'visit', label: dict.subjects.visit },
    { value: 'other', label: dict.subjects.other },
  ];

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setError('');
    setSending(true);
    const data = new FormData(form);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          company: data.get('company') || '',
          subject: data.get('subject') || 'General Inquiry',
          message: data.get('message'),
        }),
      });
      if (!res.ok) throw new Error('Failed to send');
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); form.reset(); }, 3000);
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
      {/* Form */}
      <RevealOnScroll>
        <div className="rounded-2xl border border-brand-sand/60 bg-white p-8 shadow-card-light">
          <h2 className="font-display text-2xl font-bold text-brand-dark">
            {dict.heading}
          </h2>
          <p className="mt-1 text-sm text-brand-grey">
            {dict.subheading}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={dict.fields.fullName} name="name" type="text" placeholder={dict.placeholders.name} required />
              <Field label={dict.fields.email} name="email" type="email" placeholder={dict.placeholders.email} required />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={dict.fields.company} name="company" type="text" placeholder={dict.placeholders.company} />
              <Field label={dict.fields.phone} name="phone" type="tel" placeholder={dict.placeholders.phone} />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-brand-grey-light">
                {dict.fields.subject}
              </label>
              <select
                name="subject"
                defaultValue=""
                className="w-full appearance-none rounded-xl border border-brand-sand bg-brand-cream px-4 py-3.5 text-sm text-brand-dark outline-none transition-all focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
              >
                {subjects.map((s) => (
                  <option key={s.value} value={s.value} disabled={s.value === ''}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-brand-grey-light">
                {dict.fields.message}
              </label>
              <textarea
                name="message"
                rows={5}
                required
                placeholder={dict.placeholders.message}
                className="w-full resize-y rounded-xl border border-brand-sand bg-brand-cream px-4 py-3.5 text-sm text-brand-dark outline-none transition-all focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
              />
            </div>

            <button
              type="submit"
              disabled={submitted || sending}
              className="group inline-flex items-center gap-2 rounded-full bg-brand-accent px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-accent-light hover:shadow-glow disabled:opacity-60"
            >
              {submitted ? (
                dict.sent
              ) : sending ? (
                dict.sending
              ) : (
                <>
                  {dict.sendButton}
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
            {error && <p className="mt-2 text-sm text-red-400">{dict.error}</p>}
          </form>
        </div>
      </RevealOnScroll>

      {/* Info column */}
      <div className="flex flex-col gap-5">
        <RevealOnScroll delay={0.1}>
          <InfoCard
            icon={<MapPinIcon />}
            title={dict.infoCards.address}
            lines={dict.infoCards.addressLines}
          />
        </RevealOnScroll>
        <RevealOnScroll delay={0.15}>
          <InfoCard
            icon={<MailIcon />}
            title={dict.infoCards.email}
            lines={['bilgi@akarorme.com']}
          />
        </RevealOnScroll>
        <RevealOnScroll delay={0.2}>
          <InfoCard
            icon={<PhoneIcon />}
            title={dict.infoCards.phone}
            lines={['—']}
          />
        </RevealOnScroll>
        <RevealOnScroll delay={0.25}>
          <InfoCard
            icon={<ClockIcon />}
            title={dict.infoCards.hours}
            lines={dict.infoCards.hourLines}
          />
        </RevealOnScroll>

        {/* Map */}
        <RevealOnScroll delay={0.3}>
          <div className="overflow-hidden rounded-2xl border border-brand-sand/60 bg-white">
            <iframe
              src="https://www.google.com/maps?q=2VCH%2BQG+G%C3%BCng%C3%B6ren,+%C4%B0stanbul&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Akar Örme Factory Location"
              className="aspect-video w-full"
              allowFullScreen
            />
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}

/* ── Field helper ── */
function Field({
  label,
  name,
  type,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-brand-grey-light">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-brand-sand bg-brand-cream px-4 py-3.5 text-sm text-brand-dark outline-none transition-all placeholder:text-brand-grey focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
      />
    </div>
  );
}

/* ── Info card ── */
function InfoCard({
  icon,
  title,
  lines,
}: {
  icon: React.ReactNode;
  title: string;
  lines: string[];
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-brand-sand/60 bg-white p-6 transition-all hover:border-brand-accent/20 hover:shadow-card-hover hover:translate-x-1">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-accent/10 text-brand-accent-dark">
        {icon}
      </div>
      <div>
        <h4 className="font-display text-sm font-semibold text-brand-dark">{title}</h4>
        {lines.map((line, i) => (
          <p key={i} className="text-sm text-brand-grey leading-relaxed">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

/* ── SVG icons ── */
function MapPinIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx={12} cy={10} r={3} />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x={2} y={4} width={20} height={16} rx={2} />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx={12} cy={12} r={10} />
      <path d="M12 6v6l4 2" strokeLinecap="round" />
    </svg>
  );
}
