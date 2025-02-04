import { ApiResult, Photo } from "../../api/pexels";

export const photoKeys: Partial<{
  [K in keyof Photo]: K;
}> = {
  width: "width",
  height: "height",
  id: "id",
};

export const resultDataKeys: Partial<{
  [K in keyof ApiResult]: K;
}> = {
  photos: "photos",
};
