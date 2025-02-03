import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
  InfiniteData,
} from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiResult } from "../../api/pexels/types";
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import { calculatePositions, PhotoExtended } from "./Gallery.utils";

const buffer = 1000;

export const useHandleScroll = (
  wrapperElem: HTMLElement | null,
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<ApiResult, unknown>, Error>
  >,
  hasNextPage: boolean
) => {
  useEffect(() => {
    if (!wrapperElem) return;

    const debouncedHandleScroll = debounce(() => {
      const isScrolledToTheEnd =
        wrapperElem.scrollHeight - wrapperElem.scrollTop <=
          wrapperElem.clientHeight + buffer && hasNextPage;

      if (isScrolledToTheEnd) {
        fetchNextPage();
      }
    }, 200);

    wrapperElem.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      wrapperElem.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [wrapperElem, fetchNextPage, hasNextPage]);
};

const getColumnCount = (
  wrapperElem: HTMLElement | null,
  columnSize = 250
): number => {
  const width = wrapperElem?.clientWidth || 0;

  let columns = Math.floor(width / columnSize);

  if (width <= 768) {
    columns = 2;
  }

  if (width <= 480) {
    columns = 1;
  }

  return columns;
};

export const useExtendedPhotos = (
  wrapperElem: HTMLElement | null,
  pages?: ApiResult[]
) => {
  const [columns, setColumns] = useState(0);
  const [positionedPhotos, setPositionedPhotos] = useState<PhotoExtended[]>([]);

  // Throttle resize calculations to avoid excessive renders
  const throttledResize = useMemo(
    () =>
      throttle(() => {
        setColumns(getColumnCount(wrapperElem));
      }, 500),
    [wrapperElem]
  );

  // Handle resizing
  useEffect(() => {
    if (!wrapperElem) return;
    throttledResize();

    window.addEventListener("resize", throttledResize);
    return () => window.removeEventListener("resize", throttledResize);
  }, [throttledResize, wrapperElem]);

  useEffect(() => {
    if (!pages || pages.length === 0 || columns === 0) return;

    const lastPage = pages[pages.length - 1];
    const lastPageImages = lastPage.photos;

    if (lastPageImages.length === 0) return;

    setPositionedPhotos((prevPhotos) => {
      // Calculate positions only for new images
      const newlyPositionedImages = calculatePositions(
        lastPageImages,
        columns,
        wrapperElem,
        prevPhotos // Pass existing positioned photos for reference
      );

      return [...prevPhotos, ...newlyPositionedImages];
    });
  }, [pages, columns, wrapperElem]);

  return positionedPhotos;
};

export const useVisiblePhotos = (
  allPhotos: PhotoExtended[],
  wrapperElem: HTMLElement | null
) => {
  const [visiblePhotos, setVisiblePhotos] = useState<Set<string>>(new Set());

  const updateVisibility = useCallback(() => {
    const newVisiblePhotos = new Set<string>();

    if (wrapperElem) {
      const wrapperTop = wrapperElem.scrollTop;
      const wrapperBottom = wrapperTop + wrapperElem.clientHeight;

      allPhotos.forEach((photo) => {
        const photoTop = parseFloat(photo.position.top);
        const photoHeight = parseFloat(photo.position.height);
        const photoBottom = photoTop + photoHeight;

        // Check if the photo is within the visible area of the wrapper, considering the buffer
        const isVisible =
          photoBottom > wrapperTop - buffer &&
          photoTop < wrapperBottom + buffer;

        if (isVisible) {
          newVisiblePhotos.add(photo.data.id.toString());
        }
      });
    }

    setVisiblePhotos(newVisiblePhotos);
  }, [allPhotos, wrapperElem]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttleUpdateVisibility = useCallback(
    throttle(updateVisibility, 100, { leading: true, trailing: true }),
    [updateVisibility]
  );

  useEffect(() => {
    if (wrapperElem) {
      throttleUpdateVisibility();
      wrapperElem.addEventListener("scroll", throttleUpdateVisibility, {
        passive: true,
      });

      return () => {
        if (wrapperElem) {
          wrapperElem.removeEventListener("scroll", throttleUpdateVisibility);
        }
      };
    }
  }, [throttleUpdateVisibility, wrapperElem]);

  return { visiblePhotos };
};
