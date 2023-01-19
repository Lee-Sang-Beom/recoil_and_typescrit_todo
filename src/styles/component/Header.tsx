import styled from "styled-components";

export const Header_Wrap = styled.header`
  display: flex;
  justify-content: center;
  height: 80px;
  background-color: #143352;
  color: white;
  transition: all 0.2s ease-out;

  .nav_bar {
    width: 95%;
    height: 100%;
  }

  .nav_bar ul {
    width: 90%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .nav_bar ul li {
    flex-basis: 15%;
    height: 100%;

    text-align: center;
    line-height: 80px;

    font-size: 1.4rem;
    font-weight: 600;

    transition: all 0.25s ease-in;
  }

  &:hover {
    background-color: white;
  }

  &:hover .nav_bar ul li {
    color: black;
  }
`;
