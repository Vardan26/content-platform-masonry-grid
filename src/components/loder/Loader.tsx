import React from "react";
import { LoaderStyled } from "./Loader.styled";

export const Loader = () => {
  return (
    <LoaderStyled>
      <div className="spinner" />
    </LoaderStyled>
  );
};
