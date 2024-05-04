import { useEffect, useState } from "react";

export default function LikeButton(props) {

    const [toggleValue, setToggleValue] = useState(-1)

    const [numVotes, setNumVotes] = useState(props.numVotes)

    //ensuring that if there is a change in props.numVotes, state is updated
    useEffect(() => {
        setNumVotes(props.numVotes)
    }, [props.numVotes])

    
    useEffect(()=>{
        const value = JSON.parse(localStorage.getItem(`${props.id}`))
        setToggleValue(value)
    }, [props.numVotes])

    const updateVotes = () => {
        const toggle = updateVoteLocalStorage()

        let votes = numVotes
        if(votes > 0 && toggle == 0)
            votes -= 1;
        if(toggle== 1)
            votes += 1;

        updateVoteDatabase(votes)  
    } 

    const updateVoteDatabase = async(votes) => {
        try {
            //running query to find the document with the wanted id
            const queryResponse = await fetch(`https://firestore.googleapis.com/v1/projects/palette-b1613/databases/(default)/documents:runQuery`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({"structuredQuery": {
                    "from": [{
                        "collectionId": "palettes",
                        
                    }],
            
                    "where": {
                        "fieldFilter": {
                            "field": {
                                "fieldPath": "id"
                            },
                            "op": "EQUAL",
                            "value": {
                                "stringValue": `${props.id}`,
                            }
                        }
                    }
                }}
        )})
            //extracting document id
            const queryData = await queryResponse.json();
            const queryArray = queryData[0].document.name.split("/");
            const documentID = queryArray[queryArray.length-1];
            //updating votes
            const response = await fetch(`https://firestore.googleapis.com/v1/projects/palette-b1613/databases/(default)/documents/palettes/${documentID}?currentDocument.exists=true&updateMask.fieldPaths=votes&alt=json`, {
                method: "PATCH",
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({fields: {votes: {
                    integerValue: votes
                }}})
            })
                const data = await response.json();
                setNumVotes(data.fields.votes.integerValue)
        } catch(err) {
            alert(err.message)
        }
    }

    const updateVoteLocalStorage = () => {
        
        const localStorageValue = JSON.parse(localStorage.getItem(`${props.id}`))
        
        const value = (localStorageValue==0 || localStorageValue==null) ? 1 : 0;
        localStorage.setItem(`${props.id}`, value)
        setToggleValue(value)
        return value
         
    } 


    return (
        <button className="button-hover" onClick={updateVotes}>
            <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 38 38" fill="none">
                <path className="path-hover" fill-rule="evenodd" clip-rule="evenodd" d="M34.8334 18.9986C34.8334 16.3347 33.0436 14.2486 30.0834 14.2486H25.2178L25.2618 14.1287C25.3058 14.0097 25.4299 13.6828 25.5503 13.3654C25.6569 13.0844 25.7607 12.8108 25.8038 12.6952C26.1048 11.8871 26.3245 11.2361 26.5023 10.5913C26.7709 9.61676 26.9167 8.73876 26.9167 7.91525C26.9167 5.58458 25.4789 4.13697 23.3515 3.51752C22.392 3.23813 21.5568 3.16511 20.5834 3.16525H19.8242L19.3488 3.75724C18.8119 4.42595 17.7572 5.63113 16.5413 7.02058L16.5412 7.02067L16.5412 7.02069C14.298 9.58397 11.506 12.7744 10.4031 14.3806C10.117 14.2956 9.81385 14.25 9.50008 14.25H6.33341C4.58451 14.25 3.16675 15.6678 3.16675 17.4167V31.6667C3.16675 33.4156 4.58451 34.8333 6.33341 34.8333H9.50008C10.588 34.8333 11.5478 34.2847 12.1179 33.449C12.5982 33.7597 13.1342 34.019 13.7167 34.2274C15.0504 34.7045 16.3731 34.8511 17.4712 34.831L28.5001 34.8319C32.8624 34.8319 34.8334 28.4092 34.8334 18.9986ZM14.7835 31.2458C13.3824 30.7445 12.6667 29.9271 12.6667 28.4986V17.4167V17.4153C12.6667 17.0349 12.7371 16.6982 12.8911 16.3386C13.1678 15.6926 15.6781 12.8286 18.0575 10.114C19.2855 8.71298 20.4786 7.35178 21.3117 6.35588C21.7098 6.38574 22.085 6.44692 22.4662 6.55792C23.3735 6.82211 23.7501 7.20121 23.7501 7.91525C23.7501 8.41651 23.6486 9.02725 23.4495 9.74971C23.3007 10.2896 23.1079 10.8608 22.8364 11.5896C22.7979 11.693 22.7018 11.9462 22.5996 12.2155L22.5995 12.2159C22.4749 12.5443 22.3412 12.8966 22.2918 13.0303C22.0859 13.587 21.9502 13.9969 21.8575 14.3694C21.463 15.9528 21.8587 17.4153 23.7501 17.4153H30.0834C31.1779 17.4153 31.6667 17.9851 31.6667 18.9986C31.6667 26.5839 30.1074 31.6653 28.5001 31.6653H17.4167L17.3583 31.6662C16.6653 31.6786 15.6919 31.5708 14.7835 31.2458ZM6.33341 31.6667V17.4167H9.50008V31.6667H6.33341Z" fill={toggleValue==1 ? "#4690FF": "#616161"}/>
            </svg>
            <span className="blue-hover" style={{color:toggleValue==1?"#4690FF":"#000"}}>{numVotes}</span>
        </button>
    )
}