import React from "react";
import { Photo, usePhotosQuery } from "../../api/pexels";
import { useVirtualized, PhotoExtended } from "../../libs/virtualized-gallery";
import { GalleryStyled } from "./Gallery.styled";
import { Image } from "./image";
import { useNavigate } from "react-router-dom";
import { useImage } from "../../contexts/ImageContext";
import { useSearch } from "../../contexts/SearchContext";
import { Loader } from "../../components/loader";
import { photoKeys, resultDataKeys } from "./Gallery.constants";
import { ScrollTopIcon } from "../../libs/virtualized-gallery/scroll-top-button";

const PHOTOS_PER_PAGE = 40;

export const Gallery = () => {
  const navigate = useNavigate();
  const { setSelectedImage } = useImage();
  const { searchQuery } = useSearch();

  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    usePhotosQuery(PHOTOS_PER_PAGE, searchQuery);

  const { visiblePhotos, showScrollButton, wrapperRef } = useVirtualized(
    data,
    hasNextPage,
    fetchNextPage,
    photoKeys,
    resultDataKeys
  ) as {
    visiblePhotos: PhotoExtended<Photo>[];
    showScrollButton: boolean;
    wrapperRef: React.RefObject<HTMLDivElement | null>;
  };

  const navigateToDetailView = (photo: Photo) => {
    return () => {
      setSelectedImage(photo);
      navigate(`/detailed/${photo.id}`);
    };
  };

  if (isError && !visiblePhotos.length) {
    return <div>Error loading photos.</div>;
  }

  return (
    <GalleryStyled>
      <div className="gallery-container" ref={wrapperRef}>
        {!isLoading &&
          visiblePhotos.map((photo: PhotoExtended<Photo>) => {
            const data = photo.data;
            return (
              <Image
                key={data.id}
                src={data.src.large}
                className={photo.type}
                navigateToDetailView={navigateToDetailView(data)}
                id={data.id.toString()}
                style={{ ...photo.position }}
              />
            );
          })}
        {isLoading && <Loader />}

        {!isLoading && !visiblePhotos.length && searchQuery.length ? (
          <div className="info">There are no matches for "{searchQuery}"</div>
        ) : null}
      </div>

      <ScrollTopIcon
        wrapperElem={wrapperRef.current}
        visible={showScrollButton}
      />
    </GalleryStyled>
  );
};
