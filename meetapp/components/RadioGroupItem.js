import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import {COLORS} from "../colors";

const Item = ({selected, value, change, label, color}) => {
    const genderStyle = {
        backgroundColor: selected === value? COLORS[color] : "transparent",
        borderColor: selected === value? COLORS[color] : "#ccc",
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.outer, {borderColor: genderStyle.borderColor}]} onPress={() => change(value)}>
                <View style={[styles.inner, {backgroundColor: genderStyle.backgroundColor}]}></View>
            </TouchableOpacity>
            <Text style={styles.label}>{label}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row", 
        alignItems: "center"
    },
    inner: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    outer: {
        borderWidth: 2,
        width: 26,
        height: 26,
        borderRadius: 12,
        borderColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12
    },
    label: {
        fontFamily: 'OpenSans'
    }
})

export default Item