import styled from "styled-components";

export const GalleryStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
  padding: 20px;

  .gallery-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex: 1;
    overflow: auto;
    height: 100%;
  }

  .info {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
