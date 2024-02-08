import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import MapScreen from "./Map";
import { withExpoSnack } from "nativewind";
import { StyledView, StyledText, StyledPressable } from "./utils/nw";
import { MapMarker } from "./types";

function App() {
  const [markers, setMarkers] = useState<MapMarker[]>([]); // Specify the type
  const [showIntro, setShowIntro] = useState(true); // Set to true initially
  const [showTutorial, setShowTutorial] = useState(true); // Set to true initially

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
        <StyledView className="bg-transparent flex w-full h-full items-center">
          {showTutorial ? (
            <StyledView
              id="tutorial-hud"
              className="bg-slate-900/90 z-50 flex absolute bottom-6 p-6 rounded-md"
            >
              <StyledText className="text-white">
                Tap the map to place a checkpoint.
              </StyledText>
            </StyledView>
          ) : (
            <></>
          )}
          <MapScreen markers={markers} setMarkers={setMarkers} />
          <StatusBar style="auto" />
        </StyledView>
      )}
    </>
  );
}

export default withExpoSnack(App);
