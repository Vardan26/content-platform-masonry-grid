import { PHOTO_SIZE_TYPE, PhotoExtended, PhotoKeys } from "./types";

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

export const getColumnCount = (
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

export const calculatePositions = <Photo>(
  images: Photo[],
  columns: number,
  wrapperElem: HTMLElement | null,
  sizeKeys: PhotoKeys<Photo>
): PhotoExtended<Photo>[] => {
  if (!wrapperElem) return [];

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

  const columnHeights = new Array(columns).fill(0);
  const positionedImages: PhotoExtended<Photo>[] = [];

  images.forEach((image) => {
    // Access width and height dynamically
    const width = (sizeKeys.width && Number(image[sizeKeys.width])) || 0;
    const height = (sizeKeys.height && Number(image[sizeKeys.height])) || 0;

    if (isNaN(width) || isNaN(height)) {
      console.warn("Invalid width or height value", image);
      return;
    }

    const type = getPhotoSizeType(width, height);

    const { width: itemWidth, height: itemHeight } = imageDimensions[type];
    const slotsRequired = Math.min(columns, Math.ceil(itemWidth / columnWidth));

    // Find the best starting column by checking the lowest max height
    let bestColumn = 0;
    let minTop = Infinity;

    for (let i = 0; i <= columns - slotsRequired; i++) {
      let maxHeightInRange = Math.max(
        ...columnHeights.slice(i, i + slotsRequired)
      );

      if (maxHeightInRange < minTop) {
        minTop = maxHeightInRange;
        bestColumn = i;
      }
    }

    const left = bestColumn * columnWidth;

    positionedImages.push({
      data: image,
      type,
      position: {
        top: `${minTop}px`,
        left: `${left}px`,
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
      },
    });

    // Update column heights in-place
    const newHeight = minTop + itemHeight;
    for (let i = bestColumn; i < bestColumn + slotsRequired; i++) {
      columnHeights[i] = newHeight;
    }
  });

  return positionedImages;
};
