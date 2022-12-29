import React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const InputComponent = ({enteredGoal, goalInputHandler, addGoalHandler}) => {
  return (
    <View style={styles.row}>
      <TextInput
        onChangeText={goalInputHandler}
        value={enteredGoal}
        style={styles.textInput}
        placeholder="Course goal"
      ></TextInput>
      <Button onPress={addGoalHandler} title="ADD" />
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: "#4267B2",
    color: "white",
    width: "80%",
    paddingVertical: 10,
    paddingHorizontal: 7,
    borderRadius: 7,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
});

export default InputComponent;
