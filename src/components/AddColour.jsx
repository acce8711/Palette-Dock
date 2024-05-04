
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function AddColour(props) {

    const {
        attributes, 
        listeners, 
        setNodeRef, 
        transform, 
        transition,
    } = useSortable({id: props.id});

  

    const style = {
        transition,
        transform: CSS.Translate.toString(transform)
    }

    const selectColour = (event) => {
        if (event.key === 's' || event.keyCode === 83)
            props.togglePicker()
    }

    

    
    return (
        <div className="pending-colour column-flex-2" ref={setNodeRef} {...attributes} style={style}  {...listeners}>
            <button onKeyDown={selectColour} tabIndex={0} onClick={props.togglePicker} className="box black-stroke column-flex-2 white-bg" aria-label="Open colour picker (Press S)">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M22.5 17.5H35V22.5H22.5V35H17.5V22.5H5V17.5H17.5V5H22.5V17.5Z" fill="black">
                </path>
            </svg>
            create
            </button>
        </div>
    )
} 