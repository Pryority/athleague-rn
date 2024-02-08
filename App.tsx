import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import MapView, { LatLng, Marker, Overlay } from "react-native-maps";
import MapScreen from "./Map";
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

function App() {
  const [markers, setMarkers] = useState<MapMarker[]>([]); // Specify the type
  const [showIntro, setShowIntro] = useState(false); // Set to true initially
  const [showTutorial, setShowTutorial] = useState(false); // Set to true initially
  const [currentStep, setCurrentStep] = useState(1);
  const [canAddMarkers, setCanAddMarkers] = useState(true);

  const tutorialSteps = [
    {
      text: "Welcome to Athleague. Tap the 'Start' button to begin.",
      buttonText: "Start",
    },
    {
      text: "Tap the map to place a checkpoint.",
      buttonText: "Next",
    },
  ];

  const handleStartPress = () => {
    setShowIntro(false);
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

  return (
    <>
      {showIntro ? (
        <StyledView className="flex relative w-full justify-center items-center h-full">
          <StyledView className="flex flex-col bg-white/80 w-full justify-center items-center h-full space-y-4 p-4">
            <StyledText className="text-6xl text-center tracking-tighter">
              Welcome to{" "}
              <StyledText className="font-bold uppercase tracking-[-4px]">
                Athleague
              </StyledText>
            </StyledText>
            <StyledView className="flex flex-col items-center">
              <StyledPressable
                onPress={handleStartPress}
                className="bg-lime-500 px-6 py-2 rounded-lg flex justify-center relative items-center w-1/2"
              >
                <StyledText className="font-medium text-2xl tracking-wide uppercase">
                  Start
                </StyledText>
              </StyledPressable>
            </StyledView>
          </StyledView>
        </StyledView>
      ) : (
        <StyledView className="bg-transparent flex w-full h-full items-center relative">
          <MapScreen
            markers={markers}
            setMarkers={setMarkers}
            setCanAddMarkers={setCanAddMarkers}
          />

          {showTutorial && currentStep > 0 && (
            <StyledView className="bg-transparent flex w-full h-full absolute">
              <StyledView
                id="tutorial-hud"
                className="bg-slate-900/90 z-50 flex absolute bottom-6 p-6 rounded-md"
              >
                <StyledText className="text-white">
                  {tutorialSteps[currentStep].text}
                </StyledText>
                <StyledPressable
                  onPress={handleStartPress}
                  className="bg-lime-500 px-6 py-2 rounded-lg flex justify-center relative items-center mt-4"
                >
                  <StyledText className="font-medium text-2xl tracking-wide uppercase">
                    {tutorialSteps[currentStep].buttonText}
                  </StyledText>
                </StyledPressable>
              </StyledView>
            </StyledView>
          )}

          <StyledSafeAreaView
            style={{
              position: "absolute",
              bottom: 44,
              left: 0,
              right: 0,
              paddingHorizontal: 16,
              paddingBottom: 16,
              zIndex: 1, // Set a higher zIndex to ensure it appears on top of the map
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
      )}
      <StatusBar style="auto" />
    </>
  );
}

export default withExpoSnack(App);
