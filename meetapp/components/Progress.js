import React, {useEffect, useState} from 'react'
import { View } from 'react-native'
import CountDown from './CountDown';

const Progress = ({value, width, height, primary, secondary, max, borderRadius, start, finish, onProgress, textColor}) => {
    const [steps] = useState(Math.ceil((width/max)));
    const [offset] = useState(max*steps - width)
    const [total] = useState(new Date(max * 1000));
    const [controls, setControls] = useState({
        currentSteps: value,
        elapsed: 0,
        continueProgress: false
    });

    useEffect(() => {
        const interval = controls.continueProgress && setInterval(() => {
            if(controls.currentSteps < width){
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

    return (
        <View style={{width: width+offset, height, backgroundColor: secondary, borderRadius}}>
            <View style={{ width: Math.ceil(controls.currentSteps), backgroundColor: primary, height, borderRadius }}></View>
            {React.useMemo(() => <CountDown 
                timer={total - new Date(controls.elapsed)}
                textColor={textColor}
            />, [controls.elapsed])}
        </View>
    )
}

export default Progress