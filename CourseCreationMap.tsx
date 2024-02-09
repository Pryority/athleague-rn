import React, { Dispatch, useEffect, useRef, useState } from "react";
import MapView, {
  BoundingBox,
  MapOverlay,
  MapPressEvent,
  MarkerDragEvent,
  MarkerDragStartEndEvent,
  Region,
} from "react-native-maps";

import { Course, type Checkpoint } from "./types";
import {
  StyledMapView,
  StyledMarker,
  StyledPressable,
  StyledSafeAreaView,
  StyledText,
  StyledView,
} from "./utils/nw";
import { calculateDistance, isMarkerWithinThreshold } from "./utils/addCpCheck";
import { SafeAreaView } from "react-native";

const CourseCreationMap = ({
  markers,
  setMarkers,
  savedCourse,
  setCanAddMarkers,
  setFocusCheckpoint,
  currentCpIndex,
  setCurrentCpIndex,
  isCalloutActive,
  setIsCalloutActive,
}: {
  markers: Checkpoint[];
  setMarkers: Dispatch<React.SetStateAction<Checkpoint[]>>;
  savedCourse: Course | null;
  setCanAddMarkers: Dispatch<React.SetStateAction<boolean>>;
  setFocusCheckpoint: Dispatch<React.SetStateAction<boolean>>;
  currentCpIndex: number | null;
  setCurrentCpIndex: Dispatch<React.SetStateAction<number | null>>;
  isCalloutActive: boolean;
  setIsCalloutActive: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const mapRef = useRef<MapView>();
  const [canAddMarkers] = useState(true);
  // const [deletedCheckpoints, setDeletedCheckpoints] = useState<string[]>([]);

  const handleCalloutPress = () => {
    console.log("isCalloutActive: ", isCalloutActive);
    setIsCalloutActive(false);
    console.log("isCalloutActive: ", isCalloutActive);
  };

  const handleCcMapPress = (event: MapPressEvent) => {
    if (!canAddMarkers || !event.nativeEvent.coordinate) return;
    const newCoordinate = event.nativeEvent.coordinate;
    const newMarker = {
      id: markers.length + 1,
      coordinate: newCoordinate,
      title: `Checkpoint: ${markers.length + 1}`,
      description: `Lat: ${newCoordinate.latitude.toFixed(
        4
      )} | Lng: ${newCoordinate.longitude.toFixed(4)}`,
    };
    const { latitude, longitude } = event.nativeEvent.coordinate;
    console.log(`==> MAP PRESS - lat: ${latitude}, lng: ${longitude}`);
    handleAddMarker(newMarker);
  };

  const handleAddMarker = (newMarker: Checkpoint) => {
    // Check if the new marker is within 50 meters of any existing marker
    const isWithinThreshold = markers.every((marker: Checkpoint) =>
      isMarkerWithinThreshold(newMarker.coordinate, marker.coordinate, 50)
    );

    if (isWithinThreshold) {
      setMarkers((prevMarkers: Checkpoint[]) => [...prevMarkers, newMarker]);
    } else {
      console.log("Marker too close to an existing one. Not adding.");
    }
  };

  const handleMarkerDragEnd = (e: MarkerDragStartEndEvent) => {
    // Extracting coordinate and id from the native event
    const { coordinate, id } = e.nativeEvent;

    // Checking if id is not undefined
    if (id !== undefined) {
      // Mapping through the markers array
      const updatedMarkers = markers.map((marker) =>
        // Updating the marker with the matching id
        marker.id === Number(id)
          ? {
              ...marker,
              description: `Lat: ${coordinate.latitude.toFixed(
                4
              )} | Lng: ${coordinate.longitude.toFixed(4)}`,
              coordinate,
            }
          : marker
      );
      // Setting the state with the updated markers, explicitly casting to MapMarker[]
      setMarkers(updatedMarkers);
      console.log("Updated Markers (Drag End):", updatedMarkers);
    }
  };

  const handleMarkerDrag = (e: MarkerDragEvent, draggedMarker: Checkpoint) => {
    // Extracting coordinate and id from the native event
    const { coordinate, id } = e.nativeEvent;

    // Checking if id is not undefined
    if (id !== undefined) {
      // Mapping through the markers array
      const updatedMarkers = markers.map((marker) =>
        // Updating the dragged marker with the matching id
        marker.id === draggedMarker.id
          ? {
              ...marker,
              description: `Lat: ${coordinate.latitude.toFixed(
                4
              )} | Lng: ${coordinate.longitude.toFixed(4)}`,
              coordinate,
            }
          : marker
      );

      setMarkers(updatedMarkers);
      console.log("Dragging Marker: ", draggedMarker.id);
      console.log(e.nativeEvent.coordinate);
      console.log("Updated Markers (Dragging):", updatedMarkers);
    }
  };

  const handleMarkerClick = (marker: Checkpoint) => {
    setIsCalloutActive(true);
    setCurrentCpIndex(marker.id - 1);
    setFocusCheckpoint(true);
    mapRef.current?.animateToRegion({
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
      latitude: marker.coordinate.latitude,
      longitude: marker.coordinate.longitude,
    });
    console.log(`Clicked Marker: ${marker.id}`);
  };

  useEffect(() => {
    console.log("currentCpIndex", currentCpIndex);
    if (savedCourse && savedCourse.checkpoints) {
      mapRef?.current?.fitToElements({
        edgePadding: {
          top: 64,
          right: 64,
          bottom: 64,
          left: 64,
        },
        animated: true,
      });
    }
  }, [currentCpIndex, savedCourse]);

  return (
    <StyledMapView
      ref={mapRef}
      className="flex w-full h-full fixed pointer-events-none"
      initialRegion={{
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
        latitude: 37.83,
        longitude: -122.51777381728886,
      }}
      onPress={(map) => {
        handleCcMapPress(map);
      }}
    >
      {markers.map((marker: Checkpoint, index: number) => (
        <StyledMarker
          className="absolute"
          draggable
          key={marker.id}
          coordinate={marker.coordinate}
          title={marker.title}
          description={marker.description}
          onCalloutPress={() => {
            handleCalloutPress();
            console.log(`Marker ${marker.id} callout pressed`);
          }}
          onPress={() => handleMarkerClick(marker)}
          onDragEnd={(e) => handleMarkerDragEnd(e)}
          onDrag={(e) => {
            handleMarkerDrag(e, marker);
          }}
          onDeselect={() => {
            setCurrentCpIndex(null);
            console.log("\n\nDESELECTED\n\n");
          }}
        >
          <StyledView
            className={`${
              index === 0
                ? "bg-lime-500/90 border-lime-900/90"
                : index === markers.length - 1
                ? "bg-yellow-500/90 border-yellow-900/90"
                : "bg-cyan-100/90 border-cyan-900/90"
            } p-4 rounded-full border-2 relative justify-center items-center`}
          >
            <StyledText className="absolute">{marker.id}</StyledText>
          </StyledView>
        </StyledMarker>
      ))}
    </StyledMapView>
  );
};

export default CourseCreationMap;
