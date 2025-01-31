import React, { createContext, useState, useContext, ReactNode } from "react";
import { Photo } from "../api/pexels";

type ImageContextType = {
  selectedImage: Photo | null;
  setSelectedImage: (image: Photo | null) => void;
};

type ImageProviderProps = {
  children: ReactNode;
};

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const useImage = (): ImageContextType => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImage must be used within an ImageProvider");
  }
  return context;
};

export const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null);

  return (
    <ImageContext.Provider value={{ selectedImage, setSelectedImage }}>
      {children}
    </ImageContext.Provider>
  );
};
