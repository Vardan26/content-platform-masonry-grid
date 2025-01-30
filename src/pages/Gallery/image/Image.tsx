import React from "react";
import { ImageStyled } from "./Image.styled";

type Props = {
  src: string;
  className: string;
};
export const Image = ({ src, className }: Props) => {
  return <ImageStyled className={className} src={src} />;
};
