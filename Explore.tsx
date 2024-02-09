import React, { useState } from "react";
import {
  StyledPressable,
  StyledSafeAreaView,
  StyledText,
  StyledView,
} from "./utils/nw";
import ExploreMap from "./ExploreMap";
import { exploreTutorialSteps } from "./utils/tutorials";

const Explore = ({ handleBackPress }: { handleBackPress: () => void }) => {
  const [currentExploreTutStep, setCurrentExploreTutStep] = useState(0);
  const handleExploreTutNext = () => {
    setCurrentExploreTutStep(currentExploreTutStep + 1);
  };

  return (
    <StyledView className="bg-transparent flex w-full h-full items-center relative">
      <ExploreMap />

      <StyledSafeAreaView
        style={{
          position: "absolute",
          top: 44,
          left: 0,
          right: 0,
          paddingHorizontal: 16,
          paddingBottom: 16,
          zIndex: 1,
        }}
      >
        <StyledView
          id="explore-back-button"
          className="flex items-start w-full justify-center px-4"
        >
          <StyledPressable
            className="bg-neutral-500/90 px-3 py-1 rounded-lg border-neutral-900/90 border-2 shadow-2xl flex items-center justify-center"
            onPress={handleBackPress}
          >
            <StyledText className="text-stone-50 font-semibold text-lg">
              Back
            </StyledText>
          </StyledPressable>
        </StyledView>
      </StyledSafeAreaView>

      {/*  --- TUTORIAL --------------------- */}
      {currentExploreTutStep <= exploreTutorialSteps.length - 1 ? (
        <StyledView
          className="bg-stone-900/90 p-4 pb-16"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
          }}
        >
          <StyledView id="tutorial-hud">
            <StyledText className="text-white">
              {exploreTutorialSteps[currentExploreTutStep].text}
            </StyledText>
            <StyledPressable
              onPress={handleExploreTutNext}
              className="bg-lime-500 px-6 py-2 rounded-lg flex justify-center relative items-center mt-4"
            >
              <StyledText className="font-medium text-2xl tracking-wide uppercase">
                {exploreTutorialSteps[currentExploreTutStep].buttonText}
              </StyledText>
            </StyledPressable>
          </StyledView>
        </StyledView>
      ) : (
        <></>
      )}
    </StyledView>
  );
};

export default Explore;
