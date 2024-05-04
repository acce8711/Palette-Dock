import {useState, useEffect} from "react"
import { nanoid } from "nanoid"

import PaletteItem from "./PaletteItem"
import ChevronDown from "../assets/chevron-down.svg";
import { parse } from "@fortawesome/fontawesome-svg-core";
import { palette } from "@mui/system";
import ColourPicker from "./ColourPicker";


export default function AllPalette(props) {
    const [palettes, setPalettes] = useState([])
    const [filterState, setFilterState] = useState(0);
    const [filterColour, setFilterColour] = useState("");
    const [filterColourPending, setFilterColourPending] = useState("");
    const [filterByColour, setFilterbyColour] = useState(false);
    const [openPicker, setOpenPicker] = useState(false)
    const [scrolling, setScrolling] = useState(false);
    const [scrollingUp, setScrollingUp] = useState(false);

    const testValues = [
        {
            name: "bob",
            hexValues: ["#442222", "#9a3434"]
        },
        {
            name: "bob",
            hexValues: ['#160909', '#691515']
        },
        {
            name: "bob",
            hexValues: ['#dc9d9d', '#ff8181', '#000000']
        }
    ]

    const fetchData = async() => {
        const data = await props.getAllPalettes()
        updatedOrder([...data]);
    }

    const updatedOrder = (arrayToSort) => {
        if(filterByColour)
        {
           arrayToSort = filterColours(arrayToSort, filterColour)
        }
        if(filterState == 0)
        {
            arrayToSort.sort((a,b) => new Date(b.date) - new Date(a.date))
        }
        else if(filterState == 1)
        {
            arrayToSort.sort((a,b) => b.votes - a.votes)
        }
        
        setPalettes(arrayToSort)
    }

    const scrollUp = () =>
    {
        window.scrollTo(0, 0);
        setScrollingUp(true)
    }

    const displayScroll = () => {
        if (window.scrollY == 0)
            setScrolling(false) && setScrollingUp(false)
        else if (window.scrollY > 0 && !scrollingUp)
            setScrolling(true)

    }
    
    useEffect(() => {
        fetchData()
    }, [filterState, filterColour])


    //tracking scroll
    useEffect(() => {
        window.addEventListener("scroll", displayScroll)
    })

    const updateFilter = async (e) => {
        setFilterState(e.target.value)
    }


    const palettesToRender = palettes.map((item) => {
        return(
            <PaletteItem id={item.id} name={item.name} votes={item.votes} palette={item.hexValues} key={item.id}/>
        )
    })

    const hexToRGB = (hexValue) => {
       let val1 = hexValue[0];
       let val2 = hexValue[1];

       switch (hexValue[0])
       {
            case 'a':
                val1 = 10;
                break;
            case 'b':
                val1 = 11;
                break;
            case 'c':
                val1 = 12;
                break;
            case 'd':
                val1 = 13;
                break;
            case 'e':
                val1 = 14;
                break;
            case 'f':
                val1 = 15;
                break;
    }

    switch (hexValue[1])
    {
         case 'a':
             val2 = 10;
             break;
         case 'b':
             val2 = 11;
             break;
         case 'c':
             val2 = 12;
             break;
         case 'd':
             val2 = 13;
             break;
         case 'e':
             val2 = 14;
             break;
         case 'f':
             val2 = 15;
             break;
 }
        let rgbValue = (parseInt(val1) * 16) + parseInt(val2);
        return rgbValue;
    }

    const compDistance = (value1, value2) => {
        let distance = Math.sqrt(
            (value1[0] - value2[0]) ** 2 +
            (value1[1] - value2[1]) ** 2 +
            (value1[2] - value2[2]) ** 2 
        )
        console.log(distance)

        return (distance < 40) 
    }

    const filterColours = (palettesToFilter, colourCode) => {
        const filteredPalettes = []
        let r = hexToRGB(colourCode.slice(1,3));
        let g = hexToRGB(colourCode.slice(3,5));
        let b = hexToRGB(colourCode.slice(5,7));
        palettesToFilter.forEach((palette) => {
            for (let i=0; i<palette.hexValues.length; i++)
            {
                let match = false;
                let paletteR = hexToRGB(palette.hexValues[i].slice(1,3));
                let paletteG = hexToRGB(palette.hexValues[i].slice(3,5));
                let paletteB = hexToRGB(palette.hexValues[i].slice(5,7));
                
                if(compDistance([r,g,b], [paletteR, paletteG, paletteB]))
                {
                    filteredPalettes.push(palette)
                    match = true;
                }
                if(match)
                break;
            }
        })
        return filteredPalettes
    }

    const changeColour = (value) => {
        setFilterColourPending(value)
    }

    const closePicker = () => {
        setOpenPicker(false)
        setFilterColour(filterColourPending)
        setFilterbyColour(true)
    }

    const resetFilter = () => {
        setFilterState(0)
        setFilterbyColour(false)
        setFilterColour("")
    }

    return (
        <div className="column-flex max-width gap-sm m-50 max-height">
            <div className="spread-horizontal-flex-2 ">
                <h2>palettes.</h2>
                <div className="horizontal-flex gap-sm">
                    <div className="horizontal-flex gap-xs">
                    <h3>filter by colour:</h3>
                    <button onClick={() => setOpenPicker(true)} className="black-stroke sm-box" style={{backgroundColor: filterColour && filterColour}}></button>
                    </div>
                    <select name="filter" id="filter" onChange={updateFilter} value={filterState}>
                        <option value={0}>newest</option>
                        <option value={1}>most popular</option>
                    </select>
                    <button disabled={!filterByColour && filterState == 0} className="delete clear-btn" onClick={() => resetFilter()}>Reset</button>
                </div>
            </div>
            {openPicker &&
            <ColourPicker 
            colourChangeHandle = {changeColour}
            colourCode = {filterColourPending}
            hidePicker={() => closePicker()}/>
            }
        {(palettesToRender.length > 0) ?
            <div className="palettes-view">
                {palettesToRender}
            </div>
            :  
            <div className=" vertical-flex" >
                <h3>no palettes found.</h3>
            </div>


        }
            {
                scrolling &&
                <button className="top-button" onClick={scrollUp}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"/>
                </svg>
                back to top
                </button>
            }
            
        </div>
    )
    }