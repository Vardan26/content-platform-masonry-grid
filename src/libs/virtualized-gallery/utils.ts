import {
  ImageDimensions,
  PHOTO_SIZE_TYPE,
  PhotoExtended,
  PhotoKeys,
} from "./types";

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

  let columns = Math.ceil(width / columnSize);

  if (width <= 768) {
    columns = 2;
  }

  if (width <= 480) {
    columns = 1;
  }

  return columns;
};

// Store already calculated and positioned images to prevent recalculation
const calculatedImages: Record<string, {}> = {};

export const calculatePositions = <Photo>(
  images: Photo[],
  imageSizes: {
    columns: number;
    columnWidth: number;
    columnHeights: any[];
    imageDimensions: ImageDimensions;
  },
  sizeKeys: PhotoKeys<Photo>,
  isColumnsChanged: boolean
): PhotoExtended<Photo>[] => {
  const { columns, columnWidth, columnHeights, imageDimensions } = imageSizes;

  images.forEach((image) => {
    const idKey = (sizeKeys.id && image[sizeKeys.id]) as number;
    const id = idKey.toString();

    if (!isColumnsChanged && calculatedImages[id]) return;
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

    // Update column heights in-place
    const newHeight = minTop + itemHeight;
    for (let i = bestColumn; i < bestColumn + slotsRequired; i++) {
      columnHeights[i] = newHeight;
    }

    calculatedImages[id] = {
      data: image,
      type,
      position: {
        top: `${minTop}px`,
        left: `${left}px`,
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
      },
    };
  });

  return Object.values(calculatedImages) as PhotoExtended<Photo>[];
};
