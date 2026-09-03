import {
  DatedPage,
  MOBILE_HEIGHT,
  MOBILE_WIDTH,
  MobilePage,
  SITE_HEIGHT,
  SITE_WIDTH,
  SitePage,
} from "./SitePage";
import type { Site } from "./sites";

type FrameProps = {
  site: Site;
  width: number;
  height: number;
  /** 0 = top of the page, 1 = bottom. */
  scroll?: number;
  dated?: boolean;
};

/** A site rendered at design size and scaled into a bezel-free rounded card. */
export const SiteCard: React.FC<FrameProps> = ({ site, width, height, scroll = 0, dated }) => {
  const scale = width / SITE_WIDTH;
  const travel = Math.max(0, SITE_HEIGHT - height / scale);

  const edge = dated ? "#ffffff" : site.bg;

  return (
    <div
      style={{
        width,
        height,
        background: edge,
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
      }}
      className="relative overflow-hidden rounded-[28px]"
    >
      <div
        style={{
          width: SITE_WIDTH,
          transform: `scale(${scale}) translateY(${-travel * scroll}px)`,
          transformOrigin: "top left",
        }}
      >
        {dated ? <DatedPage site={site} /> : <SitePage site={site} />}
      </div>

      {scroll > 0.001 ? (
        <div
          style={{ background: `linear-gradient(to bottom, ${edge}, transparent)` }}
          className="pointer-events-none absolute inset-x-0 top-0 h-[70px]"
        />
      ) : null}
      {scroll < 0.999 ? (
        <div
          style={{ background: `linear-gradient(to top, ${edge}, transparent)` }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[70px]"
        />
      ) : null}
    </div>
  );
};

/** The same brand at phone width, inside a rounded handset body. */
export const PhoneCard: React.FC<{ site: Site; height: number; scroll?: number }> = ({
  site,
  height,
  scroll = 0,
}) => {
  const bezel = 14;
  const screenHeight = height - bezel * 2;
  const scale = screenHeight / 930;
  const screenWidth = Math.round(MOBILE_WIDTH * scale);
  const travel = Math.max(0, MOBILE_HEIGHT - screenHeight / scale);

  return (
    <div
      style={{
        width: screenWidth + bezel * 2,
        height,
        background: "#000000",
        padding: bezel,
        boxShadow: "0 40px 90px rgba(0,0,0,0.6)",
      }}
      className="rounded-[54px]"
    >
      <div
        style={{ width: screenWidth, height: screenHeight, background: site.bg }}
        className="overflow-hidden rounded-[42px]"
      >
        <div
          style={{
            width: MOBILE_WIDTH,
            transform: `scale(${scale}) translateY(${-travel * scroll}px)`,
            transformOrigin: "top left",
          }}
        >
          <MobilePage site={site} />
        </div>
      </div>
    </div>
  );
};

/** Old site under, new site over, revealed by a hard wipe with a gold seam. */
export const BeforeAfter: React.FC<{
  site: Site;
  width: number;
  height: number;
  /** 0 = all old, 1 = all new. */
  progress: number;
  scroll?: number;
}> = ({ site, width, height, progress, scroll = 0 }) => {
  const seam = Math.max(0, Math.min(1, progress));
  return (
    <div style={{ width, height }} className="relative">
      <SiteCard site={site} width={width} height={height} scroll={scroll} dated />
      <div
        style={{ clipPath: `inset(0 ${(1 - seam) * 100}% 0 0)` }}
        className="absolute inset-0 overflow-hidden"
      >
        <SiteCard site={site} width={width} height={height} scroll={scroll} />
      </div>
      {seam > 0.02 && seam < 0.98 ? (
        <div
          style={{ left: width * seam - 2, background: "#d0a45f" }}
          className="absolute top-0 h-full w-[4px]"
        />
      ) : null}
    </div>
  );
};
