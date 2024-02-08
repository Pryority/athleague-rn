import React, { Dispatch, useRef, useState } from "react";
import { MapOverlay } from "react-native-maps";

import { type MapMarker } from "./types";
import {
  StyledMapView,
  StyledMarker,
  StyledPressable,
  StyledSafeAreaView,
  StyledText,
  StyledView,
} from "./utils/nw";
import { calculateDistance } from "./utils/addCpCheck";
import { SafeAreaView } from "react-native";

const MapScreen = ({
  markers,
  setMarkers,
}: {
  markers: MapMarker[];
  setMarkers: Dispatch<React.SetStateAction<MapMarker[]>>;
  setCanAddMarkers: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const mapRef = useRef<any>();
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
    mapRef.current?.animateToRegion(marker.coordinate);
  };

  return (
    <StyledMapView
      // style={styles.map}
      ref={mapRef}
      className="flex w-full h-full fixed pointer-events-none"
      initialRegion={{
        latitude: 37.83,
        longitude: -122.51777381728886,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
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
    </StyledMapView>
  );
};

export default MapScreen;
