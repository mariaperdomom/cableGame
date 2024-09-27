import React, { useEffect, useState } from 'react';
import CameraCapture from './components/CameraCapture';
import FilterApplier from './components/FilterApplier';
import ImageSaver from './components/ImageSaver';
import { Stack } from '@mantine/core';

const App: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [overlayImage, setOverlayImage] = useState<File | null>(null);
  const [savedImage, setSavedImage] = useState<string | null>(null);

  useEffect(() => {
    const savedImage = localStorage.getItem('imagen-filtrada');
    if (savedImage) {
      setSavedImage(savedImage);
    }
  }, []);

  const handleOverlayImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOverlayImage(file);
    }
  };

  return (
    <Stack justify='center' align='center'>
      <CameraCapture setImage={setImage} />
      {image && (
        <Stack>
          <FilterApplier image={image} overlayImage={overlayImage} />
          <input type="file" accept="image/*" onChange={handleOverlayImageChange} />
        </Stack>
      )}
      {image && <ImageSaver image={image} />}
      {savedImage && <img src={savedImage} alt="Imagen filtrada" />}
    </Stack>
  );
};

export default App;
