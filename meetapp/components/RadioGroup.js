import React from 'react'
import { View } from 'react-native'

const RadioGroup = ({children, value, onValueChange, color}) => {
    return (
        <View style={{flexDirection: 'row', justifyContent: "space-evenly"}}>
            {
                React.Children.map(children, child => React.cloneElement(child, {
                    selected: value,
                    color: color,
                    change: (v) => onValueChange(v)
                }))
            }
        </View>
    )
}

const RadioContainer = ({children, value, onValueChange, color}) => {
    return React.useMemo(() => (
        <RadioGroup children={children} value={value} onValueChange={onValueChange} color={color} />
    ), [value])
}

export default RadioContainer;