import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { withExpoSnack } from "nativewind";
import MainMenu from "./MainMenu";
import Explore from "./Explore";
import CourseCreation from "./CourseCreation";

function App() {
  const [viewStack, setViewStack] = useState(["MainMenu"]);

  const handleCreatePress = () => {
    setViewStack(["CourseCreation", ...viewStack]);
  };

  const handleExplorePress = () => {
    setViewStack(["Explore", ...viewStack]);
  };

  const handleBackPress = () => {
    setViewStack(["MainMenu"]);
  };

  const currentView = viewStack[0];

  return (
    <>
      {currentView === "MainMenu" && (
        <MainMenu
          handleCreatePress={handleCreatePress}
          handleExplorePress={handleExplorePress}
        />
      )}
      {currentView === "Explore" && (
        <Explore
          handleBackPress={handleBackPress} // Navigate back on close
        />
      )}
      {currentView === "CourseCreation" && (
        <CourseCreation handleBackPress={handleBackPress} />
      )}
      <StatusBar style="auto" />
    </>
  );
}

export default withExpoSnack(App);
