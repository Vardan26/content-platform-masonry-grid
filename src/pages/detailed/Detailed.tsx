import React, { useCallback, useEffect, useState } from "react";
import { DetailedStyled } from "./Detailed.styled";
import { useImage } from "../../contexts/ImageContext";
import { fetchPhotoById } from "../../api/pexels";
import { useParams } from "react-router-dom";

export const Detailed = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedImage } = useImage();
  const [image, setImage] = useState(selectedImage);

  const fetchCurrentImage = useCallback(async () => {
    const imageData = await fetchPhotoById(id || "");
    setImage(imageData);
  }, [id]);

  useEffect(() => {
    if (!selectedImage) {
      fetchCurrentImage();
    }
  }, [selectedImage, fetchCurrentImage]);

  if (!image) {
    return <div>Image is Missing</div>;
  }

  return (
    <DetailedStyled>
      <div className="sidebar">
        <h2 className="title">{image.alt}</h2>

        <div className="author-info">
          <h3 className="author-name">Author Name</h3>
          <p className="author-bio">{image.photographer}</p>
        </div>
      </div>

      <div className="image-container">
        <img src={image.src.original} alt={image.alt} className="main-image" />
      </div>
    </DetailedStyled>
  );
};
