import styled from "styled-components";

export const DetailedStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  overflow: hidden;
  flex-grow: 1;

  .image-container {
    flex: 3;
    max-width: 75%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-bottom-right-radius: 8px;
    border-top-right-radius: 8px;
  }

  .main-image {
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  .sidebar {
    flex: 1;
    max-width: 25%;
    background-color: ${({ theme }) => theme.sidebarBd};
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border-bottom-left-radius: 8px;
    border-top-left-radius: 8px;

    .title {
      font-size: 24px;
      margin-bottom: 10px;
    }

    .name {
      font-size: 20px;
    }

    .description {
      font-size: 16px;
      margin-bottom: 15px;
    }

    .author-info {
      margin-bottom: 20px;
    }
  }
`;
