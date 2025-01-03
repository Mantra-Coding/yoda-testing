import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import { app } from "@/Firebase/firebase"; // Importa la configurazione Firebase

// Ottieni Firestore
const db = getFirestore(app);

// Funzione per popolare il database
async function populateDatabase() {
    try {
        
                // Assicurati che checkDoc sia definito prima dell'uso
                const checkDoc = doc(db, "meta", "populated");

                // Controllo se il database è già popolato
                const checkSnapshot = await getDoc(checkDoc);
        
                if (checkSnapshot.exists()) {
                    console.log("Il database è già popolato. Salto il popolamento.");
                    return;
                }
        
                console.log("Popolamento del database in corso...");

        // Mentori
        const mentors = [
            {
                id: "mentor1",
                data: {
                    availability: 10,
                    cognome: "Rossi",
                    competenze: "Machine Learning",
                    createdAt: "2024-12-23T22:07:19.275Z",
                    cv: null,
                    dataNascita: "1985-07-10",
                    email: "rossi.ml@gmail.com",
                    field: null,
                    meetingMode: "online",
                    nome: "Mario",
                    occupazione: "Machine Learning Engineer",
                    portfolioProjects: [],
                    sesso: "maschio",
                    titoloDiStudio: "laurea",
                    userType: "mentor",
                },
            },
            {
                id: "mentor2",
                data: {
                    availability: 8,
                    cognome: "Bianchi",
                    competenze: "Data Science",
                    createdAt: "2024-12-22T11:45:10.000Z",
                    cv: "cv_bianchi.pdf",
                    dataNascita: "1990-03-12",
                    email: "bianchi.ds@gmail.com",
                    field: null,
                    meetingMode: "in-person",
                    nome: "Luigi",
                    occupazione: "Data Scientist",
                    portfolioProjects: ["project1", "project2"],
                    sesso: "maschio",
                    titoloDiStudio: "dottorato",
                    userType: "mentor",
                },
            },
            {
                id: "mentor3",
                data: {
                    availability: 15,
                    cognome: "Verdi",
                    competenze: "Artificial Intelligence",
                    createdAt: "2024-12-10T09:30:20.000Z",
                    cv: "cv_verdi.pdf",
                    dataNascita: "1980-01-25",
                    email: "verdi.ai@gmail.com",
                    field: null,
                    meetingMode: "hybrid",
                    nome: "Giovanni",
                    occupazione: "AI Engineer",
                    portfolioProjects: ["ai_project1"],
                    sesso: "maschio",
                    titoloDiStudio: "laurea magistrale",
                    userType: "mentor",
                },
            },
            {
                id: "mentor4",
                data: {
                    availability: 12,
                    cognome: "Gialli",
                    competenze: "Cloud Computing",
                    createdAt: "2024-11-05T14:22:55.000Z",
                    cv: "cv_gialli.pdf",
                    dataNascita: "1982-08-19",
                    email: "gialli.cc@gmail.com",
                    field: null,
                    meetingMode: "online",
                    nome: "Alessandro",
                    occupazione: "Cloud Architect",
                    portfolioProjects: [],
                    sesso: "maschio",
                    titoloDiStudio: "laurea",
                    userType: "mentor",
                },
            },
            {
                id: "mentor5",
                data: {
                    availability: 7,
                    cognome: "Neri",
                    competenze: "Blockchain",
                    createdAt: "2024-12-01T10:15:30.000Z",
                    cv: "cv_neri.pdf",
                    dataNascita: "1995-06-05",
                    email: "neri.bc@gmail.com",
                    field: null,
                    meetingMode: "online",
                    nome: "Francesco",
                    occupazione: "Blockchain Developer",
                    portfolioProjects: ["blockchain_project1", "blockchain_project2"],
                    sesso: "maschio",
                    titoloDiStudio: "laurea",
                    userType: "mentor",
                },
            }
        ];

        // Mentee
        const mentees = [
            {
                id: "mentee1",
                data: {
                    cognome: "Bruni",
                    competenze: "JavaScript",
                    createdAt: "2024-12-23T19:15:04.053Z",
                    cv: "cv_bruni.pdf",
                    dataNascita: "1998-08-14",
                    email: "bruni.js@gmail.com",
                    field: "web-development",
                    nome: "Giorgio",
                    occupazione: null,
                    portfolioProjects: [],
                    sesso: "maschio",
                    titoloDiStudio: "laurea triennale",
                    updatedAt: "2024-12-30T11:29:40.433Z",
                    userType: "mentee",
                },
            },
            {
                id: "mentee2",
                data: {
                    cognome: "Luca",
                    competenze: "Python",
                    createdAt: "2024-11-18T14:45:20.000Z",
                    cv: "cv_luca.pdf",
                    dataNascita: "2000-05-20",
                    email: "luca.py@gmail.com",
                    field: "data-science",
                    nome: "Matteo",
                    occupazione: "Junior Data Analyst",
                    portfolioProjects: ["data_analysis_project1"],
                    sesso: "maschio",
                    titoloDiStudio: "laurea triennale",
                    updatedAt: "2024-12-25T09:20:35.000Z",
                    userType: "mentee",
                },
            },
            {
                id: "mentee3",
                data: {
                    cognome: "Verdi",
                    competenze: "Web Development",
                    createdAt: "2024-10-05T16:00:00.000Z",
                    cv: "cv_verdi.pdf",
                    dataNascita: "1999-03-30",
                    email: "verdi.web@gmail.com",
                    field: "front-end",
                    nome: "Luca",
                    occupazione: null,
                    portfolioProjects: ["website_project1"],
                    sesso: "maschio",
                    titoloDiStudio: "diploma",
                    updatedAt: "2024-12-15T17:45:20.000Z",
                    userType: "mentee",
                },
            },
            {
                id: "mentee4",
                data: {
                    cognome: "Alti",
                    competenze: "Java",
                    createdAt: "2024-09-22T11:30:15.000Z",
                    cv: "cv_alti.pdf",
                    dataNascita: "1997-11-12",
                    email: "alti.java@gmail.com",
                    field: "software-engineering",
                    nome: "Marco",
                    occupazione: null,
                    portfolioProjects: [],
                    sesso: "maschio",
                    titoloDiStudio: "laurea magistrale",
                    updatedAt: "2024-12-05T12:40:10.000Z",
                    userType: "mentee",
                },
            },
            {
                id: "mentee5",
                data: {
                    cognome: "Rossi",
                    competenze: "C#",
                    createdAt: "2024-08-18T14:50:35.000Z",
                    cv: "cv_rossi.pdf",
                    dataNascita: "2001-07-09",
                    email: "rossi.cs@gmail.com",
                    field: "backend-development",
                    nome: "Giovanni",
                    occupazione: "Junior Developer",
                    portfolioProjects: ["backend_project1"],
                    sesso: "maschio",
                    titoloDiStudio: "diploma",
                    updatedAt: "2024-12-10T15:30:45.000Z",
                    userType: "mentee",
                },
            }
        ];

        // Video
        const videos = [
            {
                id: "video1",
                data: {
                    description: "Introduzione al Machine Learning",
                    thumbnail: "http://example.com/thumbnail1.png",
                    title: "Machine Learning Basics",
                    videoUrl: "http://localhost:9199/v0/b/yoda/videos/video1.mp4",
                },
            },
            {
                id: "video2",
                data: {
                    description: "Introduzione alla Data Science",
                    thumbnail: "http://example.com/thumbnail2.png",
                    title: "Data Science Fundamentals",
                    videoUrl: "http://localhost:9199/v0/b/yoda/videos/video2.mp4",
                },
            },
            {
                id: "video3",
                data: {
                    description: "Guida al Cloud Computing",
                    thumbnail: "http://example.com/thumbnail3.png",
                    title: "Cloud Computing Essentials",
                    videoUrl: "http://localhost:9199/v0/b/yoda/videos/video3.mp4",
                },
            },
            {
                id: "video4",
                data: {
                    description: "Blockchain e il Futuro della Tecnologia",
                    thumbnail: "http://example.com/thumbnail4.png",
                    title: "Blockchain Overview",
                    videoUrl: "http://localhost:9199/v0/b/yoda/videos/video4.mp4",
                },
            },
            {
                id: "video5",
                data: {
                    description: "Sviluppare Applicazioni Web Moderne",
                    thumbnail: "http://example.com/thumbnail5.png",
                    title: "Web Development Trends",
                    videoUrl: "http://localhost:9199/v0/b/yoda/videos/video5.mp4",
                },
            },
            {
            id: "video6",
            data: {
                description: "Guida all'intelligenza artificiale per principianti",
                thumbnail: "http://example.com/thumbnail6.png",
                title: "AI for Beginners",
                videoUrl: "http://localhost:9199/v0/b/yoda/videos/video6.mp4",
            },
        },
        {
            id: "video7",
            data: {
                description: "Introduzione alla programmazione in Python",
                thumbnail: "http://example.com/thumbnail7.png",
                title: "Python Programming Basics",
                videoUrl: "http://localhost:9199/v0/b/yoda/videos/video7.mp4",
            },
        },
        {
            id: "video8",
            data: {
                description: "Corso completo su Data Science con Python",
                thumbnail: "http://example.com/thumbnail8.png",
                title: "Data Science with Python",
                videoUrl: "http://localhost:9199/v0/b/yoda/videos/video8.mp4",
            },
        },
        {
            id: "video9",
            data: {
                description: "Come sviluppare applicazioni con React",
                thumbnail: "http://example.com/thumbnail9.png",
                title: "React for Developers",
                videoUrl: "http://localhost:9199/v0/b/yoda/videos/video9.mp4",
            },
        },
        {
            id: "video10",
            data: {
                description: "Fondamenti di Cloud Computing con AWS",
                thumbnail: "http://example.com/thumbnail10.png",
                title: "Cloud Computing Essentials with AWS",
                videoUrl: "http://localhost:9199/v0/b/yoda/videos/video10.mp4",
            },
        }
        ];

        // Autori
        const authors = [
            {
                id: "author1",
                data: {
                    email: "author1@gmail.com",
                    createdAt: new Date(),
                    filePath: "http://localhost:9199/documents/doc1.pdf",
                    icon: "📄",
                    role: "Researcher",
                    title: "AI and Ethics",
                    type: "PDF",
                },
            },
            {
                id: "author2",
                data: {
                    email: "author2@gmail.com",
                    createdAt: new Date(),
                    filePath: "http://localhost:9199/documents/doc2.pdf",
                    icon: "📄",
                    role: "Engineer",
                    title: "Cloud Architecture",
                    type: "PDF",
                },
            },
            {
                id: "author3",
                data: {
                    email: "author3@gmail.com",
                    createdAt: new Date(),
                    filePath: "http://localhost:9199/documents/doc3.pdf",
                    icon: "📄",
                    role: "Scientist",
                    title: "Blockchain for Future",
                    type: "PDF",
                },
            },
            {
                id: "author4",
                data: {
                    email: "author4@gmail.com",
                    createdAt: new Date(),
                    filePath: "http://localhost:9199/documents/doc4.pdf",
                    icon: "📄",
                    role: "Developer",
                    title: "Web Development Practices",
                    type: "PDF",
                },
            },
            {
                id: "author5",
                data: {
                    email: "author5@gmail.com",
                    createdAt: new Date(),
                    filePath: "http://localhost:9199/documents/doc5.pdf",
                    icon: "📄",
                    role: "Technologist",
                    title: "Understanding AI",
                    type: "PDF",
                },
            },
            {
                id: "author6",
                data: {
                    email: "author6@gmail.com",
                    createdAt: new Date(),
                    filePath: "http://localhost:9199/documents/doc6.pdf",
                    icon: "📄",
                    role: "Software Engineer",
                    title: "Building Scalable Web Apps",
                    type: "PDF",
                },
            },
            {
                id: "author7",
                data: {
                    email: "author7@gmail.com",
                    createdAt: new Date(),
                    filePath: "http://localhost:9199/documents/doc7.pdf",
                    icon: "📄",
                    role: "Data Scientist",
                    title: "Predictive Modeling with Python",
                    type: "PDF",
                },
            },
            {
                id: "author8",
                data: {
                    email: "author8@gmail.com",
                    createdAt: new Date(),
                    filePath: "http://localhost:9199/documents/doc8.pdf",
                    icon: "📄",
                    role: "Cloud Architect",
                    title: "Designing Cloud Systems",
                    type: "PDF",
                },
            },
            {
                id: "author9",
                data: {
                    email: "author9@gmail.com",
                    createdAt: new Date(),
                    filePath: "http://localhost:9199/documents/doc9.pdf",
                    icon: "📄",
                    role: "Blockchain Developer",
                    title: "Blockchain Development",
                    type: "PDF",
                },
            },
            {
                id: "author10",
                data: {
                    email: "author10@gmail.com",
                    createdAt: new Date(),
                    filePath: "http://localhost:9199/documents/doc10.pdf",
                    icon: "📄",
                    role: "AI Specialist",
                    title: "Ethics in Artificial Intelligence",
                    type: "PDF",
                },
            }
        ];

        // Meetings
        const meetings = [
            {
                id: "meeting1",
                data: {
                    date: new Date(),
                    description: "Sessione introduttiva",
                    menteeEmail: "mentee1@gmail.com",
                    menteeId: "mentee1",
                    menteeName: "Giorgio",
                    mentorId: "mentor1",
                    time: "14:00",
                    topic: "Introduzione al Machine Learning",
                },
            },
            {
                id: "meeting2",
                data: {
                    date: new Date(),
                    description: "Analisi dei dati",
                    menteeEmail: "mentee2@gmail.com",
                    menteeId: "mentee2",
                    menteeName: "Matteo",
                    mentorId: "mentor2",
                    time: "10:00",
                    topic: "Data Science Overview",
                },
            },
            {
                id: "meeting3",
                data: {
                    date: new Date(),
                    description: "Progetto Web",
                    menteeEmail: "mentee3@gmail.com",
                    menteeId: "mentee3",
                    menteeName: "Luca",
                    mentorId: "mentor3",
                    time: "16:00",
                    topic: "Web Development Trends",
                },
            },
            {
                id: "meeting4",
                data: {
                    date: new Date(),
                    description: "Discussione Blockchain",
                    menteeEmail: "mentee4@gmail.com",
                    menteeId: "mentee4",
                    menteeName: "Marco",
                    mentorId: "mentor4",
                    time: "09:00",
                    topic: "Blockchain Basics",
                },
            },
            {
                id: "meeting5",
                data: {
                    date: new Date(),
                    description: "Sessione Cloud",
                    menteeEmail: "mentee5@gmail.com",
                    menteeId: "mentee5",
                    menteeName: "Giovanni",
                    mentorId: "mentor5",
                    time: "11:00",
                    topic: "Cloud Computing Fundamentals",
                },
            }
        ];

        // Notifiche
        const notifiche = [
            {
                id: "notifica1",
                data: {
                    corpo: "Hai ricevuto una nuova mentorship!",
                    destinatario: "mentor1",
                    mittente: "mentee1",
                    oggetto: "Nuova Mentorship",
                    timeStamp: new Date(),
                },
            },
            {
                id: "notifica2",
                data: {
                    corpo: "Nuovo messaggio da un mentee!",
                    destinatario: "mentor2",
                    mittente: "mentee2",
                    oggetto: "Nuovo messaggio",
                    timeStamp: new Date(),
                },
            },
            {
                id: "notifica3",
                data: {
                    corpo: "Hai una nuova sessione di mentoring in programma!",
                    destinatario: "mentee3",
                    mittente: "mentor3",
                    oggetto: "Nuovo incontro programmato",
                    timeStamp: new Date(),
                },
            },
            {
                id: "notifica4",
                data: {
                    corpo: "Una sessione di mentoring è stata completata!",
                    destinatario: "mentee4",
                    mittente: "mentor4",
                    oggetto: "Sessione completata",
                    timeStamp: new Date(),
                },
            },
            {
                id: "notifica5",
                data: {
                    corpo: "Nuovo progetto disponibile!",
                    destinatario: "mentee5",
                    mittente: "mentor5",
                    oggetto: "Nuovo progetto",
                    timeStamp: new Date(),
                },
            }
        ];

        // Inserimento dati
        const collections = [
            { name: "users", items: [...mentors, ...mentees] },
            { name: "videos", items: videos },
            { name: "authors", items: authors },
            { name: "meetings", items: meetings },
            { name: "notifiche", items: notifiche },
        ];

        for (const collection of collections) {
            for (const item of collection.items) {
                await setDoc(doc(db, collection.name, item.id), item.data);
            }
        }

        // Segna il database come popolato
        await setDoc(checkDoc, { populated: true, date: new Date() });

        console.log("Database popolato con successo!");
    } catch (error) {
        console.error("Errore durante il popolamento del database:", error);
    }
}

export default populateDatabase;
