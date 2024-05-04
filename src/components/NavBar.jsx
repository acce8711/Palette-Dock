import logo from "../assets/logo.svg"

export default function NavBar(props)
{

    return (
        <div className="empty-top">
        <nav className="max-width"> 
        <button onClick={() => props.changeNavItem(1)} className="logo-container">
            <img src={logo} alt="view palettes" className="nav-logo"/>
        </button> 
            <ul className="nav-categories">
                <li className="nav-item" style={{backgroundColor: props.currNavItem==0 ? "#4690FF" : "#FFFFFF"}}>
                    <button onClick={() => props.changeNavItem(0)}>
                        <span style={{color: props.currNavItem==0 ? "#FFFFFF" : "#4690FF"}}>add</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.25 8.75H17.5V11.25H11.25V17.5H8.75V11.25H2.5V8.75H8.75V2.5H11.25V8.75Z" fill={props.currNavItem==0 ? "#FFFFFF" : "#4690FF"}/>
                        </svg>
                    </button>
                </li>

                <li className="nav-item" style={{backgroundColor: props.currNavItem==1 ? "#4690FF" : "#FFFFFF"}}>
                    <button onClick={() => props.changeNavItem(1)}>
                        <span style={{color: props.currNavItem==1 ? "#FFFFFF" : "#4690FF"}}>view all</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.6666 1.66666H3.33329C2.41282 1.66666 1.66663 2.41285 1.66663 3.33332V16.6667C1.66663 17.5871 2.41282 18.3333 3.33329 18.3333H16.6666C17.5871 18.3333 18.3333 17.5871 18.3333 16.6667V3.33332C18.3333 2.41285 17.5871 1.66666 16.6666 1.66666ZM3.33329 16.6667V10.8333H9.16663V16.6667H3.33329ZM10.8333 16.6667H16.6666V10.8333H10.8333V16.6667ZM10.8333 9.16666H16.6666V3.33332H10.8333V9.16666ZM9.16663 3.33332H3.33329V9.16666H9.16663V3.33332Z" fill={props.currNavItem==1 ? "#FFFFFF" : "#4690FF"}/>
                        </svg>
                    </button>
                </li>

                <li className="nav-item" style={{backgroundColor: props.currNavItem==2 ? "#4690FF" : "#FFFFFF"}}>
                    <button onClick={() => props.changeNavItem(2)}>
                        <span style={{color: props.currNavItem==2 ? "#FFFFFF" : "#4690FF"}}>randomize</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.91943 15H9.00006V22.8508L20.0807 9.00001H15.0001V1.14923L3.91943 15ZM11.0001 13H8.08068L13.0001 6.85079V11H15.9194L11.0001 17.1492V13Z" fill={props.currNavItem==2 ? "#FFFFFF" : "#4690FF"}/>
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
        </div>
    )
}