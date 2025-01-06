import React, { useEffect, useState } from "react";
import { getChatsByUserId } from "@/dao/chatSupportoDAO";
import { useAuth } from "@/auth/auth-context";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import Header from "@/components/ui/Header";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import app from "@/firebase/firebase";

const db = getFirestore(app);

export default function ChatListPage() {
  const { userId, userType } = useAuth(); // Implementazione dell'auth-context
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (!userId) {
          setError("Utente non autenticato.");
          return;
        }

        const result = await getChatsByUserId(userId);

        if (result.success) {
          setChats(result.data);
        } else {
          setError(result.error || "Errore durante il recupero delle chat.");
        }
      } catch (error) {
        setError("Errore generale durante il recupero delle chat.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    // Ascolta in tempo reale le modifiche nella collezione delle chat
    const chatsQuery = query(
      collection(db, "supportChat"),
      where("participants", "array-contains", userId)
    );

    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      const updatedChats = snapshot.docs.map((doc) => {
        const chat = doc.data();
        const isNewMessage = chat.lastMessageSenderId !== userId;
        return {
          id: doc.id,
          ...chat,
          isNewMessage,
        };
      });
      setChats(updatedChats);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#178563] to-[#edf2f7]">
        <p className="text-xl font-medium text-white animate-pulse">
          Caricamento delle chat...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#178563] to-[#edf2f7]">
        <p className="text-lg text-red-100 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#178563] to-[#edf2f7]">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-white tracking-tight">
          Sezione Chat Di Supporto
        </h1>
        <div className="space-y-4">
          {chats.length > 0 ? (
            chats.map((chat) => {
              const partnerName =
                userType === "mentor"
                  ? chat.menteeName || "Mentee Sconosciuto"
                  : chat.mentorName || "Mentore Sconosciuto";

              const isNewMessage = chat.isNewMessage || false;

              return (
                <Card
                  key={`${chat.id}-${isNewMessage}`} // Forza il re-render quando cambia isNewMessage
                  className={`cursor-pointer flex items-center transition-transform transform border rounded-lg p-4 shadow-md bg-white ${
                    isNewMessage ? "border-green-500 hover:border-green-700 border-4 animate-pulse" : "border-gray-200"
                  } hover:bg-gray-100 hover:scale-105 relative`}
                  onClick={() =>
                    navigate("/chat-support", {
                      state: {
                        chatId: chat.id,
                        mentorId: chat.mentorId,
                        problemType: "",
                      },
                    })
                  }
                >
                  <div className="relative flex items-center w-full">
                    <div className="w-14 h-14 rounded-full bg-[#178563] flex items-center justify-center text-white text-xl font-semibold">
                      {partnerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {partnerName}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastMessage || "Nessun messaggio disponibile"}
                      </p>
                      <p className="text-xs text-gray-400">
                        Ultimo invio: {chat.updatedAt ? new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/D"}
                      </p>
                    </div>
                    {isNewMessage && (
                      <div
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                        style={{ zIndex: 10 }}
                      ></div>
                    )}
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p className="text-lg text-gray-200 font-medium mb-2">
                Nessuna chat trovata.
              </p>
              <p className="text-white font-semibold">
                Inizia una nuova conversazione!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
