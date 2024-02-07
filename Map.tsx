import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Button,
  Pressable,
} from "react-native";
import { type MapMarker } from "./types";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

const MapScreen = () => {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [showIntro, setShowIntro] = useState(true);

  // const [markers, setMarkers] = useState([
  // {
  //   id: 1,
  //   coordinate: { latitude: 37.78825, longitude: -122.4324 },
  //   title: "🚩 Checkpoint 1",
  //   description: "",
  // },
  // Add more initial markers as needed
  // ]);

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

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance * 1000; // Convert distance to meters
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const handleAddMarker = (newMarker: MapMarker) => {
    // Check if the new marker is within 50 meters of any existing marker
    const isWithinThreshold = markers.every((marker) =>
      isMarkerWithinThreshold(newMarker.coordinate, marker.coordinate, 50)
    );

    if (isWithinThreshold) {
      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    } else {
      console.log("Marker too close to an existing one. Not adding.");
    }
  };

  const handleUpdateMarker = (updatedMarker: MapMarker) => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === updatedMarker.id ? updatedMarker : marker
      )
    );
  };

  const handleDeleteMarker = (markerId: number) => {
    setMarkers((prevMarkers) =>
      prevMarkers.filter((marker) => marker.id !== markerId)
    );
  };

  const handleMapPress = (event: any) => {
    const newCoordinate = event.nativeEvent.coordinate;
    const newMarker = {
      id: markers.length + 1,
      coordinate: newCoordinate,
      title: `Checkpoint ${markers.length + 1}`,
      description: "",
    };

    handleAddMarker(newMarker);
  };

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
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={(map) => {
            const { latitude, longitude } = map.nativeEvent.coordinate;
            console.log(`==> MAP PRESS - lat: ${latitude}, lng: ${longitude}`);
            handleMapPress(map);
          }}
        >
          {markers.map((marker, index) => (
            <Marker
              draggable
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
              onCalloutPress={() =>
                console.log(`Marker ${marker.id} callout pressed`)
              }
              onPress={() => console.log(`Clicked Marker: ${marker.id}`)}
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
            </Marker>
          ))}
        </MapView>
      )}
    </>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
