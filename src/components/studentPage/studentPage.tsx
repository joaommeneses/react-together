import React, { useState } from 'react';
import { TopBar } from '@components/topbar';
import './studentPage.scss';
import { useNavigate } from 'react-router-dom';

export default function StudentPage() {
    const [link, setLink] = useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
        setLink(event.target.value);
    }
    const joinClass = () => {
        const url = new URL(link);
        const path = url.pathname.split('/').pop();
        const newLink = link.substring(link.indexOf(path));
        window.location.href = newLink;
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
