export enum PHOTO_SIZE_TYPE {
  WIDE = "wide",
  TALL = "tall",
  BIG = "big",
  SMALL = "small",
}

export const getPhotoSizeType = (
  width: number,
  height: number
): PHOTO_SIZE_TYPE => {
  const aspectRatio = width / height;

  if (aspectRatio > 1.5) {
    return PHOTO_SIZE_TYPE.WIDE;
  } else if (aspectRatio < 0.67) {
    return PHOTO_SIZE_TYPE.TALL;
  } else if (width > 3500 && height > 3500) {
    return PHOTO_SIZE_TYPE.BIG;
  }

  return PHOTO_SIZE_TYPE.SMALL;
};
