import React, { useState } from 'react';

interface ImageUploaderProps {
  setImage: (image: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ setImage }) => {
  const [image, setImageState] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
  
    // Verificamos que files no sea null y que contenga al menos un archivo
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setImageState(selectedFile);
      setImage(selectedFile);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {image && <img src={URL.createObjectURL(image)} alt="Imagen" />}
    </div>
  );
};

export default ImageUploader;