import React, { useState, useEffect, useRef } from 'react';

interface FilterApplierProps {
  image: File;
  overlayImage: File | null;
}

const FilterApplier: React.FC<FilterApplierProps> = ({ image, overlayImage }) => {
  const [filter, setFilter] = useState<string>('none');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const applyFilterAndOverlay = async () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          console.error('No se pudo obtener el contexto del canvas');
          return;
        }

        const img = new Image();
        const reader = new FileReader();

        reader.onload = function (e) {
          img.src = e.target?.result as string;
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            
            ctx.filter = filter;
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
            ctx.drawImage(img, 0, 0); // Dibujar la imagen principal

            // Si hay una imagen superpuesta, dibujarla encima
            if (overlayImage) {
              const overlayImg = new Image();
              const overlayReader = new FileReader();

              overlayReader.onload = function (e) {
                overlayImg.src = e.target?.result as string;
                overlayImg.onload = () => {
                  // Ajustar la posición y el tamaño como desees
                  ctx.drawImage(overlayImg, 50, 50, overlayImg.width / 2, overlayImg.height / 2);
                };
              };
              
              overlayReader.readAsDataURL(overlayImage);
            }
          };
        };

        reader.readAsDataURL(image);
      }
    };

    applyFilterAndOverlay();
  }, [image, filter, overlayImage]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <select value={filter} onChange={handleFilterChange}>
        <option value="none">Normal</option>
        <option value="grayscale(100%)">Escala de grises</option>
        <option value="sepia(100%)">Sépia</option>
        <option value="invert(100%)">Invertir</option>
      </select>
      <canvas ref={canvasRef} style={{backgroundColor: 'red'}}/>
    </div>
  );
};

export default FilterApplier;
