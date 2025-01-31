import {
  useQuery,
  useInfiniteQuery,
  QueryFunctionContext,
  QueryKey,
  InfiniteData,
} from "@tanstack/react-query";
import { fetchPhotos } from "./pexels";
import { ApiResult } from "./types";

export const usePhotosQuery = (perPage: number = 10, query: string = "") => {
  return useInfiniteQuery<
    ApiResult,
    Error,
    InfiniteData<ApiResult>,
    QueryKey,
    number
  >({
    queryKey: ["photos", query],
    queryFn: (context: QueryFunctionContext<QueryKey, number>) => {
      const page = context.pageParam ?? 1;
      return fetchPhotos(page, perPage, query);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.next_page ? lastPage.page + 1 : undefined;
    },
    staleTime: 5000,
    initialPageParam: 1,
  });
};
