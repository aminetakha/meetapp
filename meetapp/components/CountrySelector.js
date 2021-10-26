import React, {useState} from 'react'
import { View, Text, Modal, StyleSheet, ScrollView } from 'react-native'
import { Ionicons } from "@expo/vector-icons"
import Country from './Country';
import { countries } from '../data/countries'
import { COLORS } from "../colors"

const CountrySelector = ({show, hide, onChange}) => {
    const [modalVisible] = useState(show);
    const [page, setPage] = useState(0);
    const [itemsPerPage] = useState(20);
    const [countriesList, setCountriesList] = useState(countries.slice(page*itemsPerPage, itemsPerPage))
    const onSelectCountry = (item) => {
        onChange(item.name)
        hide()
    }
    const renderCountries = (item) => {
        return (
            <Country key={item.code} country={item} onChange={value => onSelectCountry(value)} />
        )
    }

    const fetchMoreCountries = () => {
        setPage(prev => prev + 1);
        setCountriesList([...countriesList, ...countries.slice((page+1)*itemsPerPage, (page+1)*itemsPerPage + itemsPerPage)])
    }

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={hide}
            >
                <View style={styles.container}>
                    <View style={styles.modalView}>
                        <View style={styles.header}>
                            <Ionicons name="arrow-back" size={30} color={COLORS.primary} onPress={hide} />
                            <Text style={styles.modalText}>Country</Text>
                        </View>
                        <ScrollView
                            onScroll={({nativeEvent}) => {
                                const {contentOffset, contentSize, layoutMeasurement} = nativeEvent;
                                if(contentOffset.y + layoutMeasurement.height >= contentSize.height){
                                    fetchMoreCountries()
                                }
                            }}
                        >
                            {countriesList.map((country, index) => {
                                return renderCountries(country, index)
                            })}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    modalView: {
        flex: 1,
        backgroundColor: 'white',
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderColor: "#ccc",
        paddingHorizontal: 20
    },
    openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    modalText: {
        marginVertical: 35,
        fontSize: 21,
        color: COLORS.primary,
        fontFamily: "OpenSans",
        marginLeft: 18
    },
    countryContainer: {
        paddingVertical: 18
    },
    header: {
        flexDirection: "row", 
        alignItems: "center"
    }
});

export default CountrySelector;