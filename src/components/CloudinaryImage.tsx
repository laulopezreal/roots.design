import React from "react";

type Props = {
  /** Cloudinary public ID, e.g. "collections/modern-minimalist-01.jpg" */
  publicId: string;
  /** CSS sizes string that matches your layout */
  sizes?: string;
  /** widths used to build srcset */
  widths?: number[];
  /** aspect ratio, e.g. "4:5", "1:1", "3:2" */
  aspect?: `${number}:${number}` | string;
  /** cropping mode (default: fill to preserve composition) */
  crop?: "fill" | "fit" | "thumb" | "pad" | "scale";
  /** eager-load hero images */
  priority?: boolean;
  className?: string;
  alt: string;
};

const DEFAULT_WIDTHS = [400, 800, 1200, 1600, 2000, 3000];

const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD;
const cldBase = `https://res.cloudinary.com/${cloud}/image/upload/`;

function cldUrl({
  publicId,
  w,
  ar,
  crop,
  quality = "auto",
  format = "auto",
  dpr = "auto",
}: {
  publicId: string;
  w: number;
  ar?: string;
  crop?: string;
  quality?: string;
  format?: string;
  dpr?: string | number;
}) {
  const parts = [
    `f_${format}`,        // AVIF/WebP/JPEG auto
    `q_${quality}`,       // quality auto (respects detail)
    `dpr_${dpr}`,         // retina aware
  ];
  if (crop) parts.push(`c_${crop}`, "g_auto"); // auto subject
  if (ar) parts.push(`ar_${ar}`);
  parts.push(`w_${w}`);
  return `${cldBase}${parts.join(",")}/${publicId}`;
}

function cldBlurPlaceholder(publicId: string, ar?: string) {
  const parts = ["f_jpg", "q_10", "e_blur:2000", "w_20"];
  if (ar) parts.push(`ar_${ar}`, "c_fill", "g_auto");
  return `${cldBase}${parts.join(",")}/${publicId}`;
}

export default function CloudinaryImage({
  publicId,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  widths = DEFAULT_WIDTHS,
  aspect = "4:5",
  crop = "fill",
  priority = false,
  className = "",
  alt,
}: Props) {
  const loading = priority ? "eager" : "lazy";
  const blurUrl = cldBlurPlaceholder(publicId, aspect);

  const srcSet = widths
    .map((w) => `${cldUrl({ publicId, w, ar: aspect, crop })} ${w}w`)
    .join(", ");

  const fallbackW = Math.min(1200, widths[widths.length - 1]);
  const src = cldUrl({ publicId, w: fallbackW, ar: aspect, crop });

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={loading}
      decoding="async"
      className={className}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        aspectRatio: aspect.replace(":", " / "),
        backgroundImage: `url("${blurUrl}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}
