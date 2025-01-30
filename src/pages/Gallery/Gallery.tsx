import React, { useState } from "react";
import { usePhotosQuery } from "../../api/pexels/hooks";
import { useHandleScroll } from "./Gallery.hooks";
import { GalleryStyled } from "./Gallery.styled";

const PHOTOS_PER_PAGE = 20;

export const Gallery = () => {
  const [query, setQuery] = useState("");

  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    usePhotosQuery(PHOTOS_PER_PAGE, query);

  useHandleScroll(fetchNextPage, hasNextPage);

  console.log("data", data);
  return <GalleryStyled>{isLoading ? "loading" : "Gallery"}</GalleryStyled>;
};
