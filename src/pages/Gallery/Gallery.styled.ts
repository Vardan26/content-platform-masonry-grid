import styled from "styled-components";

export const GalleryStyled = styled.div<{
  ref: React.RefObject<HTMLElement | null>;
}>`
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
  overflow: auto;

  .gallery-container {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-auto-rows: 200px;
    grid-auto-flow: dense;
    width: 100%;
  }
`;
