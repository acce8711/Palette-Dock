
import { useState } from "react";

export default function ColourBox(props) {

    const [copyText, setCopyText] = useState("copy");

    const copyToClipboard = () => {
        navigator.clipboard.writeText(props.colourCode);
        changeCopyText("copied")
    }

    const changeCopyText = (value) => {
        setCopyText(value)
    }

    return(
        <div className={`column-flex-2 relative   ${props.small ? "w-50 gap-xs" : "w-80 gap-sm"}`} onClick={copyToClipboard} onMouseLeave={() =>changeCopyText("copy")}>
            <div className={`black-stroke ${props.small ? "colour-box-sm" : "colour-box"}`} style={{backgroundColor: props.colourCode}} ><div className="copy">
            <p style={{color: copyText=="copy"?"black": "#4690FF"}}>{copyText}</p>
            <svg xmlns="http://www.w3.org/2000/svg" width={props.small ?"8":"12"} height={props.small ?"8":"12"} viewBox="0 0 89 89" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M62.4536 61.9723V79.5554C62.4536 84.6206 58.7272 88.347 53.662 88.347H9.70417C4.63897 88.347 0.912598 84.6206 0.912598 79.5554V35.5976C0.912598 30.5324 4.63897 26.806 9.70417 26.806H27.2873V9.22285C27.2873 4.15765 31.0137 0.431274 36.0789 0.431274H80.0368C85.1019 0.431274 88.8283 4.15765 88.8283 9.22285V53.1807C88.8283 58.2459 85.1019 61.9723 80.0368 61.9723H62.4536ZM53.662 61.9723H36.0789C31.0137 61.9723 27.2873 58.2459 27.2873 53.1807V35.5976H9.70417V79.5554H53.662V61.9723ZM36.0789 9.22285V53.1807H80.0368V9.22285H36.0789Z" fill={copyText=="copy"?"black": "#4690FF"}/>
                </svg>
            </div></div>
            <h4>{props.colourCode.toUpperCase()}</h4>
           
        </div>
    )
}