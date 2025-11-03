import type { Props as CloudinaryImageProps } from "../components/CloudinaryImage";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD ?? "dez0k7k6x";
const DEFAULT_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px";
const DEFAULT_ASPECT = "4:5";

type ProductImageOptions = Partial<
  Pick<CloudinaryImageProps, "sizes" | "widths" | "aspect" | "crop" | "priority" | "className">
>;

function createProductImage(
  publicId: string,
  alt: string,
  options: ProductImageOptions = {},
): CloudinaryImageProps {
  return {
    cloudName: CLOUD_NAME,
    publicId,
    alt,
    sizes: DEFAULT_SIZES,
    aspect: DEFAULT_ASPECT,
    ...options,
  };
}

export const pendantLightImage = createProductImage(
  "2507-1_le16yg.jpg",
  "Brass pendant lamp suspended above a marble table",
);

export const dunasArmchairImage = createProductImage(
  "gem-1-2510_wofqln.png",
  "Curved upholstered armchair with wooden legs",
);

export const productImages = {
  pendantLight: pendantLightImage,
  dunasArmchair: dunasArmchairImage,
};

export type ProductImageKey = keyof typeof productImages;
