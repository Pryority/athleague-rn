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
          {showTutorial && currentStep > 0 && (
            <StyledView className="bg-transparent flex w-full h-full items-center">
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
              <StatusBar style="auto" />
            </StyledView>
          )}

          <MapScreen markers={markers} setMarkers={setMarkers} />
        </StyledView>
      )}
      <StatusBar style="auto" />
    </>
  );
}

export default withExpoSnack(App);
