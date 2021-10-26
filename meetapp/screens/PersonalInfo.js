import React, {useState} from 'react'
import { Button, Text, View, StyleSheet, TextInput, Dimensions, ScrollView, Alert, TouchableOpacity, Platform, Keyboard, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import RadioGroup from "../components/RadioGroup";
import RadioGroupItem from "../components/RadioGroupItem";
import CountrySelector from "../components/CountrySelector";
import {useSelector, useDispatch} from "react-redux";
import { useHeaderHeight } from '@react-navigation/elements';
import { createUser } from '../actions/auth';
import {COLORS} from "../colors";

const YEAR = new Date().getFullYear();
const { width, height } = Dimensions.get("window");
const PersonalInfo = (props) => {
    const [username, setUsername] = useState("")
    const [gender, setGender] = useState('male');
    const [date, setDate] = useState(new Date(`${YEAR - 18}-12-31`));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const headerHeight = useHeaderHeight();
    const [country, setCountry] = useState("")
    const [about, setAbout] = useState("")
    const [loading, setLoading] = useState(false)
    const auth = useSelector(state => state.auth)
    const profile = useSelector(state => state.profile)
    const dispatch = useDispatch()

    // Error messages
    const [usernameError, setUsernameError] = useState("");
    const [aboutError, setAboutError] = useState("");
    const [countryError, setCountryError] = useState("")
    const [dateError, setDateError] = useState("");

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        setDateError("")
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
    
    const showDatepicker = () => {
        showMode('date');
    };

    const onUsernameChange = value => {
        setUsernameError("");
        setUsername(value);
    }

    const onAboutChange = value => {
        setAboutError("");
        setAbout(value)
    }

    const onCountryChange = value => {
        setCountry(value);
        setCountryError("");
    }

    const changed = value => {
        setGender(value)
    }

    const validate = () => {
        let isValid = true;

        if(username.trim().length < 3 || username.trim().length > 16){
            setUsernameError("Name should be between 3 and 16 characters");
            isValid = false;
        }
        if(country.trim().length === 0){
            setCountryError("Please select your country");
            isValid = false;
        }
        if(about.trim().length <= 10){
            setAboutError("Please tell us about yourself");
            isValid = false;
        }
        if(!date){
            setDateError("Please select your birthdate");
            isValid = false;
        }
        return isValid;
    }

    const onSubmitHandler = async () => {
        const result = validate();
        if(!result){
            return;
        }
        const user = {
            ...profile,
            username,
            gender,
            birthdate: date,
            country,
            about
        };
        try {
            setLoading(true)
            await dispatch(createUser(user));
            props.navigation.navigate("Main")
        } catch (err) {
            Alert.alert("Error occurred", "Please try again", [{text: "Ok", style: "default"}])
            setLoading(false)
        }

    }

    const exit = () => {
        Keyboard.dismiss()
    }

    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios"? "padding" : "height"}>
            <ScrollView keyboardDismissMode='on-drag' keyboardShouldPersistTaps="always">
                <TouchableOpacity style={styles.container} activeOpacity={1} onPress={exit}>
                    <View>
                        <Text style={styles.text}>Create Profile</Text>
                    </View>

                    <View style={styles.spaceVertical}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput style={styles.input} placeholder="Enter your name..." value={username} onChangeText={onUsernameChange} />
                        {usernameError.length > 0 && <Text style={styles.error}>{usernameError}</Text>}
                    </View>

                    <View style={styles.spaceVertical}>
                        <View>
                            <Text style={styles.label}>Gender</Text>
                        </View>
                        <View>
                            <RadioGroup value={gender} onValueChange={changed} color="primary">
                                <RadioGroupItem value="male" label='Male' />
                                <RadioGroupItem value="female" label="Female" />
                            </RadioGroup>
                        </View>
                    </View>

                    <View style={{marginVertical: 15}}>
                        <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}}>
                            <View>
                                <Text style={styles.label}>Country</Text>
                            </View>
                            <TouchableOpacity activeOpacity={0.7} style={{flexDirection: 'row'}} onPress={() => setShowCountryPicker(true)}>
                                <Text style={{marginRight: 7, fontFamily: 'OpenSans'}}>{country === "" ? "Choose country" : country}</Text>
                                <Ionicons name="chevron-forward-outline" size={18} />
                            </TouchableOpacity>
                        </View>
                        {countryError.length > 0 && <Text style={styles.error}>{countryError}</Text>}
                    </View>

                    <View style={{marginVertical: 15}}>
                        <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}}>
                            <View>
                                <Text style={styles.label}>Birthdate</Text>
                            </View>
                            <TouchableOpacity activeOpacity={0.7} onPress={showDatepicker} style={{flexDirection: 'row', alignItems: "center"}}>
                                <Text style={{marginRight: 7}}>{date? `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}` : "Pick your birthdate"}</Text>
                                <Ionicons name="calendar-outline" size={27} />
                                {show && (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={date}
                                        mode={mode}
                                        is24Hour={true}
                                        maximumDate={new Date(`${YEAR - 18}-12-31`)}
                                        minimumDate={new Date(YEAR - 60, 1, 1)}
                                        onChange={onChange}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                        {dateError.length > 0 && <Text style={styles.error}>{dateError}</Text>}
                    </View>

                    <View style={styles.spaceVertical}>
                        <Text style={styles.label}>About</Text>
                        <TextInput multiline value={about} onChangeText={onAboutChange} placeholder='Tell us about yourself' style={[styles.input, {height: 100}]} />
                        {aboutError.length > 0 && <Text style={styles.error}>{aboutError}</Text>}
                    </View>
                    {loading ? <ActivityIndicator color={COLORS.primary} size="large" /> : 
                        <TouchableOpacity style={styles.button} disabled={loading} onPress={onSubmitHandler}>
                            <Text style={[styles.label, {color: "white"}]}>Submit your informations</Text>
                        </TouchableOpacity>
                    }
                </TouchableOpacity>
            </ScrollView>
            {showCountryPicker && 
                <CountrySelector 
                    show={showCountryPicker} 
                    hide={() => setShowCountryPicker(false)} 
                    onChange={onCountryChange}
                />
            }
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        paddingVertical: 60,
        paddingHorizontal: 17
    },
    text: {
        fontSize: 23,
        color: COLORS.primary,
        fontFamily: "OpenSans",
        textAlign: "center",
        marginBottom: 20
    },
    label: {
        fontSize: 16,
        fontFamily: 'OpenSans'
    },
    input: {
        marginTop: 10,
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#ccc"
    },
    error: {
        color: "red", 
        fontSize: 14,
        marginTop: 6,
    },
    spaceVertical: {
        marginVertical: 15
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 5,
        marginTop: 7
    }
})

export default PersonalInfo            