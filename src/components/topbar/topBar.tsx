import React from 'react';
import './topBar.scss';
import { userLogo } from '@assets';
import Popup from './popUp.tsx';

export default function TopBar({title}) {
    const [popupVisible, setPopupVisible] = React.useState(false);
    const header_text = title.toString();
    const onClick = () => {
        setPopupVisible(!popupVisible);
    }
    return (
        <div className='topBar'>
            <h1 className='title'>{header_text}</h1>
            <button className='logoButton' onClick={onClick}>
                <img src={userLogo} alt='userLogo' className='userLogo' />
            </button>
            {popupVisible && <Popup />}
        </div>
    );
}
