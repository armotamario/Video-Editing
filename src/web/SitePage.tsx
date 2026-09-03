import { bodyFont, serifFont } from "../fonts";
import type { Site } from "./sites";

/** Nominal design width every site mock is laid out at before being scaled. */
export const SITE_WIDTH = 1200;
export const SITE_HEIGHT = 1880;

/**
 * A complete, natively rendered marketing site — nav, hero, proof strip,
 * service list and footer. Never a screenshot: it scales cleanly into any
 * device frame and stays crisp at 1080x1920.
 */
export const SitePage: React.FC<{ site: Site }> = ({ site }) => {
  return (
    <div
      style={{ width: SITE_WIDTH, background: site.bg, color: site.ink, fontFamily: site.bodyFont }}
    >
      <div
        style={{ borderBottom: `1px solid ${site.line}` }}
        className="flex items-center justify-between px-14 py-9"
      >
        <div
          style={{ fontFamily: site.headingFont, letterSpacing: site.headingTracking }}
          className="text-[30px]"
        >
          {site.name}
        </div>
        <div className="flex items-center gap-11">
          {site.nav.map((item) => (
            <div key={item} style={{ color: site.inkSoft }} className="text-[19px] font-medium">
              {item}
            </div>
          ))}
          <div
            style={{ background: site.accent, color: site.onAccent }}
            className="rounded-full px-8 py-3.5 text-[19px] font-bold"
          >
            {site.cta}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-16 px-14 pb-20 pt-24">
        <div className="flex-1">
          <div
            style={{ color: site.accent }}
            className="text-[17px] font-bold uppercase tracking-[0.28em]"
          >
            {site.heroKicker}
          </div>
          <div
            style={{
              fontFamily: site.headingFont,
              letterSpacing: site.headingTracking,
              lineHeight: 0.98,
            }}
            className="mt-8 text-[96px]"
          >
            {site.heroTitle.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
          <div style={{ color: site.inkSoft }} className="mt-8 max-w-[520px] text-[24px] leading-snug">
            {site.heroSub}
          </div>
          <div className="mt-12 flex items-center gap-5">
            <div
              style={{ background: site.accent, color: site.onAccent }}
              className="rounded-full px-11 py-5 text-[23px] font-bold"
            >
              {site.cta}
            </div>
            <div
              style={{ border: `2px solid ${site.line}`, color: site.ink }}
              className="rounded-full px-11 py-5 text-[23px] font-bold"
            >
              {site.ctaGhost}
            </div>
          </div>
        </div>

        <div
          style={{
            background: `radial-gradient(circle at 50% 38%, ${site.accent}44 0%, ${site.panel} 62%)`,
            border: `1px solid ${site.line}`,
          }}
          className="flex h-[520px] w-[440px] flex-none items-center justify-center rounded-[36px]"
        >
          <div
            style={{ background: site.accent, opacity: 0.9 }}
            className="h-[210px] w-[210px] rounded-full"
          />
        </div>
      </div>

      <div
        style={{ borderTop: `1px solid ${site.line}`, borderBottom: `1px solid ${site.line}` }}
        className="flex justify-between px-14 py-9"
      >
        {site.chips.map((chip) => (
          <div key={chip} style={{ color: site.inkSoft }} className="text-[21px] font-bold">
            {chip}
          </div>
        ))}
      </div>

      <div className="px-14 pb-16 pt-20">
        <div
          style={{ color: site.accent }}
          className="text-[17px] font-bold uppercase tracking-[0.28em]"
        >
          {site.sectionKicker}
        </div>
        <div
          style={{ fontFamily: site.headingFont, letterSpacing: site.headingTracking }}
          className="mt-6 text-[62px] leading-none"
        >
          {site.sectionTitle}
        </div>

        <div className="mt-14">
          {site.rows.map((row) => (
            <div
              key={row.title}
              style={{ borderTop: `1px solid ${site.line}` }}
              className="flex items-center justify-between py-9"
            >
              <div className="flex-1">
                <div className="text-[30px] font-bold">{row.title}</div>
                <div style={{ color: site.inkSoft }} className="mt-2 text-[21px]">
                  {row.note}
                </div>
              </div>
              <div style={{ color: site.accent }} className="text-[30px] font-bold">
                {row.price}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{ background: site.panel }}
        className="flex items-center justify-between px-14 py-14"
      >
        <div>
          <div
            style={{ fontFamily: site.headingFont, letterSpacing: site.headingTracking }}
            className="text-[34px]"
          >
            {site.name}
          </div>
          <div style={{ color: site.inkSoft }} className="mt-3 text-[21px]">
            {site.footNote}
          </div>
        </div>
        <div
          style={{ background: site.accent, color: site.onAccent }}
          className="rounded-full px-10 py-5 text-[23px] font-bold"
        >
          {site.cta}
        </div>
      </div>
    </div>
  );
};

/** The site the client had before — cramped, centred, blue-underlined, 2009. */
export const DatedPage: React.FC<{ site: Site }> = ({ site }) => {
  const serif = "'Liberation Serif', 'Times New Roman', Times, serif";
  return (
    <div
      style={{
        width: SITE_WIDTH,
        minHeight: SITE_HEIGHT,
        background: "#ffffff",
        color: "#000000",
        fontFamily: serif,
      }}
      className="text-center"
    >
      <div style={{ background: "#1c3f94" }} className="px-8 py-7">
        <div style={{ color: "#ffe14d", fontFamily: serif }} className="text-[52px] font-bold">
          {site.name}
        </div>
        <div style={{ color: "#cfd9f2" }} className="mt-1 text-[22px] italic">
          Welcome to our website!
        </div>
      </div>

      <div style={{ background: "#e8e8e8", borderBottom: "2px solid #999" }} className="py-4">
        {site.nav.map((item, i) => (
          <span key={item} style={{ color: "#0000ee" }} className="text-[20px] underline">
            {i > 0 ? " | " : ""}
            {item}
          </span>
        ))}
      </div>

      <div className="px-24 pt-12">
        <div className="text-[30px] font-bold underline">About Us</div>
        <div className="mx-auto mt-5 max-w-[820px] text-[19px] leading-tight">
          {site.heroSub} We have been proudly serving the local area for many years and pride
          ourselves on quality workmanship, competitive prices and friendly, reliable service at all
          times. Please browse our website to find out more about the services that we offer to our
          valued customers.
        </div>

        <table className="mx-auto mt-10 w-[720px] border-collapse text-[19px]">
          <tbody>
            {site.rows.map((row) => (
              <tr key={row.title}>
                <td style={{ border: "1px solid #666", background: "#f2f2f2" }} className="px-4 py-2 text-left">
                  {row.title}
                </td>
                <td style={{ border: "1px solid #666" }} className="px-4 py-2 text-left">
                  {row.note}
                </td>
                <td style={{ border: "1px solid #666" }} className="px-4 py-2">
                  {row.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-10 text-[19px]">
          For enquiries please email{" "}
          <span style={{ color: "#0000ee" }} className="underline">
            info@{site.key}business.com.au
          </span>{" "}
          or phone during business hours.
        </div>
        <div style={{ fontFamily: bodyFont, color: "#777" }} className="mt-8 text-[16px]">
          Best viewed at 1024x768 · Last updated 14/03/2011
        </div>
        <div style={{ fontFamily: serifFont, color: "#aaa" }} className="mt-2 text-[15px]">
          You are visitor number 004182
        </div>

        <div className="mt-12 text-[30px] font-bold underline">Testimonials</div>
        <div className="mx-auto mt-4 max-w-[760px] text-[19px] italic leading-tight">
          &quot;Great service, would recommend to anyone in the area.&quot; &mdash; A. Customer
        </div>
        <div className="mx-auto mt-3 max-w-[760px] text-[19px] italic leading-tight">
          &quot;Very happy with the work that was carried out.&quot; &mdash; J. Smith
        </div>
      </div>

      <div style={{ background: "#1c3f94", color: "#cfd9f2" }} className="mt-14 py-6 text-[17px]">
        Copyright {String.fromCharCode(169)} {site.name} &nbsp;|&nbsp; All rights reserved
      </div>
    </div>
  );
};

export const MOBILE_WIDTH = 430;
export const MOBILE_HEIGHT = 1258;

/** The same brand laid out properly for a phone, not a shrunken desktop page. */
export const MobilePage: React.FC<{ site: Site }> = ({ site }) => {
  return (
    <div
      style={{
        width: MOBILE_WIDTH,
        background: site.bg,
        color: site.ink,
        fontFamily: site.bodyFont,
      }}
    >
      <div
        style={{ borderBottom: `1px solid ${site.line}` }}
        className="flex items-center justify-between px-6 py-5"
      >
        <div
          style={{ fontFamily: site.headingFont, letterSpacing: site.headingTracking }}
          className="text-[19px]"
        >
          {site.name}
        </div>
        <div className="flex flex-col gap-[5px]">
          <div style={{ background: site.ink }} className="h-[2px] w-[22px]" />
          <div style={{ background: site.ink }} className="h-[2px] w-[22px]" />
          <div style={{ background: site.ink }} className="h-[2px] w-[22px]" />
        </div>
      </div>

      <div className="px-6 pb-9 pt-9">
        <div
          style={{ color: site.accent }}
          className="text-[11px] font-bold uppercase tracking-[0.24em]"
        >
          {site.heroKicker}
        </div>
        <div
          style={{
            fontFamily: site.headingFont,
            letterSpacing: site.headingTracking,
            lineHeight: 1.0,
          }}
          className="mt-4 text-[46px]"
        >
          {site.heroTitle.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
        <div style={{ color: site.inkSoft }} className="mt-4 text-[15px] leading-snug">
          {site.heroSub}
        </div>
        <div
          style={{ background: site.accent, color: site.onAccent }}
          className="mt-6 rounded-full py-4 text-center text-[16px] font-bold"
        >
          {site.cta}
        </div>
        <div
          style={{ border: `2px solid ${site.line}` }}
          className="mt-3 rounded-full py-4 text-center text-[16px] font-bold"
        >
          {site.ctaGhost}
        </div>
      </div>

      <div
        style={{
          background: `radial-gradient(circle at 50% 45%, ${site.accent}44 0%, ${site.panel} 65%)`,
        }}
        className="mx-6 flex h-[230px] items-center justify-center rounded-[26px]"
      >
        <div style={{ background: site.accent, opacity: 0.9 }} className="h-[110px] w-[110px] rounded-full" />
      </div>

      <div className="px-6 pb-6 pt-9">
        <div
          style={{ color: site.accent }}
          className="text-[11px] font-bold uppercase tracking-[0.24em]"
        >
          {site.sectionKicker}
        </div>
        <div
          style={{ fontFamily: site.headingFont, letterSpacing: site.headingTracking }}
          className="mt-3 text-[32px] leading-none"
        >
          {site.sectionTitle}
        </div>
        <div className="mt-6">
          {site.rows.map((row) => (
            <div
              key={row.title}
              style={{ borderTop: `1px solid ${site.line}` }}
              className="flex items-center justify-between gap-4 py-5"
            >
              <div>
                <div className="text-[17px] font-bold">{row.title}</div>
                <div style={{ color: site.inkSoft }} className="mt-1 text-[13px] leading-snug">
                  {row.note}
                </div>
              </div>
              <div style={{ color: site.accent }} className="text-[17px] font-bold">
                {row.price}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: site.panel }} className="px-6 py-8 text-center">
        <div
          style={{ fontFamily: site.headingFont, letterSpacing: site.headingTracking }}
          className="text-[20px]"
        >
          {site.name}
        </div>
        <div style={{ color: site.inkSoft }} className="mt-2 text-[13px]">
          {site.footNote}
        </div>
      </div>
    </div>
  );
};
