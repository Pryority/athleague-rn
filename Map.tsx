import React, { Dispatch, useRef, useState } from "react";
import MapView, { MapOverlay, Marker, Overlay } from "react-native-maps";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Button,
  Pressable,
  Dimensions,
} from "react-native";
import { type MapMarker } from "./types";
import { styled } from "nativewind";
import {
  StyledButton,
  StyledMapView,
  StyledMarker,
  StyledPressable,
  StyledSafeAreaView,
  StyledText,
  StyledView,
} from "./utils/nw";
import { calculateDistance } from "./utils/addCpCheck";

const MapScreen = ({
  markers,
  setMarkers,
}: {
  markers: MapMarker[];
  setMarkers: Dispatch<React.SetStateAction<MapMarker[]>>;
}) => {
  const [canAddMarkers, setCanAddMarkers] = useState(true);
  const [currentCpIndex, setCurrentCpIndex] = useState(0);
  const [deletedCheckpoints, setDeletedCheckpoints] = useState<string[]>([]);
  const dropAreaOverlay = useRef<MapOverlay>();

  const isMarkerWithinThreshold = (
    newCoordinate: { latitude: number; longitude: number },
    existingCoordinate: { latitude: number; longitude: number },
    threshold: number
  ) => {
    const distance = calculateDistance(
      newCoordinate.latitude,
      newCoordinate.longitude,
      existingCoordinate.latitude,
      existingCoordinate.longitude
    );

    return distance > threshold;
  };

  const handleMapPress = (event: any) => {
    if (!canAddMarkers) return;
    const newCoordinate = event.nativeEvent.coordinate;
    const newMarker = {
      id: markers.length + 1,
      coordinate: newCoordinate,
      title: `Checkpoint ${markers.length + 1}`,
      description: "",
    };
    const { latitude, longitude } = event.nativeEvent.coordinate;
    console.log(`==> MAP PRESS - lat: ${latitude}, lng: ${longitude}`);
    handleAddMarker(newMarker);
  };

  const handleAddMarker = (newMarker: MapMarker) => {
    // Check if the new marker is within 50 meters of any existing marker
    const isWithinThreshold = markers.every((marker: MapMarker) =>
      isMarkerWithinThreshold(newMarker.coordinate, marker.coordinate, 50)
    );

    if (isWithinThreshold) {
      setMarkers((prevMarkers: MapMarker[]) => [...prevMarkers, newMarker]);
    } else {
      console.log("Marker too close to an existing one. Not adding.");
    }
  };

  const handleUpdateMarker = (updatedMarker: MapMarker) => {
    setMarkers((prevMarkers: MapMarker[]) =>
      prevMarkers.map((marker: MapMarker) =>
        marker.id === updatedMarker.id ? updatedMarker : marker
      )
    );
  };

  const handleDeleteMarker = (markerId: number) => {
    setMarkers((prevMarkers: MapMarker[]) =>
      prevMarkers.filter((marker) => marker.id !== markerId)
    );
  };

  const handleMarkerClick = (marker: MapMarker) => {
    console.log(`Clicked Marker: ${marker.id}`);
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
    // Implement save functionality here
    console.log("Save pressed");
  };

  return (
    <>
      <StyledMapView
        // style={styles.map}
        className="flex  w-full h-full"
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={(map) => {
          handleMapPress(map);
        }}
      >
        {markers.map((marker: MapMarker, index: number) => (
          <StyledMarker
            className="absolute"
            draggable
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            onCalloutPress={() =>
              console.log(`Marker ${marker.id} callout pressed`)
            }
            onPress={() => handleMarkerClick(marker)}
          >
            <StyledView
              className={`${
                index === 0
                  ? "bg-lime-500"
                  : index === markers.length - 1
                  ? "bg-yellow-500"
                  : "bg-cyan-100"
              } p-4 rounded-full border-2 border-black relative justify-center items-center`}
            >
              <StyledText className="absolute">{marker.id}</StyledText>
            </StyledView>
          </StyledMarker>
        ))}
        <StyledSafeAreaView className="p-4 flex flex-row absolute">
          <StyledView className="flex flex-row items-center w-full justify-around z-50">
            <StyledPressable
              className="bg-neutral-500/90 px-3 py-1 rounded-lg border-neutral-900/90 border-2 shadow-2xl flex relative items-center justify-center"
              onPress={handleUndoPress}
            >
              <StyledText className="text-stone-50 font-semibold text-lg">
                Undo
              </StyledText>
            </StyledPressable>

            <StyledPressable
              className="bg-lime-600/90 px-3 py-1 rounded-lg border-lime-900/90 border-2 shadow-2xl"
              // onPress={handleSavePress}
            >
              <StyledText className="text-stone-50 font-semibold text-lg">
                Save
              </StyledText>
            </StyledPressable>
          </StyledView>
        </StyledSafeAreaView>
      </StyledMapView>
    </>
  );
};

export default MapScreen;
