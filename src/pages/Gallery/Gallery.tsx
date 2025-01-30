import React, { useState } from "react";
import { usePhotosQuery } from "../../api/pexels/hooks";
import { useAllImages, useHandleScroll } from "./Gallery.hooks";
import { GalleryStyled } from "./Gallery.styled";
import { Image } from "./image";
import { ExtendedPhoto } from "./Gallery.utils";

const PHOTOS_PER_PAGE = 20;

export const Gallery = () => {
  const [query, setQuery] = useState("");

  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    usePhotosQuery(PHOTOS_PER_PAGE, query);

  useHandleScroll(fetchNextPage, hasNextPage);

  const allImages = useAllImages(data?.pages);

  if (isError && !allImages.length) {
    return <div>Error loading photos.</div>;
  }

  return (
    <GalleryStyled className="gallery">
      {allImages.map((photo: ExtendedPhoto, index: number) => (
        <Image
          key={`${photo.id}-${index}`}
          src={photo.src.medium}
          className={photo.type}
        />
      ))}

      {isLoading && <div className="info">Loading...</div>}
      {!isLoading && !allImages.length && query.length && (
        <div className="info">There are no matches for "{query}"</div>
      )}
    </GalleryStyled>
  );
};
