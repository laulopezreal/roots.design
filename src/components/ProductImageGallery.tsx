import { useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import CloudinaryImage from './CloudinaryImage';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface ProductImage {
  id: string;
  cloudinary_public_id: string;
  alt_text: string | null;
  widths: number[];
  sizes: string | null;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  const scrollPrev = () => {
    emblaApi?.scrollPrev();
  };

  const scrollNext = () => {
    emblaApi?.scrollNext();
  };

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">No images available</p>
      </div>
    );
  }

  if (images.length === 1) {
    const image = images[0];
    return (
      <div className="w-full">
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          <CloudinaryImage
            publicId={image.cloudinary_public_id}
            alt={image.alt_text || productName}
            widths={image.widths}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Main image carousel */}
      <div className="relative">
        <div className="overflow-hidden rounded-lg" ref={emblaRef}>
          <div className="flex">
            {images.map((image) => (
              <div key={image.id} className="flex-[0_0_100%] min-w-0">
                <div className="aspect-square bg-gray-100">
                  <CloudinaryImage
                    publicId={image.cloudinary_public_id}
                    alt={image.alt_text || productName}
                    widths={image.widths}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    className="w-full h-full object-cover"
                    priority={images.indexOf(image) === 0}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        {selectedIndex > 0 && (
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        {selectedIndex < images.length - 1 && (
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Thumbnail navigation */}
      <div className="flex gap-2 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => {
              setSelectedIndex(index);
              emblaApi?.scrollTo(index);
            }}
            className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
              index === selectedIndex
                ? 'border-gray-900'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <CloudinaryImage
              publicId={image.cloudinary_public_id}
              alt={`${productName} thumbnail ${index + 1}`}
              widths={[160, 320]}
              sizes="80px"
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
