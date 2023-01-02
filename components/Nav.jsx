import React from "react";
import styled from "@emotion/native";

const Nav = ({ category, saveCategoryFirestore }) => {
  return (
    <StNav className="Nav">
      <StNavButton
        onPress={() => saveCategoryFirestore("js")}
        style={{
          backgroundColor: category === "js" ? "#ffdb4d" : "#96e4eb",
        }}
      >
        <StNavText>JavaScript</StNavText>
      </StNavButton>
      <StNavButton
        onPress={() => saveCategoryFirestore("react")}
        style={{
          backgroundColor: category === "react" ? "#ffdb4d" : "#96e4eb",
        }}
      >
        <StNavText>React</StNavText>
      </StNavButton>
      <StNavButton
        onPress={() => saveCategoryFirestore("react-native")}
        style={{
          backgroundColor: category === "react-native" ? "#ffdb4d" : "#96e4eb",
        }}
      >
        <StNavText>ReactNative</StNavText>
      </StNavButton>
    </StNav>
  );
};

export default Nav;

const StNav = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 10px;
  margin-bottom: 20px;
  border-bottom-width: 1px;
  border-bottom-color: black;
`;

const StNavButton = styled.TouchableOpacity`
  flex-basis: 30%;
  height: 50px;
  border: 1px solid black;
  justify-content: center;
`;

const StNavText = styled.Text`
  text-align: center;
  font-weight: bold;
`;
