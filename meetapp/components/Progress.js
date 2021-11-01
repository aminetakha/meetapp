import React, {useEffect, useState} from 'react'
import { View } from 'react-native'
import CountDown from './CountDown';
import Slider from '@react-native-community/slider';
import { useDispatch } from 'react-redux';

const Progress = ({value, width, seekTo, max, primary, secondary, start, finish, onProgress, textColor}) => {
    const [steps] = useState(Math.ceil((width/max)));
    const [total] = useState(new Date(max * 1000));
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [controls, setControls] = useState({
        currentSteps: value,
        elapsed: 0,
        continueProgress: false
    });
    const dispatch = useDispatch();

    useEffect(() => {
        const interval = controls.continueProgress && setInterval(() => {
            if(total - new Date(controls.elapsed) >= 1000){
                setControls({
                    ...controls,
                    currentSteps: controls.currentSteps + steps,
                    elapsed: controls.elapsed + 1000
                })
            }else{
                setControls({
                    ...controls,
                    currentSteps: 0,
                    elapsed: 0,
                    continueProgress: false
                })
                finish()
                clearInterval(interval)
            }
        }, 1000)

        return () => {
            clearInterval(interval);
        }
    }, [controls.currentSteps, controls.continueProgress])

    useEffect(() => {
        onProgress(controls.elapsed);
        setControls({
            ...controls,
            continueProgress: start
        })
    }, [start])

    const enableScroll = (value) => {
        seekTo(value * 1000);
        setControls({
            ...controls,
            elapsed: value * 1000
        })
        dispatch({type: "SCROLL_STATUS", payload: true});
    }

    const disableScroll = () => {
        setScrollEnabled({type: "SCROLL_STATUS", payload: false})
    };

    return (
        <View style={{marginRight: 10, paddingVertical: 5}}>
            <Slider
                value={controls.elapsed / 1000}
                style={{width: 150}}
                minimumValue={0}
                maximumValue={max}
                minimumTrackTintColor={primary}
                maximumTrackTintColor={secondary}
                disabled={start}
                onSlidingStart={disableScroll}
                onSlidingComplete={enableScroll}
            />
            {React.useMemo(() => <CountDown 
                timer={total - new Date(controls.elapsed)}
                textColor={textColor}
            />, [controls.elapsed])}
        </View>
    )
}

export default Progress