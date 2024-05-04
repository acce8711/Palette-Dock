import { useState, useEffect } from "react"
import { nanoid } from "nanoid"

import ColourBox from "./ColourBox"
import LikeButton from "./LikeButton"

export default function RandomPalette(props) {
    const [palettes, setPalettes] = useState([])
    const [randomIndex, setRandomIndex] = useState(0)

    useEffect(() => {
        const fetchData = async() => {
            const data = await props.getAllPalettes()
            setPalettes(data)
        }
    
        fetchData()
    }, [])

    useEffect(() => {
        randomize()
    }, [palettes.length])

    const randomize = () => {
        const randIndex = Math.floor(Math.random() * (palettes.length))
        setRandomIndex(randIndex)
    }


    let palette = []
    if(palettes.length > 0)
    {
        palette = palettes[randomIndex].hexValues.map(value => (
            <ColourBox colourCode={value} key={nanoid()}/>
        ))
    } 


    return (
        <div >
            {palettes.length > 0 &&
             <div className="column-flex gap-md m-80">
                <button  onClick={randomize} className="random-btn black-stroke button-hover">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.91943 15H9.00006V22.8508L20.0807 9.00001H15.0001V1.14923L3.91943 15ZM11.0001 13H8.08068L13.0001 6.85079V11H15.9194L11.0001 17.1492V13Z" fill="#FFD15C"/>
                        </svg>
                    randomize
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.91943 15H9.00006V22.8508L20.0807 9.00001H15.0001V1.14923L3.91943 15ZM11.0001 13H8.08068L13.0001 6.85079V11H15.9194L11.0001 17.1492V13Z" fill="#FFD15C"/>
                        </svg>
                </button>
            
                <h2>{palettes[randomIndex].name}.</h2>
                
                <div className="spread-horizontal-flex gap-md">
                    {palette}
                </div>

                <LikeButton size={"32"} numVotes={palettes[randomIndex].votes} id={palettes[randomIndex].id}/>
             </div>
            }

        </div>

    )
}