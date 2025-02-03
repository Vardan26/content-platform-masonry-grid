import React, { useEffect, useRef, useState } from "react";
import { usePhotosQuery, Photo } from "../../api/pexels";
import {
  useVisiblePhotos,
  useExtendedPhotos,
  useHandleScroll,
} from "./Gallery.hooks";
import { GalleryStyled } from "./Gallery.styled";
import { Image } from "./image";
import { useNavigate } from "react-router-dom";
import { useImage } from "../../contexts/ImageContext";
import { useSearch } from "../../contexts/SearchContext";
import { Loader } from "../../components/loader";
import { PhotoExtended } from "./Gallery.utils";

const PHOTOS_PER_PAGE = 20;

export const Gallery = () => {
  const navigate = useNavigate();
  const { setSelectedImage } = useImage();
  const { searchQuery } = useSearch();

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    usePhotosQuery(PHOTOS_PER_PAGE, searchQuery);

  const extendedPhotos = useExtendedPhotos(wrapperRef.current, data?.pages);

  const { visiblePhotos } = useVisiblePhotos(
    extendedPhotos,
    wrapperRef.current
  );

  useHandleScroll(wrapperRef.current, fetchNextPage, hasNextPage);

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

  if (isError && !extendedPhotos.length) {
    return <div>Error loading photos.</div>;
  }

  return (
    <GalleryStyled>
      <div className="gallery-container" ref={wrapperRef}>
        {extendedPhotos.map((photo: PhotoExtended, index: number) => {
          const data = photo.data;
          return (
            visiblePhotos.has(data.id.toString()) && (
              <Image
                key={`${data.id}-${index}`}
                src={data.src.medium}
                className={photo.type}
                navigateToDetailView={navigateToDetailView(data)}
                id={data.id.toString()}
                style={{ ...photo.position }}
              />
            )
          );
        })}

        {(isLoading || !isMounted) && <Loader />}
        {!isLoading && !extendedPhotos.length && searchQuery.length && (
          <div className="info">There are no matches for "{searchQuery}"</div>
        )}
      </div>
    </GalleryStyled>
  );
};
