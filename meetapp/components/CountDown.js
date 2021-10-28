import React from 'react';
import { Text, View } from 'react-native';
import { formatSeconds } from "../config/date";

const CountDown = ({timer, textColor}) => {
    return React.useMemo(() => (
        <View style={{ marginTop: 5 }}>
            <Text style={{ fontFamily: 'OpenSans', color: textColor }}>
                {new Date(timer).getMinutes()}:{formatSeconds(new Date(timer).getSeconds())}
            </Text>
        </View>
    ), [timer]);
}

export default CountDown;