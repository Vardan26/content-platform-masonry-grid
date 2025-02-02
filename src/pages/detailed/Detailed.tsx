import React, { useCallback, useEffect, useState } from "react";
import { DetailedStyled } from "./Detailed.styled";
import { useImage } from "../../contexts/ImageContext";
import { fetchPhotoById } from "../../api/pexels";
import { useParams } from "react-router-dom";
import { Loader } from "../../components/loader";

export const Detailed = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedImage } = useImage();
  const [image, setImage] = useState(selectedImage);
  const [isOriginalImageLoaded, setIsOriginalImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(!selectedImage);

  useEffect(() => {
    const largeImage = new Image(); // Create an Image object
    largeImage.src = image?.src.original || ""; // Set the source of the large image

    // When the large image has loaded, update the state
    largeImage.onload = () => {
      setIsOriginalImageLoaded(true);
    };
  }, [image]);

  const fetchCurrentImage = useCallback(async () => {
    const imageData = await fetchPhotoById(id || "");
    setImage(imageData);
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    if (!selectedImage) {
      fetchCurrentImage();
    }
  }, [selectedImage, fetchCurrentImage]);

  if (isLoading || !image) {
    return <Loader />;
  }

  const currentImageSrc = isOriginalImageLoaded
    ? image?.src.original
    : image?.src.medium;

  return (
    <DetailedStyled src={currentImageSrc}>
      <div className="sidebar">
        <h3 className="name">Author</h3>
        <h2 className="title">{image.photographer}</h2>

        <p className="description">{image.alt}</p>
      </div>

      <div className="image" />
    </DetailedStyled>
  );
};
