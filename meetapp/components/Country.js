import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

const Country = ({country, onChange}) => {
    return (
        <TouchableOpacity key={country.code} style={styles.countryContainer} onPress={() => onChange(country)}>
            <Text style={{ fontSize: 15 }}>
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
})

export default React.memo(Country)