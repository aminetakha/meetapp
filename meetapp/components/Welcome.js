import React from 'react'
import { ScrollView, StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from "../colors";

const SCREEN_WIDTH = Dimensions.get("window").width;
const FOCUSED_WIDTH = 12;
const NOT_FOCUSED_WIDTH = 8;
const focused = {width: FOCUSED_WIDTH, height: FOCUSED_WIDTH, borderWidth: 3, borderRadius: FOCUSED_WIDTH}
const notFocused = {width: NOT_FOCUSED_WIDTH, height: NOT_FOCUSED_WIDTH, borderWidth: 1, borderRadius: NOT_FOCUSED_WIDTH}

const Welcome = (props) => {
    const positions = (position) => {
        return props.data.map(item => (
            <View key={item.id} style={[styles.position, item.id===position? focused : notFocused]}></View>
        ))
    }

    const render = () => {
        return props.data.map((item, index) => (
            <View key={index} style={[styles.container]}>
                <LinearGradient
                    style={[styles.gradientContainer, {width: SCREEN_WIDTH}]}
                    colors={["#E63946", "#457B9D"]}
                    locations={[0.2, 0.7]}
                >
                    <View>
                        <Text style={styles.text}>{item.title}</Text>
                        {index === (props.data.length-1) && 
                            <TouchableOpacity style={{ backgroundColor: COLORS.secondary, paddingVertical: 17, alignItems: "center" }} onPress={props.navigateToSignIn}>
                                <Text style={{fontSize: 17, color: "white"}}>I'm ready</Text>
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={styles.positions}>
                        {positions(index)}
                    </View>
                </LinearGradient>
            </View>
        ))
    }

    return (
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {render()}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    container: {
        flex: 1,
        width: SCREEN_WIDTH,
        justifyContent: "center",
        alignItems: "center"
    },
    positions: {
        position: "absolute",
        bottom: 40,
        flexDirection: "row",
        alignItems: "center"
    },
    position: {
        width: 11, 
        height: 11,
        borderRadius: 11,
        borderColor: 'white',
        marginHorizontal: 4
    },
    gradientContainer: {
        justifyContent: "center", 
        alignItems: "center",
        flex: 1
    },
    text: {
        fontSize: 20,
        textAlign: "center",
        color: "white",
        marginBottom: 20,
        fontFamily: "OpenSans"
    }
})

export default Welcome
