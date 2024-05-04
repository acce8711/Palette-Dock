
import NavBar from "./NavBar"
import AddPalette from "./AddPalette"
import AllPalettes from "./AllPalettes"
import RandomPalette from "./RandomPalette"
import { useState } from "react"

export default function Home()
{
    const [navItem, setNavItem] = useState(0);
    const [loading, setLoading] = useState(false);

    const updateLoad = (value) => {
        setLoading(value)
    }

    const changeNavItem = (navID) => {
        setNavItem(navID);
    }

    const getPalettes = async() => {
        updateLoad(true)
        try {
            const response = await fetch("https://firestore.googleapis.com/v1/projects/palette-b1613/databases/(default)/documents/palettes/")
            const data = await response.json()
            const cleanData =  await data.documents.map(value => {
                let hexArr = value.fields.hexValues.arrayValue.values;
                let filteredHexArr = hexArr.map(value => value.stringValue);
                let obj = {
                id: value.fields.id.stringValue, 
                name: value.fields.name.stringValue, 
                hexValues:filteredHexArr,
                votes: parseInt(value.fields.votes.integerValue),
                date: value.createTime
                }
                return obj
        })
            return cleanData;
            
        } catch (err) {
            alert(err.message)
            
        } finally {
        updateLoad(false)

        }
    }

    return (
        <div className="home">
            <div className="empty-top"></div>
            <NavBar changeNavItem={changeNavItem} currNavItem={navItem}/>

            { //add
            navItem == 0&& 
                <AddPalette updateLoad = {updateLoad} viewPalettes={() => changeNavItem(1)}/>
            }

            { //view all
            navItem == 1&& 
                <AllPalettes getAllPalettes={getPalettes} updateLoad = {updateLoad}/>
            }

            { //randomize
            navItem == 2 && 
                <RandomPalette getAllPalettes={getPalettes} updateLoad = {updateLoad}/>
            }

            { //loading 
            loading &&
                <div className="load-screen horizontal-flex">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            }

        </div>
    )
}