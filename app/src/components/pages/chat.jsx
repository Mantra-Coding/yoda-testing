import React, { useState, useEffect } from "react";
import { doc, collection, getDocs, addDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/auth/auth-context";
import Header from "@/components/ui/Header";
import app from "@/firebase/firebase";
import { getFirestore } from "firebase/firestore";
import { Card, CardHeader, CardTitle } from "@/components/ui/card"; // Importazione corretta

const db = getFirestore(app);


export default function ChatPage() {
    const { userId, isLogged } = useAuth();
    const [users, setUsers] = useState([]);
    const [chat, setChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    // Recupera gli utenti dalla tabella "utenti"
    useEffect(() => {
        const fetchUsers = async () => {
            if (!isLogged) {
                setError("Utente non loggato");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const usersSnapshot = await getDocs(collection(db, "utenti"));
                const usersList = [];

                usersSnapshot.forEach((docSnap) => {
                    const userData = docSnap.data();
                    if (docSnap.id !== userId) {
                        usersList.push({
                            id: docSnap.id,
                            nome: userData.nome || "Nome non disponibile",
                            cognome: userData.cognome || "",
                            email: userData.email || "Email non disponibile",
                            imageUrl: "/default-avatar.png", // Puoi modificare se hai un campo per l'immagine
                            occupazione: userData.occupazione || "Occupazione non specificata",
                        });
                    }
                });

                setUsers(usersList);
            } catch (err) {
                console.error("Errore durante il recupero degli utenti:", err);
                setError("Errore durante il recupero degli utenti.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [userId, isLogged]);

    // Inizia o recupera una chat
    const startChat = async (partnerId, partnerName) => {
        if (!isLogged) return;

        try {
            const chatRef = collection(db, "chats");
            const chatSnapshot = await getDocs(chatRef);
            let existingChat = null;

            chatSnapshot.forEach((docSnap) => {
                const chatData = docSnap.data();
                if (
                    (chatData.buyerId === userId && chatData.sellerId === partnerId) ||
                    (chatData.buyerId === partnerId && chatData.sellerId === userId)
                ) {
                    existingChat = { id: docSnap.id, ...chatData };
                }
            });

            if (existingChat) {
                // Aggiorna il partnerName se necessario
                setChat({ ...existingChat, partnerName });
            } else {
                const newChatRef = await addDoc(collection(db, "chats"), {
                    buyerId: userId,
                    sellerId: partnerId,
                    messages: [],
                    createdAt: Date.now(),
                });

                setChat({
                    id: newChatRef.id,
                    buyerId: userId,
                    sellerId: partnerId,
                    messages: [],
                    createdAt: Date.now(),
                    partnerName, // Aggiungi il partnerName
                });
            }
        } catch (err) {
            console.error("Errore durante la creazione della chat:", err);
            setError("Errore durante la creazione della chat.");
        }
    };


    // Invia un messaggio
    const sendMessage = async () => {
        if (!message.trim()) return;

        if (!chat) {
            setError("Seleziona un utente per avviare la chat.");
            return;
        }

        setSending(true);
        try {
            await updateDoc(doc(db, "chats", chat.id), {
                messages: [...chat.messages, { senderId: userId, text: message, timestamp: Date.now() }],
            });

            setChat({
                ...chat,
                messages: [...chat.messages, { senderId: userId, text: message, timestamp: Date.now() }],
            });

            setMessage("");
        } catch (err) {
            console.error("Errore durante l'invio del messaggio:", err);
            setError("Errore durante l'invio del messaggio.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#178563] to-white">
            <Header />
            <div className="container mx-auto py-6">
                <div className="grid grid-cols-3 gap-6">
                    {/* Lista utenti */}
                    <div className="col-span-1 bg-gray-100 rounded-lg shadow-md p-4">
                        <h2 className="text-lg font-bold mb-4">Lista Utenti Mentorship:</h2>
                        <ul>
                            <div className="space-y-4">
                                {users.map((user) => (
                                    <Card
                                        key={user.id}
                                        className="hover:shadow-lg transition-shadow rounded-lg bg-white p-4 cursor-pointer"
                                        onClick={() => startChat(user.id, `${user.nome} ${user.cognome}`)}
                                    >
                                        <CardHeader>
                                            <div className="flex items-start space-x-4">
                                                {/* Foto */}
                                                <div className="w-16 h-16 rounded-full bg-[#178563] flex items-center justify-center text-white text-2xl font-bold">
                                                    {user.nome[0]}{user.cognome[0]}
                                                </div>
                                                {/* Dettagli */}
                                                <div className="flex flex-col">
                                                    <h3 className="text-xl font-bold text-gray-800">
                                                        {user.nome} {user.cognome}
                                                    </h3>
                                                    <p className="text-sm text-[#178563]">{user.occupazione}</p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>

                        </ul>
                    </div>

                    {/* Corpo della chat */}
                    <div className="col-span-2 bg-white rounded-lg shadow-md p-4 flex flex-col h-full">
                        <Card className="w-full bg-[#f8f9fa] mb-4 rounded-lg p-4 shadow-sm">
                            <CardHeader>
                                <div className="flex items-center space-x-4">
                                    {/* Foto del partner */}
                                    {chat && (
                                        <div
                                            className="w-16 h-16 rounded-full flex items-center justify-center bg-cover bg-center text-white text-2xl font-bold"
                                            style={{
                                                backgroundImage: `url(${chat.partnerImageUrl || '/default-avatar.png'})`,
                                                backgroundColor: chat.partnerImageUrl ? 'transparent' : '#178563',
                                            }}
                                        >
                                            {!chat.partnerImageUrl &&
                                                chat.partnerName
                                                    ?.split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                        </div>
                                    )}


                                    {/* Dettagli del partner */}
                                    {/* Dettagli del partner */}
                                    <div>
                                        <h2 className="text-2xl font-bold text-[#178563]">
                                            {chat?.partnerName || "Seleziona un utente"}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {chat?.partnerDescription || "Sessione di Mentorship in corso"}
                                        </p>
                                    </div>

                                </div>
                            </CardHeader>
                        </Card>


                        {/* Messaggi */}
                        <div className="overflow-y-auto h-96 border rounded-lg p-4 bg-gray-50 shadow-inner">
                            {chat?.messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"
                                        } items-center mb-3`}
                                >
                                    {msg.senderId !== userId && (
                                        <div className="w-10 h-10 rounded-full bg-[#178563] flex items-center justify-center text-white text-sm font-bold mr-2">
                                            {users.find((u) => u.id === msg.senderId)?.nome[0] || "?"}
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[70%] px-4 py-2 rounded-lg shadow-lg ${msg.senderId === userId
                                                ? "bg-[#22A699] text-white"
                                                : "bg-gray-200 text-gray-900"
                                            }`}
                                    >
                                        <p className="break-words">{msg.text}</p>
                                        <span className="block text-xs mt-2 opacity-75 text-right">
                                            {new Date(msg.timestamp).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                    {msg.senderId === userId && (
                                        <div className="w-10 h-10 rounded-full bg-[#178563] flex items-center justify-center text-white text-sm font-bold ml-2">
                                            Tu
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>



                        {/* Input messaggi */}
                        <div className="flex items-center mt-4 bg-white shadow-md rounded-lg p-3">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Scrivi un messaggio..."
                                className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#22A699]"
                            />
                            <button
                                onClick={sendMessage}
                                className="ml-3 px-6 py-3 bg-[#22A699] hover:bg-[#178563] text-white font-bold rounded-lg shadow-lg transition duration-300"
                            >
                                Invia
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
