import {useState, useRef, useEffect} from "react"
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import Tooltip from "./Tooltip";

export default function PendingColour(props) {

    const deleteRef = useRef();
    const selectRef = useRef();

    const [showDeleteInfo, setShowDeleteInfo] = useState(false);
    const [showSelectInfo, setShowSelectInfo] = useState(false);

    const {
        attributes, 
        listeners, 
        setNodeRef, 
        transform, 
        transition
    } = useSortable({id: props.id});

    useEffect(() => {
        const checkFocusType = (event) => {
            setShowDeleteInfo((event.target == deleteRef.current))
            setShowSelectInfo((event.target == selectRef.current))
        }

        document.addEventListener("focusin", checkFocusType)

        return function cleanup(){
            document.removeEventListener("focusin", checkFocusType)
        }
    }, [])

    const style = {
        transition,
        transform: CSS.Translate.toString(transform)
    }
    
    const styles = {
        backgroundColor: props.colourCode,
    }

    const selectColour = (event) => {
        if (event.key === 's' || event.keyCode === 83)
            props.togglePicker()
    }

    const deleteColour = (event) => {
        if (event.key === 'd' || event.keyCode === 68) 
            props.removeColour()
    }



    return (
        <div className="pending-colour column-flex-2 gap-sm" ref={setNodeRef} {...attributes} {...listeners} style={style}>
            <span className={showDeleteInfo && "relative"}>
                <button onKeyDown={deleteColour} tabIndex={0} onClick={props.removeColour} className="horizontal-flex delete height-sm" aria-label="Delete colour (Press D)">
                delete
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.00016 0.666626H10.0002C10.7365 0.666626 11.3335 1.26358 11.3335 1.99996V2.66663H13.3335C14.0699 2.66663 14.6668 3.26358 14.6668 3.99996V5.33329C14.6668 6.06967 14.0699 6.66663 13.3335 6.66663H13.2801L12.6668 14C12.6668 14.7363 12.0699 15.3333 11.3335 15.3333H4.66683C3.93045 15.3333 3.3335 14.7363 3.3358 14.0553L2.72007 6.66663H2.66683C1.93045 6.66663 1.3335 6.06967 1.3335 5.33329V3.99996C1.3335 3.26358 1.93045 2.66663 2.66683 2.66663H4.66683V1.99996C4.66683 1.26358 5.26378 0.666626 6.00016 0.666626ZM11.9423 6.66663L11.3358 13.9446L11.3335 14H4.66683L4.05782 6.66663H11.9423ZM2.66683 5.33329V3.99996H13.3335V5.33329H2.66683ZM10.0002 1.99996V2.66663H6.00016V1.99996H10.0002Z" fill="#FF6262"/>
                </svg>
                </button>
                {/*showDeleteInfo &&
                    <Tooltip message="Delete (Press D)" />*/
                }
            </span>
        <span className={`column-flex-2 gap-sm ${showSelectInfo && "relative"}`}>
                <button onKeyDown={selectColour} tabIndex={0} className="box grey-stroke" style={styles} onClick={props.togglePicker} aria-label="Open colour picker (Press S)">
                </button> 
                <h4 className="height-sm">{props.colourCode.toUpperCase()}</h4> 
                {/*showSelectInfo &&
                    <Tooltip message="Select Colour (Press S)" pos="tooltip-2" />*/
                }    
            </span>
        </div>
    )
}