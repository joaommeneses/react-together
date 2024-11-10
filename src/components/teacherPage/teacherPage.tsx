import { TopBar } from "@components/topbar";
import { SessionManager } from 'react-together';

export default function TeacherPage() {
    return (
        <div>
            <TopBar title={"Teacher"} />
            <h1>Teacher</h1>
            <SessionManager />
        </div>
    );
}
