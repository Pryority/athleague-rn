import React from "react";
import { StyledView, StyledPressable, StyledText } from "./utils/nw";

const MainMenu = ({
  handleCreatePress,
  handleExplorePress,
}: {
  handleCreatePress: () => void;
  handleExplorePress: () => void;
}) => (
  <StyledView className="flex relative w-full justify-center items-center h-full">
    <StyledView className="flex flex-col bg-white/80 w-full justify-center items-center h-full space-y-4 p-4">
      <StyledText className="text-6xl text-center tracking-tighter">
        Welcome to{" "}
        <StyledText className="font-bold uppercase tracking-[-4px]">
          Athleague
        </StyledText>
      </StyledText>
      <StyledView className="flex flex-col items-center w-1/2 space-y-3">
        <StyledPressable
          onPress={handleCreatePress}
          className="bg-lime-400 px-6 py-2 rounded-lg flex justify-center relative items-center w-full"
        >
          <StyledText className="font-medium text-2xl tracking-wide uppercase">
            Create
          </StyledText>
        </StyledPressable>
        <StyledPressable
          onPress={handleExplorePress}
          className="bg-sky-300 w-full px-6 py-2 rounded-lg flex justify-center relative items-center"
        >
          <StyledText className="font-medium text-2xl tracking-wide uppercase">
            Explore
          </StyledText>
        </StyledPressable>
      </StyledView>
    </StyledView>
  </StyledView>
);

export default MainMenu;
