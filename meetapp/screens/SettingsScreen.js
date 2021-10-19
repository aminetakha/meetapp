import React, {useState, useLayoutEffect} from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { Ionicons } from "@expo/vector-icons";
import RadioGroup from "../components/RadioGroup";
import RadioGroupItem from "../components/RadioGroupItem";
import CountrySelector from "../components/CountrySelector";
import {useDispatch} from "react-redux";
import { useHeaderHeight } from '@react-navigation/elements';
import { updateFilters } from '../actions/filters';
import Toast from 'react-native-root-toast';
import { useIsFocused } from "@react-navigation/native";
import {COLORS} from "../colors";

const CustomMarker = () => {
    return (
        <View style={{width: 30, height: 30, borderRadius: 15, backgroundColor: "#457B9D"}}></View>
    )
}

const { width, height } = Dimensions.get("window");
const SettingsScreen = (props) => {
    const [country, setCountry] = useState("");
    const [gender, setGender] = useState('');
    const [show, setShow] = useState(false);
    const [values, setValues] = useState([18, 60]);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const headerHeight = useHeaderHeight();
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    useLayoutEffect(() => {
        if(isFocused){
            props.navigation.setOptions({
                headerTitleStyle: {
                    fontFamily: "OpenSans"
                }
            })
        }
    }, [isFocused])

    const onValuesChange = v => {
        setValues(v)
    }
    
    const updateHandler = () => {
        const filters = {
            minAge: values[0],
            maxAge: values[1],
            country,
            gender
        }
        dispatch(updateFilters(filters))
        Toast.show('Filters have been updated', {
            duration: Toast.durations.SHORT,
        });
    }

    return (
        <View style={styles.container}>
            <View style={{ marginBottom: 40 }}>
                <Text style={styles.text}>Select Age range: {values[0]} - {values[1]}</Text>
                <View style={{ marginTop: 28, alignItems: "center" }}>
                    <MultiSlider
                        values={[18, 60]}
                        onValuesChangeFinish={onValuesChange}
                        min={18}
                        max={60}
                        selectedStyle={{backgroundColor: COLORS.secondary}}
                        step={1}
                        allowOverlap={false}
                        customMarker={CustomMarker}
                        enableLabel={() => false}
                        trackStyle={{height: 5}}
                    />
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
                <View>
                    <Text style={styles.text}>Country</Text>
                </View>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center" }} onPress={() => setShowCountryPicker(true)}>
                    <Text style={{fontFamily: "OpenSans", marginRight: 14}}>{country === "" ? "Choose country" : country}</Text>
                    <Ionicons name="chevron-forward-outline" size={18} />
                </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 40 }}>
                <Text style={styles.text}>Gender</Text>
                <RadioGroup value={gender} onValueChange={value => setGender(value)} color="secondary">
                    <RadioGroupItem value="male" label='Male' />
                    <RadioGroupItem value="female" label="Female" />
                    <RadioGroupItem value="" label="Both" />
                </RadioGroup>
            </View>
            <TouchableOpacity onPress={updateHandler} style={styles.button}>
                <Text style={{fontFamily: "OpenSans", color: "white", fontSize: 16}}>Save Filters</Text>
            </TouchableOpacity>
                
            {showCountryPicker && 
                <CountrySelector 
                    show={showCountryPicker} 
                    hide={() => setShowCountryPicker(false)} 
                    onChange={value => setCountry(value)}
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: 45,
        paddingHorizontal: 20
    },
    text: {
        fontFamily: "OpenSans",
        fontSize: 16,
        marginBottom: 14
    },
    button: {
        backgroundColor: COLORS.secondary,
        paddingVertical: 17,
        alignItems: "center",
        borderRadius: 7,
    }
})

export default SettingsScreen