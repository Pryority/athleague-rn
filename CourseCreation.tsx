import React, { useEffect, useRef, useState } from "react";
import { StyledPressable, StyledText, StyledView } from "./utils/nw";
import CourseCreationMap from "./CourseCreationMap";
import { Checkpoint, Course, Mode } from "./types";
import { MapMarker } from "react-native-maps";

const CourseCreation = ({
  handleBackPress,
}: {
  handleBackPress: () => void;
}) => {
  const markerRefs = useRef<MapMarker[]>([]);
  const [markers, setMarkers] = useState<Checkpoint[]>([]);
  const [savedCourse, setSavedCourse] = useState<Course | null>(null);
  const [focusCheckpoint, setFocusCheckpoint] = useState<boolean>(false);
  const [canAddMarkers, setCanAddMarkers] = useState(true);
  const [currentCpIndex, setCurrentCpIndex] = useState<number | null>(null);
  const [isCalloutActive, setIsCalloutActive] = useState<boolean>(false);

  /* -- HUD BUTTON HANDLERS -------------- */
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

  const handleDeletePress = () => {
    if (currentCpIndex === null) return;

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

      const markerRef = markerRefs.current[currentCpIndex];
      if (markerRef) {
        markerRef.hideCallout();
      }

      console.log(`Deleted marker at index: ${currentCpIndex}`);
    }
  };
  /* -- END HUD BUTTON HANDLERS -------------- */

  useEffect(() => {
    const markerRef =
      currentCpIndex !== null ? markerRefs.current[currentCpIndex] : null;

    // Log the savedCourse whenever it changes
    if (savedCourse === null) return;
    if (isCalloutActive === false) {
      if (markerRef) {
        markerRef.hideCallout();
      }
    }
    console.log("Saved Course:", savedCourse);
  }, [savedCourse, isCalloutActive, markerRefs]);

  return (
    <StyledView className="bg-transparent flex w-full h-full items-center relative">
      {/* -------------------------------------------- */}
      {/* ------- COURSE CREATION -------------------- */}
      {/* -------------------------------------------- */}
      <CourseCreationMap
        markers={markers}
        savedCourse={savedCourse}
        setMarkers={setMarkers}
        setCanAddMarkers={setCanAddMarkers}
        setFocusCheckpoint={setFocusCheckpoint}
        currentCpIndex={currentCpIndex}
        setCurrentCpIndex={setCurrentCpIndex}
        isCalloutActive={isCalloutActive}
        setIsCalloutActive={setIsCalloutActive}
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
          onPress={handleBackPress}
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
  );
};

export default CourseCreation;

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
