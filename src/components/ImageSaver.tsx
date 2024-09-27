import React from 'react';
import { saveAs } from 'file-saver';

interface ImageSaverProps {
  image: File;
}

const ImageSaver: React.FC<ImageSaverProps> = ({ image }) => {
  const handleSave = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    if (canvas) {
      const ctx = canvas.getContext('2d');
      
      // Dibujar la imagen en el canvas antes de guardar
      const img = new Image();
      const reader = new FileReader();
      reader.onload = () => {
        img.src = reader.result as string;
        img.onload = () => {
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const dataURL = canvas.toDataURL();
            saveAs(dataURL, 'imagen-filtrada.png');
          }
        };
      };
      reader.readAsDataURL(image);
    }
  };

  return (
    <div>
      <button onClick={handleSave}>Guardar imagen</button>
    </div>
  );
};

export default ImageSaver;
