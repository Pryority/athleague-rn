import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import MapView, { LatLng, Marker, Overlay } from "react-native-maps";
import CourseCreationMap from "./CourseCreationMap";
import { withExpoSnack } from "nativewind";
import { Text, Button, SafeAreaView } from "react-native";
import {
  StyledView,
  StyledText,
  StyledPressable,
  StyledOverlay,
  StyledButton,
  StyledSafeAreaView,
} from "./utils/nw";
import { MapMarker } from "./types";
import ExploreMap from "./ExploreMap";

function App() {
  const [markers, setMarkers] = useState<MapMarker[]>([]); // Specify the type
  const [showIntro, setShowIntro] = useState(true); // Set to true initially
  const [showTutorial, setShowTutorial] = useState(false); // Set to true initially
  const [currentStep, setCurrentStep] = useState(1);
  const [currentExploreTutStep, setCurrentExploreTutStep] = useState(0);
  const [canAddMarkers, setCanAddMarkers] = useState(true);
  const [showCourseCreation, setShowCourseCreation] = useState(false);
  const [showExplore, setShowExplore] = useState(false);

  const ccTutorialSteps = [
    {
      text: "Welcome to Athleague. Tap the 'Start' button to begin.",
      buttonText: "Start",
    },
    {
      text: "Tap the map to place a checkpoint.",
      buttonText: "Next",
    },
  ];

  const exploreTutorialSteps = [
    {
      text: "Welcome to Course Exploration!",
      buttonText: "Start",
    },
    {
      text: "Search the map for courses near you.",
      buttonText: "Next",
    },
  ];

  const handleCreatePress = () => {
    setShowIntro(false);
    setShowCourseCreation(true);
  };

  const handleExplorePress = () => {
    setShowIntro(false);
    setShowExplore(true);
  };

  const handleUndoPress = () => {
    setCanAddMarkers(false);

    if (markers.length === 0) return;
    const newMarkers = markers.slice(0, -1).map((marker, index) => ({
      ...marker,
      id: index + 1,
    }));
    setMarkers(newMarkers);
    console.log("UNDO");
    const timer = setTimeout(() => {
      setCanAddMarkers(true);
      console.log("ADD MARKER TIMER DONE");
    }, 500);
    return () => clearTimeout(timer);
  };

  const handleSavePress = () => {
    if (markers.length < 2) {
      console.log("Must add at least two checkpoints to create a course.");
    } else if (markers.length >= 2) {
      console.log("Saving course...");
    }
    console.log("Save pressed");
  };

  const handleBackPress = () => {
    setShowCourseCreation(false);
    setShowExplore(false);
    console.log("Going back to main menu...");
  };

  const handleExploreTutNext = () => {
    setCurrentExploreTutStep(currentExploreTutStep + 1);
  };

  return (
    <>
      {showExplore ? (
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
            <StyledView className="flex flex-row items-center w-full justify-start px-4">
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

          {/*  --------------------- TUTORIAL --------------------- */}
          {!showCourseCreation &&
          currentExploreTutStep <= exploreTutorialSteps.length - 1 ? (
            <StyledView
              className="bg-stone-900/90 p-4 pb-16"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                // paddingHorizontal: 16,
                // paddingBottom: 64,
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
      ) : (
        <>
          {/* ------- COURSE CREATION -------------------- */}
          {showCourseCreation ? (
            <StyledView className="bg-transparent flex w-full h-full items-center relative">
              <CourseCreationMap
                markers={markers}
                setMarkers={setMarkers}
                setCanAddMarkers={setCanAddMarkers}
              />

              {/* {showTutorial && currentStep > 0 && (
                <StyledView className="bg-transparent flex w-full h-full absolute">
                  <StyledView
                    id="tutorial-hud"
                    className="bg-slate-900/90 z-50 flex absolute bottom-6 p-6 rounded-md"
                  >
                    <StyledText className="text-white">
                      {ccTutorialSteps[currentStep].text}
                    </StyledText>
                    <StyledPressable
                      // onPress={handleStartPress}
                      className="bg-lime-500 px-6 py-2 rounded-lg flex justify-center relative items-center mt-4"
                    >
                      <StyledText className="font-medium text-2xl tracking-wide uppercase">
                        {ccTutorialSteps[currentStep].buttonText}
                      </StyledText>
                    </StyledPressable>
                  </StyledView>
                </StyledView>
              )} */}
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
                <StyledView className="flex flex-row items-center w-full justify-start px-4">
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

              <StyledSafeAreaView
                style={{
                  position: "absolute",
                  bottom: 44,
                  left: 0,
                  right: 0,
                  paddingHorizontal: 16,
                  paddingBottom: 16,
                  zIndex: 1,
                }}
              >
                <StyledView className="flex flex-row items-end w-full justify-around">
                  <StyledPressable
                    className="bg-neutral-500/90 px-3 py-1 rounded-lg border-neutral-900/90 border-2 shadow-2xl flex items-center justify-center"
                    onPress={handleUndoPress}
                  >
                    <StyledText className="text-stone-50 font-semibold text-lg">
                      Undo
                    </StyledText>
                  </StyledPressable>

                  <StyledPressable
                    className={`${
                      markers.length > 1
                        ? "bg-lime-600/90 border-lime-900/90"
                        : "bg-gray-600/90 border-gray-900/90 cursor-disabled"
                    } px-3 py-1 rounded-lg  border-2 shadow-2xl`}
                    onPress={handleSavePress}
                  >
                    <StyledText className="text-stone-50 font-semibold text-lg">
                      Save
                    </StyledText>
                  </StyledPressable>
                </StyledView>
              </StyledSafeAreaView>
            </StyledView>
          ) : (
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
          )}
        </>
      )}
      <StatusBar style="auto" />
    </>
  );
}

export default withExpoSnack(App);
