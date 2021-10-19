import React from 'react';
import { Text, View } from 'react-native';
import { formatSeconds } from "../config/date";

const CountDown = ({total, elapsedMinutes, elapsedSeconds, textColor}) => {
    return React.useMemo(() => (
        <View style={{ marginTop: 5 }}>
            <Text style={{ fontFamily: 'OpenSans', color: textColor }}>
                {total.getMinutes() - elapsedMinutes}:{formatSeconds(total.getSeconds() - elapsedSeconds)}
            </Text>
        </View>
    ), [elapsedSeconds, elapsedSeconds]);
}

export default CountDown;