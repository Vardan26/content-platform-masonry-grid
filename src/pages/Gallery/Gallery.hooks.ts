import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
  InfiniteData,
} from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { ApiResult, Photo } from "../../api/pexels/types";
import { getPhotoSizeType } from "./Gallery.utils";

const buffer = 1000;

export const useHandleScroll = (
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<ApiResult, unknown>, Error>
  >,
  hasNextPage: boolean,
  debounceDelay: number = 300
) => {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      const scrolledToTheEnd =
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - buffer && hasNextPage;

      if (scrolledToTheEnd) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
          fetchNextPage();
        }, debounceDelay);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, hasNextPage, debounceDelay]);
};

export const useAllImages = (pages?: ApiResult[]) => {
  const flattenedImages = useMemo(() => {
    const allPhotos = pages?.flatMap((page) => page.photos) || [];

    return allPhotos;
  }, [pages]);

  const extendedPhotos = flattenedImages.map((image: Photo) => {
    return {
      ...image,
      type: getPhotoSizeType(image.width, image.height),
    };
  });

  return extendedPhotos;
};
