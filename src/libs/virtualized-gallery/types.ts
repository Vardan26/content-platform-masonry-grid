export enum PHOTO_SIZE_TYPE {
  WIDE = "wide",
  TALL = "tall",
  BIG = "big",
  SMALL = "small",
}

type ImagSizes = { width: number; height: number };

export type ImageDimensions = {
  small: ImagSizes;
  wide: ImagSizes;
  tall: ImagSizes;
  big: ImagSizes;
};

export type PhotoExtended<Photo> = {
  data: Photo;
  type: PHOTO_SIZE_TYPE;
  position: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
};

export type PhotoKeys<Photo> = Partial<{
  width: keyof Photo;
  height: keyof Photo;
  id: keyof Photo;
}>;

export type ResultDataKeys<ApiResult> = Partial<{
  photos: keyof ApiResult;
}>;
