import { useAuth } from "@/auth/auth-context"
import { getByUser } from "@/dao/mentorshipSessionDAO";
import { useState } from "react";

export default function AreaPersonale () {
    const {userId} = useAuth();
    const fetchMentorshipSession = async () =>  {
        const MentorshipSession = await getByUser(userId);
        return MentorshipSession;
    };
    const {sessions, setSessions} = useState([]);
    setSessions(fetchMentorshipSession());
    return (
        <>
            <p>Area personale per {userId}</p>
        </>
    );
}