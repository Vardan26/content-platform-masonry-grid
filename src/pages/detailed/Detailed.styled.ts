import styled from "styled-components";

type Props = {
  src: string;
  imageBg: string;
};

export const DetailedStyled = styled.div<Props>`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  overflow: hidden;
  flex-grow: 1;

  .image {
    flex: 3;
    max-width: 75%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-bottom-right-radius: 8px;
    border-top-right-radius: 8px;
    background-image: url(${(props) => props.src});
    background-color: ${(props) => props.imageBg};
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;

    img {
      display: none;
    }
  }

  .sidebar {
    flex: 1;
    max-width: 25%;
    background-color: ${({ theme }) => theme.sidebarBd};
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border-bottom-left-radius: 8px;
    border-top-left-radius: 8px;
    display: flex;
    flex-direction: column;

    .title {
      font-size: 24px;
    }

    .name {
      font-size: 20px;
    }

    .description {
      margin-top: auto;
      font-size: 16px;
    }
  }
`;
