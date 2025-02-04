import { ChevronUp } from "lucide-react";
import React from "react";
import { ScrollTopIconStyled } from "./ScrollTopIcon.styled";

interface Props {
  wrapperElem: HTMLElement | null;
  visible: boolean;
}

export const ScrollTopIcon = ({ wrapperElem, visible }: Props) => {
  const scrollToTop = () => {
    if (wrapperElem) {
      wrapperElem.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!visible) return null;

  return (
    <ScrollTopIconStyled onClick={scrollToTop}>
      <ChevronUp size={24} />
    </ScrollTopIconStyled>
  );
};
