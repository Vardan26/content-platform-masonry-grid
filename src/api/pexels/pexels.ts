import axios from "axios";
import { Photo } from "./types";

const ACCESS_KEY = process.env.REACT_APP_PEXELS_ACCESS_KEY;

const api = axios.create({
  baseURL: "https://api.pexels.com/v1/",
  headers: {
    Authorization: ACCESS_KEY,
  },
});

export const fetchPhotos = async (
  page: number = 1,
  perPage: number = 10,
  query?: string
): Promise<Photo[]> => {
  const params: Record<string, any> = {
    page,
    per_page: perPage,
  };

  if (query) {
    params.query = query;
    const response = await api.get<{ results: Photo[] }>("/search", { params });
    return response.data.results;
  } else {
    const response = await api.get<Photo[]>("/curated", {
      params,
    });
    return response.data;
  }
};

export const fetchPhotoById = async (id: string): Promise<Photo> => {
  const response = await api.get<Photo>(`/photos/${id}`);
  return response.data;
};
