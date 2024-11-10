import { TopBar } from "@components/topbar";
import { useNavigate } from "react-router-dom";
import { SessionManager } from 'react-together';
import './teacherPage.scss';

export default function TeacherPage() {
    const navigate = useNavigate();
    const createWhiteboard = () => {
        navigate('/whiteboard');
    }
    return (
        <div>
            <TopBar title={"Teacher"} />
            <h1>Teacher</h1>
            <button className="createWhiteboard" onClick={createWhiteboard}>Create Whiteboard</button>
        </div>
    );
}
