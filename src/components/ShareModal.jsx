
import ColourBox from "./ColourBox"
import { nanoid } from "nanoid";

export default function ShareModal(props) {
    const {colourCodes, hideModal} = props

    const colourBoxes = colourCodes.map(value => (
        <ColourBox colourCode = {value} key={nanoid()}/>
    ))

    return (
        <div className='modal-bg-size modal-bg'>
            <div className="modal-bg-size" onClick={props.hideModal}></div>
            <div className="share-modal column-flex black-stroke gap-ms">
                <button className="close" onClick={props.hideModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="50" viewBox="0 0 50 50" fill="none">
                        <path  fill-rule="evenodd" clip-rule="evenodd" d="M24.8261 22.1127L32.4793 14.4596L35.5406 17.5208L27.8874 25.174L35.5406 32.8272L32.4793 35.8885L24.8261 28.2353L17.1729 35.8885L14.1117 32.8272L21.7649 25.174L14.1117 17.5208L17.1729 14.4596L24.8261 22.1127Z" fill="#4690FF"/>
                    </svg>
                </button>
                <h3>thanks for sharing!</h3>
                <p>your palette will now be visible to other users.</p>
                <div className="colour-boxes horizontal-flex gap-sm">
                    {colourBoxes}
                </div>
                <h3 style={{color: "#4690FF"}}>{props.paletteName}.</h3>
                <button className="hover-btn reg-button right-margin" onClick={props.viewPalettes}>
                    View palettes
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                    </svg>
                </button>
            </div>
        </div>
    )
}