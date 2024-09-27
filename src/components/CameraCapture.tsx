import React, { useRef, useState } from 'react';

interface CameraCaptureProps {
  setImage: (image: File) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ setImage }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCaptured, setIsCaptured] = useState<boolean>(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setStream(stream); // Guardamos el stream para detenerlo más adelante
    } catch (err) {
      console.error('Error al iniciar la cámara', err);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'captura.png', { type: 'image/png' });
            setImage(file);
            setIsCaptured(true);
            stopCamera(); // Detenemos la cámara después de la captura
          }
        }, 'image/png');
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop()); // Detener todos los tracks del stream
    }
  };

  return (
    <div>
      {!isCaptured ? (
        <>
          <video ref={videoRef} width="640" height="480"></video>
          <button onClick={startCamera}>Iniciar cámara</button>
          <button onClick={captureImage}>Capturar imagen</button>
        </>
      ) : (
        <p>Imagen capturada.</p>
      )}
    </div>
  );
};

export default CameraCapture;
