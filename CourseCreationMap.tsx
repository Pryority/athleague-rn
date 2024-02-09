import React, { Dispatch, useEffect, useRef, useState } from "react";
import {
  MapOverlay,
  MapPressEvent,
  MarkerDragEvent,
  MarkerDragStartEndEvent,
} from "react-native-maps";

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

const CourseCreationMap = ({
  markers,
  setMarkers,
}: {
  markers: MapMarker[];
  setMarkers: Dispatch<React.SetStateAction<MapMarker[]>>;
  setCanAddMarkers: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const mapRef = useRef<any>();
  const [canAddMarkers, setCanAddMarkers] = useState(true);
  const [currentCpIndex, setCurrentCpIndex] = useState<null | number>(null);
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

  const handleMarkerDrag = (e: MarkerDragEvent, draggedMarker: MapMarker) => {
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

  const handleDeleteMarker = (markerId: number) => {
    setMarkers((prevMarkers: MapMarker[]) =>
      prevMarkers.filter((marker) => marker.id !== markerId)
    );
  };

  const handleMarkerClick = (marker: MapMarker) => {
    setCurrentCpIndex(marker.id - 1);
    mapRef.current?.animateToRegion(marker.coordinate);
    console.log(`Clicked Marker: ${marker.id}`);
  };

  useEffect(() => {
    console.log("currentCpIndex", currentCpIndex);
  }, [currentCpIndex]);

  return (
    <StyledMapView
      // style={styles.map}
      ref={mapRef}
      className="flex w-full h-full fixed pointer-events-none"
      initialRegion={{
        latitude: 37.83,
        longitude: -122.51777381728886,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      onPress={(map) => {
        handleCcMapPress(map);
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
          onDragEnd={(e) => handleMarkerDragEnd(e)}
          onDrag={(e) => {
            handleMarkerDrag(e, marker);
          }}
        >
          <StyledView
            className={`${
              index === 0
                ? "bg-lime-500/90"
                : index === markers.length - 1
                ? "bg-yellow-500/90"
                : "bg-cyan-100/90"
            } p-4 rounded-full border-2 border-black relative justify-center items-center`}
          >
            <StyledText className="absolute">{marker.id}</StyledText>
          </StyledView>
        </StyledMarker>
      ))}
    </StyledMapView>
  );
};

export default CourseCreationMap;
