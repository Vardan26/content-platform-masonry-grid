import {
  useQuery,
  useInfiniteQuery,
  QueryFunctionContext,
  QueryKey,
  InfiniteData,
} from "@tanstack/react-query";
import { fetchPhotoById, fetchPhotos } from "./pexels";
import { Photo } from "./types";

export const usePhotosQuery = (perPage: number = 10, query: string = "") => {
  console.log("perPage", perPage);
  return useInfiniteQuery<
    Photo[],
    Error,
    InfiniteData<Photo[]>,
    QueryKey,
    number
  >({
    queryKey: ["photos", query],
    queryFn: (context: QueryFunctionContext<QueryKey, number>) => {
      const page = context.pageParam ?? 1;
      return fetchPhotos(page, perPage, query);
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
    staleTime: 5000,
    initialPageParam: 1,
  });
};

export const usePhotoQuery = (id: string) => {
  return useQuery({
    queryKey: ["photo", id],
    queryFn: () => fetchPhotoById(id),
    staleTime: 5000,
  });
};
