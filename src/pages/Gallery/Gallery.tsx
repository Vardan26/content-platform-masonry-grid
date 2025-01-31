import React, { useRef } from "react";
import { usePhotosQuery } from "../../api/pexels/hooks";
import { useAllImages, useHandleScroll } from "./Gallery.hooks";
import { GalleryStyled } from "./Gallery.styled";
import { Image } from "./image";
import { ExtendedPhoto } from "./Gallery.utils";
import { useNavigate } from "react-router-dom";
import { useImage } from "../../contexts/ImageContext";
import { useSearch } from "../../contexts/SearchContext";

const PHOTOS_PER_PAGE = 20;

export const Gallery = () => {
  const navigate = useNavigate();
  const { setSelectedImage } = useImage();

  const { searchQuery } = useSearch();

  const galleryRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    usePhotosQuery(PHOTOS_PER_PAGE, searchQuery);

  useHandleScroll(galleryRef.current, fetchNextPage, hasNextPage);

  const allImages = useAllImages(data?.pages);

  const navigateToDetailView = (photo: ExtendedPhoto) => {
    return () => {
      setSelectedImage(photo);
      navigate(`/detailed/${photo.id}`);
    };
  };

  if (isError && !allImages.length) {
    return <div>Error loading photos.</div>;
  }

  return (
    <GalleryStyled ref={galleryRef}>
      <div className="gallery-container">
        {allImages.map((photo: ExtendedPhoto, index: number) => (
          <Image
            key={`${photo.id}-${index}`}
            src={photo.src.medium}
            className={photo.type}
            id={photo.id.toString()}
            navigateToDetailView={navigateToDetailView(photo)}
          />
        ))}

        {isLoading && <div className="info">Loading...</div>}
        {!isLoading && !allImages.length && searchQuery.length && (
          <div className="info">There are no matches for "{searchQuery}"</div>
        )}
      </div>
    </GalleryStyled>
  );
};
