import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const GoalItem = (props) => {
  console.log(props);
  return (
    <TouchableOpacity onPress={props.deleteElement} style={styles.goalItem}>
      <Text style={styles.goalText} key={props.index}>
        {props.item}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  goalItem: {
    backgroundColor: "grey",
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 7,
    borderRadius: 7,
  },
  goalText: {
    color: "white",
  },
});

export default GoalItem;
