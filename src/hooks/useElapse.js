import { useEffect, useState } from "react";
import { calculateTime } from "../utils/time";

const useElapse = (event)=>{
    const time = calculateTime(event?.target.getCurrentTime());

    const [elapsed, setElapsed]=useState(time);
    console.log({time});
    useEffect(()=>{
        if(event?.data === 2){
            return;
        };

        if(event?.data === 0){
            setElapsed(0)
        }
        const interval = setInterval(async() => {
            const newTime = calculateTime(event?.target.getCurrentTime());
            setElapsed(newTime)
        }, 100);

        return ()=>{
            clearInterval(interval)
        }
    },[event]);

    return {elapsed};
}

export default useElapse;