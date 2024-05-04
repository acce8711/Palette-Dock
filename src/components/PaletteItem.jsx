import ColourBox from "./ColourBox"
import LikeButton from "./LikeButton";
import { nanoid } from "nanoid";

export default function PaletteItem (props) {

    const palette = props.palette.map(value => (
        <ColourBox colourCode={value} key={nanoid()} small={true}/>
    ))
    return (
        <div className="palette-item black-stroke">
            <div className="spread-horizontal-flex-2">
                <h3 className="overflow-text">{props.name}.</h3>
                <LikeButton numVotes={props.votes} id={props.id} size={"20"}/>
            </div>
            <div className="horizontal-flex-left gap-xs">
                {palette}
            </div>
            
        </div>
    )
}