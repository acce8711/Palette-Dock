import { ChromePicker } from 'react-color'
import { useRef, useEffect } from 'react'

export default function ColourPicker(props)
{
    const topElement = useRef();
    const bottomElement = useRef();

    const firstTabElement = useRef();
    const lastTabElement = useRef();

    useEffect(()=>{
        topElement.current.focus();
    }, [])

    //tuto: https://www.youtube.com/watch?v=lZRGYXDKfpU
    useEffect(()=>{
        const focusTrap = (event) => {
            if(event.target == topElement.current)
                lastTabElement.current.focus()
            if(event.target == bottomElement.current)
                firstTabElement.current.focus()
        }

        document.addEventListener("focusin", focusTrap)

        return function removeListner()
        {
            document.removeEventListener("focusin", focusTrap)
        }
    }, [bottomElement])

    return(
        <div className='modal-bg-size modal-bg'>
            <div className='modal-bg-size' onClick={props.hidePicker}></div>
            <span tabIndex={0} ref={topElement} ></span>
            <div className="picker-modal" tabIndex={0} ref={firstTabElement}>
                <div style={{overflow: "hidden"}}>
                    <ChromePicker 
                        tabindex={0}
                        disableAlpha = {true}
                        color={props.colourCode}
                        onChange={(e) => props.colourChangeHandle(e.hex, props.id)}   
                    />
                </div>
                <div className="picker-footer">
                    <div className="black-stroke" style={{backgroundColor: props.colourCode}}></div>
                    <button ref={lastTabElement} className="hover-btn reg-button" onClick={props.hidePicker}>done</button>
                </div>
                <span tabIndex={0} ref={bottomElement} ></span>
            </div> 
        </div>
    )       
}