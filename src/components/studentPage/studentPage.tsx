import React, { useState } from 'react';
import { TopBar } from '@components/topbar';
import './studentPage.scss';

export default function StudentPage() {
    const [link, setLink] = useState('');

    const handleChange = (event) => {
        setLink(event.target.value);
    }
    const joinClass = () => {
        console.log("Joining class with link: " + link);
    }

    return (
        <div>
            <div>
                <TopBar
                title={"Student"}/>
            </div >
            <div className='column'>
                <input
                    id="Link Input"
                    value={link}
                    onChange={handleChange}
                    placeholder='INSERT CLASS LINK HERE'
                    type='text'
                    className='linkInput'
                />
                <button className='joinButton' onClick={joinClass}>Join Class</button>
            </div>
        </div >
    );
}
