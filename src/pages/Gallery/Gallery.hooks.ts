import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
  InfiniteData,
} from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { ApiResult } from "../../api/pexels/types";
import { debounce } from "../../helpers";

const buffer = 1000;

export const useHandleScroll = (
  scrollable: HTMLElement | null,
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<ApiResult, unknown>, Error>
  >,
  hasNextPage: boolean
) => {
  useEffect(() => {
    if (!scrollable) return;

    const debouncedHandleScroll = debounce(() => {
      const isScrolledToTheEnd =
        scrollable.scrollHeight - scrollable.scrollTop <=
          scrollable.clientHeight + buffer && hasNextPage;

      if (isScrolledToTheEnd) {
        fetchNextPage();
      }
    }, 200);

    scrollable.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      scrollable.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [scrollable, fetchNextPage, hasNextPage]);
};

export const useAllImages = (pages?: ApiResult[]) => {
  const flattenedImages = useMemo(() => {
    const allPhotos = pages?.flatMap((page) => page.photos) || [];

    return allPhotos;
  }, [pages]);

  return flattenedImages;
};
