import OpenAI from "../../node_modules/openai";
import AddColour from "./AddColour"
import PendingColour from "./PendingColour";
import ColourPicker from "./ColourPicker";
import ShareModal from "./ShareModal";
import ColourBox from "./ColourBox";
import {useEffect, useState} from "react"
import { nanoid } from "nanoid";
import { RegExpMatcher,
	TextCensor,
	englishDataset,
	englishRecommendedTransformers } from "obscenity";
import { DndContext, MouseSensor, TouchSensor, KeyboardSensor, closestCorners, useSensor, useSensors, KeyboardCode} from "@dnd-kit/core";
import { 
    SortableContext,
    arrayMove, 
    horizontalListSortingStrategy, 
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import {
    restrictToVerticalAxis,
    restrictToHorizontalAxis,
    restrictToWindowEdges
    } from '@dnd-kit/modifiers';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI(
    {
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
    }
)


export default function AddPalette(props) {
    const [colours, setColours] = useState([
        {id: 1, content:"empty"},
        {id: 2, content:"empty"},
        {id: 3, content:"empty"},
        {id: 4, content:"empty"},
        {id: 5, content:"empty"}
    ])
    const [pickerValues, setPickerValues] = useState(
        {
            toggle: false,
            id: -1,
        }
    )
    const [paletteName, setPaletteName] = useState({
        name: "",
        valid: true,
        errorMessage: ""
    });

    
    const [generatingText, setGenerating] = useState(false)
    const [chatError, setChatError] = useState(false);
    const [apiError, setApiError] = useState(false);
        
    const handleSubmit = async () => {
        setApiError(false);

        //setChatQuestion("")
        //setQuestionToDisplay(message);
        setGenerating(true)
        //let contentToAdd = {question: message,content: ""}
        const filtered = colours.filter(value => value.content!= "empty");
        const filteredString = filtered.map(value => value.content).join(", ")
        console.log(filteredString)
        console.log(filtered.length < 1? "generate a 2 word unique random colour palette name" : `generate one 2 word name to describe these colours: ${filteredString}`)
        const content = filtered.length < 1? "generate a 2 word unique random colour palette name" : `generate one 2 word name to describe these colours: ${filteredString}`;
        await openai.chat.completions.create(
            {
                model: "gpt-3.5-turbo",
                messages: [
                {
                    role: "user",
                    content: content
                }],
            }
            ).then((result) => {
           // contentToAdd.content = result.choices[0].message.content;
           // props.setChat(prevValue => ([...prevValue, contentToAdd]))
            let paletteNameTemp = result.choices[0].message.content;
            paletteNameTemp = paletteNameTemp.replace(/"/g, "")
            paletteNameTemp = paletteNameTemp.toLowerCase()

            setPaletteName(prev => ({...prev, name: paletteNameTemp}))
            setGenerating(false)
            }).catch(error => setApiError(true)) 
        

    }
    

    //changing colour based on colour picker
    const changeColour = (value, id) => {
        setColours(prevValue => {
            return(prevValue.map((item, index) => index == id ? {...item, content:value}  : {...item}))
        })
    }

    const [shareModal, setShareModal] = useState({
        show: false,
        palette: [],
        paletteName: ""
    })

    //closing colour picker
    const toggleColourPicker = (openPicker, newID = -1) => {
        console.log("open pick")
        setPickerValues({toggle: openPicker, id: newID});
    }

    //changing palette name input
    const changePaletteName = (e) => {
        const {value} = e.target;
        setPaletteName(prev => ({...prev, name: value.toLowerCase()}));
    }

    //hiding share model
    const hideShareModal = () => {
        setShareModal(({show: false, palette: [], paletteName: ""}))
    }

    //uploading palette to json-server
    const uploadPalette = async(e) => {
        e.preventDefault();
        props.updateLoad(true);
        const inputCheckMessage = verifyInput(paletteName.name);
        if(inputCheckMessage.length > 0) 
        {
            setPaletteName(prev => ({...prev, valid: false, errorMessage: inputCheckMessage}))
            props.updateLoad(false);
            return;
        }
        else
            setPaletteName(prev => ({...prev, valid: true, errorMessage: ""}))

        //uploading the palette to json-server
        let uid = nanoid();
        const coloursToUpload = colours.filter(value => value.content!= "empty")
        const hexCodesUpload = coloursToUpload.map(value => value.content);
        
            try 
            {
                const response = await fetch("https://firestore.googleapis.com/v1/projects/palette-b1613/databases/(default)/documents/palettes/", {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    },
                    body: JSON.stringify({
                        fields: {
                        id: {
                            stringValue: uid
                        },
                        name: {
                            stringValue:paletteName.name.toLowerCase()
                        },
                        hexValues: {
                            arrayValue: {
                                values: hexCodesUpload.map(value => ({stringValue: value}))
                            }
                        },
                        votes: {
                            integerValue: "0"
                        }
                    }})
                })

                setShareModal({show: true, palette: [...hexCodesUpload], paletteName: paletteName.name})
                
                //clearing values
                setPaletteName({name:"", valid: true, errorMessage: ""});
                setColours(prev => prev.map((item)=>({...item, content:"empty"})))
            } catch (err) {
                alert(err.message)
            } 
            props.updateLoad(false);
    }

    //checking for obscene language and input length
    const verifyInput = (inputToCheck) => {
        let message = "";

        if (inputToCheck.length < 2)
            message = "palette name need to be at least 2 characters long"

        const matcher = new RegExpMatcher({
            ...englishDataset.build(),
            ...englishRecommendedTransformers,
        })

        if(matcher.hasMatch(inputToCheck))
        {
            message = (message.length > 0) ? message +" and have respectful language" : "please keep the language respectful";
        }

        return message;
    }

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            distance: 10,
        }
    })

    const keyboardSensor = useSensor(KeyboardSensor, {
        coordinateGetter:sortableKeyboardCoordinates,
        KeyboardCodes: {
            start: KeyboardCode['P'],
            cancel: KeyboardEvent['X'],
            end: KeyboardEvent['P'],
        }
    })

    const sensors = useSensors(
        mouseSensor,
        touchSensor,
        keyboardSensor
    );



    const palettePos = (id) => {
        return( colours.findIndex((palette) => palette.id === id))
    }

    const handleDragEnd = (e) => {
        const {active, over} = e

        if(active.id === over.id) return;

        setColours(colour => {
            const originalPos = palettePos(active.id);
            const endPos = palettePos(over.id);

            return arrayMove(colour, originalPos, endPos)
        })
    }

    //mapping the colours to jsx elements
    const palette = colours.map((value, index) => {
        return (
        colours[index].content == "empty" ?
        <AddColour id={value.id} key={value.id} colourCode={value.content} togglePicker={()=>toggleColourPicker(true, index)} />
        :
        <PendingColour id={value.id} key={value.id} colourCode={value.content} small={false} togglePicker={()=> toggleColourPicker(true, index)} removeColour = {() => changeColour("empty", index)} />
        )
    })


    return (
        <div className="column-flex max-width gap-md m-50">
            <h2> have a palette in mind <br/> share it : )</h2>
            <div className="spread-horizontal-flex black-stroke add-palette gap-md"> 
                <DndContext modifiers={[restrictToHorizontalAxis]} collisionDetection={closestCorners}  onDragEnd={handleDragEnd} sensors={sensors}>    
                    <SortableContext items={colours} strategy={horizontalListSortingStrategy}>
                        {palette}
                    </SortableContext>
                </DndContext>
            </div>
            <div className="gap-xs">
                <button onClick={handleSubmit} className="button-hover auto-generate">
                    auto generate
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 17 17" fill="none">
                        <path className={generatingText?"load-icon":""} fill-rule="evenodd" clip-rule="evenodd" d="M7.08317 4.95829H4.38659C5.35026 3.59737 6.80435 2.83329 8.49984 2.83329C11.6295 2.83329 14.1665 5.37035 14.1665 8.49996H15.5832C15.5832 4.58794 12.4119 1.41663 8.49984 1.41663C6.51351 1.41663 4.76345 2.25424 3.5415 3.73312V1.41663H2.12484V6.37496H7.08317V4.95829ZM9.9165 12.0416H12.6131C11.6494 13.4025 10.1953 14.1666 8.49984 14.1666C5.37022 14.1666 2.83317 11.6296 2.83317 8.49996H1.4165C1.4165 12.412 4.58782 15.5833 8.49984 15.5833C10.4862 15.5833 12.2362 14.7457 13.4582 13.2668V15.5833H14.8748V10.625H9.9165V12.0416Z" fill="#4690FF"/>
                    </svg>
                </button>
                <form onSubmit={uploadPalette} className="horizontal-flex gap-xs">
                    <input
                    type="text"
                    value={paletteName.name}
                    onChange={changePaletteName}
                    name="paletteName"
                    className={`share-input black-stroke`}
                    />
                    <div className="tooltip-btn">
                    <button disabled={colours.filter(x => x.content == "empty").length > 3} onClick={uploadPalette} className={`share hover-btn black-stroke` }>share</button>

                        <div 
                        className="tooltip column-flex hidden" 
                        style={{display: colours.filter(x => x.content == "empty").length > 3? "flex" : "none"}}
                        >
                            <div className="tooltip-locator"></div>
                            <div className="tooltip-content horizontal-flex gap-xxs " >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
                                </svg>
                                <span className="span">Select at least two palettes</span>
                            </div>
                        </div>
                        
                    </div>

                    
                </form>
                {!paletteName.valid &&
                <span className="error-msg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 25 25" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 25C5.59644 25 0 19.4036 0 12.5C0 5.59644 5.59644 0 12.5 0C19.4036 0 25 5.59644 25 12.5C25 19.4036 19.4036 25 12.5 25ZM12.5 22.7273C18.1484 22.7273 22.7273 18.1484 22.7273 12.5C22.7273 6.85163 18.1484 2.27273 12.5 2.27273C6.85163 2.27273 2.27273 6.85163 2.27273 12.5C2.27273 18.1484 6.85163 22.7273 12.5 22.7273ZM13.6405 14.7708H14.7761V17.0436H10.2306V14.7708H11.367V12.4981H10.2306V10.2254H13.6405V14.7708ZM12.5004 9.08903C11.8726 9.08903 11.3636 8.58026 11.3636 7.95267C11.3636 7.32507 11.8726 6.8163 12.5004 6.8163C13.1282 6.8163 13.6371 7.32507 13.6371 7.95267C13.6371 8.58026 13.1282 9.08903 12.5004 9.08903Z" fill="#FF6262"/>
                    </svg>
                    <p>{paletteName.errorMessage}</p>
                </span>}
            </div>

            {pickerValues.toggle && 
            <ColourPicker colourChangeHandle = {changeColour} colourCode = {colours[pickerValues.id].content} id = {pickerValues.id} hidePicker={() => toggleColourPicker(false)}/>
            }

            {shareModal.show &&
            <ShareModal hideModal={hideShareModal} viewPalettes={props.viewPalettes} colourCodes={shareModal.palette} paletteName={shareModal.paletteName}/>}

        </div>
    )
}