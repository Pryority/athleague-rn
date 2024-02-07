import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";
import MapScreen from "./Map";

export default function App() {
  return (
    <View style={styles.container}>
      <MapScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
