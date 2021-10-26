import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

const Country = ({country, onChange}) => {
    return (
        <TouchableOpacity style={styles.countryContainer} onPress={() => onChange(country)}>
            <Text style={styles.text}>
                {country.name}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    countryContainer: {
        paddingVertical: 17,
        borderBottomWidth: 1,
        borderColor: "#ccc"
    },
    text: {
        fontSize: 15,
        fontFamily: "OpenSans"
    }
})

export default React.memo(Country)