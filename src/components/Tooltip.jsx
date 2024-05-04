
export default function Tooltip(props)
{
    return (
        <div 
        className={`tooltip column-flex ${props.pos}`} 
        >
            <div className="tooltip-locator tooltip-border-colour"></div>
            <div className="tooltip-content horizontal-flex gap-xxs tooltip-colour" >
                <span className="span">{props.message}</span>
            </div>
        </div>
    )
}