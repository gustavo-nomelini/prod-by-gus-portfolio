'use client';

import Image from 'next/image';
import { useState } from 'react';
import ImageModal from './ImageModal';

interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  className = '',
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});

  // Garantir que as imagens existam e tenham valores válidos
  const validImages = images?.filter((img) => img && img.src) || [];

  // Lidar com a abertura do modal
  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  // Lidar com o fechamento do modal
  const closeModal = () => {
    setIsModalOpen(false);
    // Não resetamos o índice imediatamente para permitir a animação
  };

  // Navegação
  const handleNext = () => {
    if (
      selectedImageIndex !== null &&
      selectedImageIndex < validImages.length - 1
    ) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  if (validImages.length === 0) {
    return <div className="text-center p-4">Nenhuma imagem disponível</div>;
  }

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {validImages.map((image, index) => (
          <div
            key={index}
            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:shadow-xl hover:scale-[1.02]"
            onClick={() => openModal(index)}
          >
            <div className="relative h-48 sm:h-56 w-full">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
                  imageLoaded[index] ? 'opacity-100' : 'opacity-0'
                }`}
                quality={60}
                onLoadingComplete={() => {
                  setImageLoaded((prev) => ({ ...prev, [index]: true }));
                }}
              />
              {!imageLoaded[index] && (
                <div className="absolute inset-0 bg-[var(--color4)] animate-pulse"></div>
              )}
              <div className="absolute inset-0 bg-[var(--background)]/0 group-hover:bg-[var(--background)]/30 transition-colors duration-300">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-[var(--color1)]/80 text-[var(--background)] px-4 py-2 rounded-lg font-medium backdrop-blur-sm">
                    Ampliar
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImageIndex !== null && (
        <ImageModal
          isOpen={isModalOpen}
          imageUrl={validImages[selectedImageIndex]?.src || ''}
          alt={validImages[selectedImageIndex]?.alt || 'Imagem do projeto'}
          onClose={closeModal}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={selectedImageIndex < validImages.length - 1}
          hasPrev={selectedImageIndex > 0}
        />
      )}
    </div>
  );
};

export default ImageGallery;
