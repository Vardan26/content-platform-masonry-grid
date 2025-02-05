import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import { calculatePositions, getColumnCount } from "./utils";

import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import {
  ResultDataKeys,
  PhotoExtended,
  PhotoKeys,
  ImageDimensions,
} from "./types";

const buffer = 500;

// Handle infinite scrolling
const useInfiniteScroll = (
  wrapperElem: HTMLElement | null,
  hasNextPage: boolean,
  fetchNextPage: () => void,
  setShowScrollButton: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    if (!wrapperElem || !hasNextPage) return;

    const handleScroll = () => {
      const isNearBottom =
        wrapperElem.scrollHeight - wrapperElem.scrollTop <=
        wrapperElem.clientHeight + buffer;

      setShowScrollButton(wrapperElem.scrollTop > 300);

      if (isNearBottom) {
        fetchNextPage();
      }
    };

    const debouncedHandleScroll = debounce(handleScroll, 200);

    wrapperElem.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      wrapperElem.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [wrapperElem, hasNextPage, fetchNextPage, setShowScrollButton]);
};

// Process and position images

const getImageSizes = (columns: number, wrapperElemWidth: number) => {
  const containerWidth = wrapperElemWidth || 0;
  const columnWidth = containerWidth / columns || 0;
  const columnHeights = new Array(columns).fill(0) || 0;

  const imageDimensions: ImageDimensions = {
    small: { width: columnWidth, height: columnWidth },
    wide: {
      width: columns > 2 ? columnWidth * 2 : columnWidth,
      height: columnWidth,
    },
    tall: { width: columnWidth, height: columnWidth * 2 },
    big: {
      width: columns > 2 ? columnWidth * 2 : columnWidth,
      height: columnWidth * 2,
    },
  };

  return {
    columns,
    columnWidth,
    columnHeights,
    imageDimensions,
  };
};

const usePositionedImages = <ApiResult, Photo>(
  data: InfiniteData<ApiResult, unknown> | undefined,
  wrapperElem: HTMLElement | null,
  photoKeys: PhotoKeys<Photo>,
  resultDataKeys: ResultDataKeys<ApiResult>
) => {
  const { columns, isColumnsChanged } = useColumns(wrapperElem);

  const [positionedImages, setPositionedImages] = useState<
    PhotoExtended<Photo>[]
  >([]);

  const imageSizes = useMemo(
    () => getImageSizes(columns, wrapperElem?.clientWidth || 0),
    [columns, wrapperElem]
  );

  useEffect(() => {
    if (!data || !columns) return;

    const flattenedImages = data.pages.flatMap(
      (page) => resultDataKeys.photos && page[resultDataKeys.photos]
    ) as Photo[];

    const extendedImages = calculatePositions(
      flattenedImages,
      imageSizes,
      photoKeys,
      isColumnsChanged
    );

    setPositionedImages(extendedImages);
  }, [
    columns,
    data,
    imageSizes,
    photoKeys,
    resultDataKeys.photos,
    isColumnsChanged,
  ]);

  return positionedImages;
};

// Main hook that combines the logic
const useHandleScroll = <ApiResult, Photo>(
  wrapperElem: HTMLElement | null,
  data: InfiniteData<ApiResult, unknown> | undefined,
  hasNextPage: boolean,
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<ApiResult, unknown>, Error>
  >,
  photoKeys: PhotoKeys<Photo>,
  resultDataKeys: ResultDataKeys<ApiResult>,
  setShowScrollButton: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useInfiniteScroll(
    wrapperElem,
    hasNextPage,
    fetchNextPage,
    setShowScrollButton
  );

  const positionedImages = usePositionedImages(
    data,
    wrapperElem,
    photoKeys,
    resultDataKeys
  );

  return { positionedImages };
};

const useColumns = (wrapperElem: HTMLElement | null) => {
  const [columns, setColumns] = useState(0);
  const [prevColumns, setPrevColumns] = useState<number | undefined>(undefined);
  const [isColumnsChanged, setIsColumnsChanged] = useState(false);

  const throttledResize = throttle(() => {
    setColumns(getColumnCount(wrapperElem));
  }, 500);

  useEffect(() => {
    setIsColumnsChanged(!!prevColumns && columns !== prevColumns);

    setPrevColumns(columns);
  }, [columns, prevColumns]);

  useEffect(() => {
    if (!wrapperElem) return;
    throttledResize();

    window.addEventListener("resize", throttledResize);
    return () => window.removeEventListener("resize", throttledResize);
  }, [throttledResize, wrapperElem]);

  return { columns, isColumnsChanged };
};

const useVisiblePhotos = <Photo>(
  allPhotos: PhotoExtended<Photo>[],
  wrapperElem: HTMLElement | null,
  photoKeys: PhotoKeys<Photo>
) => {
  const [visiblePhotoIds, setVisiblePhotoIds] = useState<Set<string>>(
    new Set()
  );

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
          const checkId = photoKeys.id && (photo.data[photoKeys.id] as number);

          newVisiblePhotos.add(checkId?.toString() || "");
        }
      });
    }

    setVisiblePhotoIds(newVisiblePhotos);
  }, [allPhotos, wrapperElem, photoKeys]);

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

  return { visiblePhotoIds };
};

export const useVirtualized = <ApiResult, Photo>(
  // wrapperElem: HTMLElement | null,
  data: InfiniteData<ApiResult, unknown> | undefined,
  hasNextPage: boolean,
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<ApiResult, unknown>, Error>
  >,
  photoKeys: PhotoKeys<Photo>,
  resultDataKeys: ResultDataKeys<ApiResult>
) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_savedRef, setSavedRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (wrapperRef.current) {
      setSavedRef(wrapperRef.current);
    }
  }, []);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const { positionedImages } = useHandleScroll<ApiResult, Photo>(
    wrapperRef.current,
    data,
    hasNextPage,
    fetchNextPage,
    photoKeys,
    resultDataKeys,
    setShowScrollButton
  );

  const { visiblePhotoIds } = useVisiblePhotos(
    positionedImages,
    wrapperRef.current,
    photoKeys
  );

  const visiblePhotos = positionedImages.filter((photo) => {
    const checkId = photoKeys.id && (photo.data[photoKeys.id] as number);

    return visiblePhotoIds.has(checkId?.toString() || "");
  });

  return {
    visiblePhotos,
    showScrollButton: showScrollButton,
    wrapperRef,
  };
};
