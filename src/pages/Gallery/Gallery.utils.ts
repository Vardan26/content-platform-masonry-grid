import { Photo } from "../../api/pexels";

export enum PHOTO_SIZE_TYPE {
  WIDE = "wide",
  TALL = "tall",
  BIG = "big",
  SMALL = "small",
}

export type PhotoExtended = {
  data: Photo;
  type: PHOTO_SIZE_TYPE;
  position: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
};

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

export const calculatePositions = (
  images: Photo[],
  columns: number,
  wrapperElem: HTMLElement | null,
  prevPhotos: PhotoExtended[]
): PhotoExtended[] => {
  if (!wrapperElem || columns === 0) return [];

  const containerWidth = wrapperElem.clientWidth;
  const columnWidth = containerWidth / columns;

  const imageDimensions = {
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

  // Create a Set for quick image existence check
  const positionedPhotoIds = new Set(prevPhotos.map((photo) => photo.data.id));

  // Preserve column heights from previous photos
  const columnHeights = new Array(columns).fill(0);
  prevPhotos.forEach((photo) => {
    const leftIndex = Math.floor(parseFloat(photo.position.left) / columnWidth);
    const widthSlots = Math.ceil(
      parseFloat(photo.position.width) / columnWidth
    );
    const bottom =
      parseFloat(photo.position.top) + parseFloat(photo.position.height);

    for (let i = leftIndex; i < leftIndex + widthSlots; i++) {
      columnHeights[i] = Math.max(columnHeights[i], bottom);
    }
  });

  const newPositionedImages: PhotoExtended[] = [];

  images.forEach((image) => {
    // Skip already positioned images
    if (positionedPhotoIds.has(image.id)) return;

    const type = getPhotoSizeType(image.width, image.height);
    const { width, height } = imageDimensions[type];
    const slotsRequired = Math.min(columns, Math.ceil(width / columnWidth));

    let bestColumn = 0;
    let minTop = Infinity;

    for (let i = 0; i <= columns - slotsRequired; i++) {
      let maxHeightInRange = 0;

      for (let j = i; j < i + slotsRequired; j++) {
        if (columnHeights[j] > maxHeightInRange) {
          maxHeightInRange = columnHeights[j];
        }
      }

      if (maxHeightInRange < minTop) {
        minTop = maxHeightInRange;
        bestColumn = i;
      }
    }

    const left = bestColumn * columnWidth;

    newPositionedImages.push({
      data: image,
      type,
      position: {
        top: `${minTop}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
      },
    });

    // Update column heights
    const newHeight = minTop + height;
    for (let i = bestColumn; i < bestColumn + slotsRequired; i++) {
      columnHeights[i] = newHeight;
    }
  });

  return [...prevPhotos, ...newPositionedImages];
};
