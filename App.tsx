import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
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
import { Course, MapMarker, Mode } from "./types";
import ExploreMap from "./ExploreMap";
import BackgroundGeolocation from "react-native-background-geolocation";

function App() {
  const [markers, setMarkers] = useState<MapMarker[]>([]); // Specify the type
  const [showIntro, setShowIntro] = useState(true); // Set to true initially
  const [showTutorial, setShowTutorial] = useState(false); // Set to true initially
  const [currentStep, setCurrentStep] = useState(1);
  const [currentExploreTutStep, setCurrentExploreTutStep] = useState(0);
  const [canAddMarkers, setCanAddMarkers] = useState(true);
  const [showCourseCreation, setShowCourseCreation] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [savedCourse, setSavedCourse] = useState<Course | null>(null);
  const [focusCheckpoint, setFocusCheckpoint] = useState<boolean>(false);
  const [currentCpIndex, setCurrentCpIndex] = useState<null | number>(null);

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

  /* -- MAIN MENU BUTTONS -------------------- */

  const handleCreatePress = () => {
    setShowIntro(false);
    setShowCourseCreation(true);
  };

  const handleExplorePress = () => {
    setShowIntro(false);
    setShowExplore(true);
  };
  /* ----------------------------------------- */

  /* -- COURSE CREATION BUTTONS -------------- */
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
      return;
    } else if (markers.length >= 2) {
      console.log("Saving course...");

      const course: Course = {
        id: 0,
        mode: Mode.Race,
        title: "First Course",
        description: "C'est difficile!",
        checkpoints: markers,
        coordinate: { latitude: 0, longitude: 0 },
      };

      setSavedCourse(course);
      const timer = setTimeout(() => {
        setSavedCourse(null);
        console.log("ADD MARKER TIMER DONE");
      }, 500);
      // saveGeofences();
    }
  };

  // const saveGeofences = async () => {
  //   await BackgroundGeolocation.addGeofences([
  //     {
  //       identifier: "Home",
  //       radius: 200,
  //       latitude: 45.51921926,
  //       longitude: -73.61678581,
  //       notifyOnEntry: true,
  //     },
  //     {
  //       identifier: "Work",
  //       radius: 200,
  //       latitude: 45.61921927,
  //       longitude: -73.71678582,
  //       notifyOnEntry: true,
  //     },
  //   ]);
  //   console.log("[addGeofences] success");
  // };

  const handleCcBackPress = () => {
    if (!showCourseCreation) return;
    setShowCourseCreation(false);
    console.log("Going back to main menu from Course Creation...");
  };

  const handleDeletePress = () => {
    if (!showCourseCreation || currentCpIndex === null) return;

    // Create a copy of the markers array
    const updatedMarkers = [...markers];

    // Check if the currentCpIndex is a valid index
    if (currentCpIndex >= 0 && currentCpIndex < markers.length) {
      // Remove the marker at the currentCpIndex
      updatedMarkers.splice(currentCpIndex, 1);

      const updatedMarkersShifted = updatedMarkers.map((marker, index) => ({
        ...marker,
        id: index + 1,
      }));

      // Update the markers state
      setMarkers(updatedMarkersShifted);

      // Reset the currentCpIndex and focusCheckpoint
      setCurrentCpIndex(null);
      setFocusCheckpoint(false);

      console.log(`Deleted marker at index: ${currentCpIndex}`);
    }
  };
  /* ----------------------------------------- */

  /* -- EXPLORATION BUTTONS ------------------ */
  const handleExploreBackPress = () => {
    if (!showExplore) return;
    setShowExplore(false);
    console.log("Going back to main menu from Exploration...");
  };

  const handleExploreTutNext = () => {
    setCurrentExploreTutStep(currentExploreTutStep + 1);
  };
  /* ----------------------------------------- */

  useEffect(() => {
    // Log the savedCourse whenever it changes
    if (savedCourse === null) return;
    console.log("Saved Course:", savedCourse);
  }, [savedCourse]);

  return (
    <>
      {/* ------------------------------------ */}
      {/* ------- EXPLORE -------------------- */}
      {/* ------------------------------------ */}
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
            <StyledView
              id="explore-back-button"
              className="flex items-start w-full justify-center px-4"
            >
              <StyledPressable
                className="bg-neutral-500/90 px-3 py-1 rounded-lg border-neutral-900/90 border-2 shadow-2xl flex items-center justify-center"
                onPress={handleExploreBackPress}
              >
                <StyledText className="text-stone-50 font-semibold text-lg">
                  Back
                </StyledText>
              </StyledPressable>
            </StyledView>
          </StyledSafeAreaView>

          {/*  --- TUTORIAL --------------------- */}
          {!showCourseCreation &&
          currentExploreTutStep <= exploreTutorialSteps.length - 1 ? (
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
      ) : (
        <>
          {/* -------------------------------------------- */}
          {/* ------- COURSE CREATION -------------------- */}
          {/* -------------------------------------------- */}
          {showCourseCreation ? (
            <StyledView className="bg-transparent flex w-full h-full items-center relative">
              <CourseCreationMap
                markers={markers}
                savedCourse={savedCourse}
                setMarkers={setMarkers}
                setCanAddMarkers={setCanAddMarkers}
                setFocusCheckpoint={setFocusCheckpoint}
                currentCpIndex={currentCpIndex}
                setCurrentCpIndex={setCurrentCpIndex}
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

              <StyledView
                className="flex flex-row justify-between items-center top-8 w-full bg-red-500/20 px-3 z-50"
                style={{ position: "absolute" }}
              >
                <StyledPressable
                  className="bg-neutral-500/90 px-3 py-1 rounded-lg border-neutral-900/90 border-2 shadow-2xl flex items-center justify-center"
                  onPress={handleCcBackPress}
                >
                  <StyledText className="text-stone-50 font-semibold text-lg">
                    Back
                  </StyledText>
                </StyledPressable>

                <StyledPressable
                  className={`${
                    markers.length > 1
                      ? "bg-lime-600/90 border-lime-900/90"
                      : "bg-lime-600/20 border-lime-900/20 cursor-disabled"
                  } px-3 py-1 rounded-lg  border-2 shadow-2xl`}
                  onPress={handleSavePress}
                >
                  <StyledText className="text-stone-50 font-semibold text-lg">
                    Save
                  </StyledText>
                </StyledPressable>
              </StyledView>

              <StyledView
                className="flex flex-row justify-around items-center bottom-8 w-full bg-yellow-500/20 pointer-events-none px-3 z-50"
                style={{ position: "absolute", pointerEvents: "auto" }}
              >
                <StyledPressable
                  className="bg-neutral-500/90 px-3 py-1 rounded-lg border-neutral-900/90 border-2 shadow-2xl flex items-center justify-center"
                  onPress={handleUndoPress}
                  style={{ pointerEvents: "auto" }}
                >
                  <StyledText className="text-stone-50 font-semibold text-lg">
                    Undo
                  </StyledText>
                </StyledPressable>

                <StyledPressable
                  className={`${
                    focusCheckpoint
                      ? "bg-red-600/90 border-red-900/90"
                      : "bg-red-600/20 border-red-900/20 cursor-disabled"
                  } px-3 py-1 rounded-lg  border-2 shadow-2xl`}
                  onPress={handleDeletePress}
                >
                  <StyledText className="text-stone-50 font-semibold text-lg">
                    Delete
                  </StyledText>
                </StyledPressable>
              </StyledView>
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
