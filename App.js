import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import GoalItem from "./components/goalItem";
import InputComponent from "./components/InputComponent";

export default function App() {
  const [enteredGoal, setEnteredGoal] = useState("");

  const goalInputHandler = (enteredText) => {
    setEnteredGoal(enteredText);
  };

  const [courseGoals, setCourseGoals] = useState([]);
  const addGoalHandler = () => {
    setCourseGoals([...courseGoals, enteredGoal]);
    // console.log(enteredGoal);
    // console.log(courseGoals);
  };

  const deleteElement = () => {
    console.log("delete");
  };

  return (
    <View style={styles.container}>
      <InputComponent
        enteredGoal={enteredGoal}
        goalInputHandler={goalInputHandler}
        addGoalHandler={addGoalHandler}
      />
      {/* <View style={styles.row}>
        <TextInput
          onChangeText={goalInputHandler}
          // value={enteredGoal}
          style={styles.textInput}
          placeholder="Course goal"
        ></TextInput>
        <Button onPress={addGoalHandler} title="ADD" />
      </View> */}
      <FlatList
        data={courseGoals}
        renderItem={(data) => (
          <GoalItem
            item={data.item}
            index={data.index}
            deleteElement={deleteElement}
          />
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}
// <View style={styles.goalItem}>
//   <Text style={styles.goalText} key={data.index}>
//     {data.item}
//   </Text>
// </View>

const styles = StyleSheet.create({
  container: {
    padding: 40,
  },
  // textInput: {
  //   backgroundColor: "#4267B2",
  //   color: "white",
  //   width: "80%",
  //   paddingVertical: 10,
  //   paddingHorizontal: 7,
  //   borderRadius: 7,
  // },
  // row: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   marginBottom: 30,
  // },
  // goalItem: {
  //   backgroundColor: "grey",
  //   marginBottom: 20,
  //   paddingVertical: 10,
  //   paddingHorizontal: 7,
  //   borderRadius: 7,
  // },
  // goalText: {
  //   color: "white",
  // },
});
