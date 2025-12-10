import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "./ui/button";
import { useCart } from "./cart/CartContext";
import CloudinaryImage, { Props as CloudinaryImageProps } from "./CloudinaryImage";

interface ProductCardProps {
  id?: string;
  name?: string;
  brand?: string;
  designer?: string;
  price?: number;
  image?: CloudinaryImageProps;
  onQuickAdd?: () => void;
}

const ProductCard = ({
  id = "1",
  name = "Pendant Light",
  designer = "",
  brand = "Roots Studio",
  price = 299,
  image,
  images = [],
  onQuickAdd,
}: ProductCardProps & { images?: CloudinaryImageProps[] }) => {
  const { addItem, enabled: cartEnabled } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  // Combine single image and images array, filtering valid ones
  const allImages = React.useMemo(() => {
    const imgs = images && images.length > 0 ? images : (image ? [image] : []);
    return imgs.filter(img => img.publicId);
  }, [image, images]);

  const currentImage = allImages[currentImageIndex];
  const imageAlt = currentImage?.alt?.trim() ? currentImage.alt : name;

  React.useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentImageIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    emblaApi?.scrollNext();
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    emblaApi?.scrollPrev();
  };

  const handleQuickAdd = () => {
    if (!cartEnabled) {
      return;
    }

    if (onQuickAdd) {
      onQuickAdd();
      return;
    }

    if (!id) {
      return;
    }

    addItem({
      id,
      name,
      brand,
      price,
      image: currentImage,
    });
  };

  return (
    <motion.div
      className="group relative w-full h-full bg-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/product/${id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100" ref={emblaRef}>
          <div className="flex h-full touch-pan-y">
            {allImages.map((img, index) => (
              <div
                key={`${img.publicId}-${index}`}
                className="flex-[0_0_100%] min-w-0 h-full relative"
              >
                <CloudinaryImage
                  publicId={img.publicId}
                  alt={img.alt?.trim() ? img.alt : name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            ))}
          </div>

          {allImages.length === 0 && (
            <div
              aria-hidden="true"
              className="w-full h-full bg-gray-100 transition-transform duration-700 group-hover:scale-105 absolute inset-0"
            />
          )}

          {/* Carousel Navigation - Always visible */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                disabled={currentImageIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full transition-opacity duration-200 hover:bg-white z-30 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
                aria-label="Previous image"
              >
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 9L1 5L5 1" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                disabled={currentImageIndex >= allImages.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full transition-opacity duration-200 hover:bg-white z-30 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
                aria-label="Next image"
              >
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 9L5 5L1 1" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-30 transition-opacity duration-200 pointer-events-none">
                {allImages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full shadow-sm transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Overlay that appears on hover */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        </div>
      </Link>

      {/* Quick add button that appears on hover */}
      {cartEnabled && (
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-10">
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleQuickAdd();
            }}
            variant="outline"
            className="w-full bg-white hover:bg-gray-100 border-gray-200 text-gray-900 text-sm font-light"
          >
            Quick Add
          </Button>
        </div>
      )}

      {/* Product info */}
      <div className="pt-4 pb-2 space-y-1 text-center">
        {brand && (
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
            {brand}
          </p>
        )}
        <h3 className="text-sm font-light text-gray-900">{name}</h3>
        <p className="text-sm font-light text-gray-700">${price}</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
