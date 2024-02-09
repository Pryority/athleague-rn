import React, { useEffect, useRef, useState } from "react";
import { MapPressEvent } from "react-native-maps";

import { Course, Mode } from "./types";
import {
  StyledMapView,
  StyledMarker,
  StyledPressable,
  StyledText,
  StyledView,
} from "./utils/nw";

const ExploreMap = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 0,
      mode: Mode.Race,
      title: `Course 1`,
      description: "Race your heart out on this scenic trail.",
      checkpoints: [
        {
          id: 0,
          coordinate: { latitude: 0, longitude: 0 },
          title: "",
          description: "",
        },
      ],
      coordinate: {
        latitude: 37.85675543804889,
        longitude: -122.4866827275912,
      },
    },
    {
      id: 1,
      mode: Mode.Sprint,
      title: `Course 2`,
      description: "This is a hard one! I hope you are ready.",
      checkpoints: [
        {
          id: 0,
          coordinate: { latitude: 0, longitude: 0 },
          title: "",
          description: "",
        },
      ],
      coordinate: {
        latitude: 37.828853586261985,
        longitude: -122.48825805558485,
      },
    },
    {
      id: 2,
      mode: Mode.Point,
      title: `Course 3`,
      description: "Be prepared for hilly terrain.",
      checkpoints: [
        {
          id: 0,
          coordinate: { latitude: 0, longitude: 0 },
          title: "",
          description: "",
        },
      ],
      coordinate: {
        latitude: 37.847692936761796,
        longitude: -122.519614584220635,
      },
    },
  ]);
  const [currentStep, setCurrentStep] = useState(1);

  const mapRef = useRef<any>();
  const [currentCourseIndex, setCurrentCourseIndex] = useState<null | number>(
    null
  );

  const handleExploreMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    console.log(`==> MAP PRESS - lat: ${latitude}, lng: ${longitude}`);
  };

  const handleCourseClick = (course: Course) => {
    setCurrentCourseIndex(course.id - 1);
    mapRef.current?.animateToRegion(course.coordinate);
    console.log(`Clicked Course: ${course.id}`);
  };

  useEffect(() => {
    console.log("currentCourseIndex", currentCourseIndex);
  }, [currentCourseIndex]);

  return (
    <StyledMapView
      ref={mapRef}
      className="flex w-full h-full fixed"
      initialRegion={{
        latitude: courses[0].coordinate.latitude,
        longitude: courses[0].coordinate.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      onPress={(map) => {
        handleExploreMapPress(map);
      }}
    >
      {courses.map((course: Course, index: number) => (
        <StyledMarker
          className="absolute"
          draggable
          key={course.id}
          coordinate={course.coordinate}
          title={course.title}
          description={course.description}
          onCalloutPress={() =>
            console.log(`course ${course.id} callout pressed`)
          }
          onPress={() => handleCourseClick(course)}
        >
          <StyledView
            className={`${
              course.mode === Mode.Race
                ? "bg-orange-500/90 border-orange-900/90"
                : course.mode === Mode.Sprint
                ? "bg-pink-500/90 border-pink-900/90"
                : course.mode === Mode.Point
                ? "bg-purple-500/90 border-purple-900/90"
                : ""
            } p-4 rounded-full border-2 relative justify-center items-center`}
          >
            <StyledText
              className="absolute"
              style={{ color: "white", fontWeight: "bold" }}
            >
              {course.mode === Mode.Race
                ? "R"
                : course.mode === Mode.Sprint
                ? "S"
                : course.mode === Mode.Point
                ? "P"
                : "None"}
            </StyledText>
          </StyledView>
        </StyledMarker>
      ))}
    </StyledMapView>
  );
};

export default ExploreMap;
