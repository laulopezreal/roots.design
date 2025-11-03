import React, { useEffect, useMemo, useState } from "react";

export type Props = {
  /** Cloudinary public ID, e.g. "collections/modern-minimalist-01.jpg" */
  publicId: string;
  /** Override the Cloudinary cloud name (falls back to VITE_CLOUDINARY_CLOUD) */
  cloudName?: string;
  alt: string;
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
};

const DEFAULT_WIDTHS = [400, 800, 1200, 1600, 2000, 3000];

const ENV_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD;

type CloudinaryUrlOptions = {
  publicId: string;
  w: number;
  ar?: string;
  crop?: string;
  quality?: string;
  format?: string;
  dpr?: string | number;
};

function cldUrl(
  cldBase: string,
  {
    publicId,
    w,
    ar,
    crop,
    quality = "auto",
    format = "auto",
    dpr = "auto",
  }: CloudinaryUrlOptions,
) {
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

function cldBlurPlaceholder(cldBase: string, publicId: string, ar?: string) {
  const parts = ["f_jpg", "q_10", "e_blur:2000", "w_20"];
  if (ar) parts.push(`ar_${ar}`, "c_fill", "g_auto");
  return `${cldBase}${parts.join(",")}/${publicId}`;
}

export default function CloudinaryImage({
  publicId,
  cloudName,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  widths = DEFAULT_WIDTHS,
  aspect = "4:5",
  crop = "fill",
  priority = false,
  className = "",
  alt,
}: Props) {
  const [hasError, setHasError] = useState(false);
  const resolvedCloud = cloudName ?? ENV_CLOUD_NAME;
  const cldBase = resolvedCloud
    ? `https://res.cloudinary.com/${resolvedCloud}/image/upload/`
    : undefined;
  const isAbsolutePublicId = /^https?:\/\//i.test(publicId);
  const canTransform = Boolean(cldBase && !isAbsolutePublicId);

  useEffect(() => {
    if (!resolvedCloud && !isAbsolutePublicId) {
      console.warn(
        `CloudinaryImage: Missing cloud name for publicId "${publicId}". ` +
          `Attempted URL path "${publicId}". ` +
          "Set VITE_CLOUDINARY_CLOUD or provide the cloudName prop.",
      );
    }
  }, [resolvedCloud, isAbsolutePublicId, publicId]);

  const loading = priority ? "eager" : "lazy";
  const blurUrl = useMemo(() => {
    if (!canTransform) {
      return undefined;
    }
    return cldBlurPlaceholder(cldBase!, publicId, aspect);
  }, [canTransform, cldBase, publicId, aspect]);

  const srcSet = useMemo(() => {
    if (!canTransform) {
      return undefined;
    }

    return widths
      .map((w) => `${cldUrl(cldBase!, { publicId, w, ar: aspect, crop })} ${w}w`)
      .join(", ");
  }, [canTransform, cldBase, widths, publicId, aspect, crop]);

  const src = useMemo(() => {
    if (isAbsolutePublicId) {
      return publicId;
    }

    if (!canTransform) {
      return undefined;
    }

    const fallbackW = Math.min(1200, widths[widths.length - 1]);
    return cldUrl(cldBase!, { publicId, w: fallbackW, ar: aspect, crop });
  }, [canTransform, cldBase, publicId, isAbsolutePublicId, widths, aspect, crop]);

  const attemptedSrc = src ?? publicId;

  const handleImageError = () => {
    console.warn(
      `CloudinaryImage: Failed to load image from "${attemptedSrc}" (publicId: "${publicId}").`,
    );
    setHasError(true);
  };

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={className}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          aspectRatio: aspect.replace(":", " / "),
          backgroundColor: "#f3f4f6",
        }}
      />
    );
  }

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
        backgroundImage: blurUrl ? `url("${blurUrl}")` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onError={handleImageError}
    />
  );
}
