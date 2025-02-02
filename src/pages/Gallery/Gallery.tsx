import React, { useEffect, useRef, useState } from "react";
import { usePhotosQuery, Photo } from "../../api/pexels";
import { useAllImages, useHandleScroll } from "./Gallery.hooks";
import { GalleryStyled } from "./Gallery.styled";
import { Image } from "./image";
import { useNavigate } from "react-router-dom";
import { useImage } from "../../contexts/ImageContext";
import { useSearch } from "../../contexts/SearchContext";
import { Loader } from "../../components/loader";
import { getPhotoSizeType } from "./Gallery.utils";

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

  const navigateToDetailView = (photo: Photo) => {
    return () => {
      setSelectedImage(photo);
      navigate(`/detailed/${photo.id}`);
    };
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  if (isError && !allImages.length) {
    return <div>Error loading photos.</div>;
  }

  return (
    <GalleryStyled ref={galleryRef}>
      <div className="gallery-container">
        {allImages.map((photo: Photo, index: number) => (
          <Image
            key={`${photo.id}-${index}`}
            src={photo.src.medium}
            className={getPhotoSizeType(photo.width, photo.height)}
            navigateToDetailView={navigateToDetailView(photo)}
          />
        ))}

        {(isLoading || !isMounted) && <Loader />}
        {!isLoading && !allImages.length && searchQuery.length && (
          <div className="info">There are no matches for "{searchQuery}"</div>
        )}
      </div>
    </GalleryStyled>
  );
};
