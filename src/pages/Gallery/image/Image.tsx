import React, { MouseEventHandler, Ref } from "react";
import { ImageStyled } from "./Image.styled";

type Props = {
  src: string;
  className: string;
  navigateToDetailView: MouseEventHandler<HTMLDivElement>;
  style: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
  ref?: Ref<HTMLDivElement> | undefined;
  id?: string;
};
export const Image = ({
  src,
  className,
  id,
  ref,
  navigateToDetailView,
  style,
}: Props) => {
  return (
    <ImageStyled
      className={className}
      src={src}
      id={id}
      ref={ref}
      onClick={navigateToDetailView}
      style={style}
    />
  );
};
