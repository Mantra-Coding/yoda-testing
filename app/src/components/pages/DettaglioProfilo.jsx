import { useAuth } from "@/auth/auth-context"
import { getUserByID } from "@/dao/userDAO";
import { DettagliUtente } from "./DettaglioUtente";

export default function DettaglioProfilo(){

    const {userId} = useAuth();
    const userData = getUserByID(userId);

    console.log(userData);
    return <DettagliUtente user={userData} />

    
}



