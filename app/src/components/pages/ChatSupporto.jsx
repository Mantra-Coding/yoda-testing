import React, { useEffect, useState } from "react";
import { useAuth } from "@/auth/auth-context";
import { createChat, sendSupportMessage, getSupportMessages } from "@/dao/chatSupportoDAO";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardHeader } from "@/components/ui/card";
import Header from "@/components/ui/Header";
import { doc, getDoc } from "firebase/firestore";


export default function ChatSupporto() {
  const location = useLocation();
  const navigate = useNavigate();
  const { chatId, mentorId, problemType } = location.state || {}; // Aggiunto chatId
  const { userId, userType, nome, cognome } = useAuth(); // Importa solo le variabili richieste

  if (!userId) {
    console.error("Utente non autenticato.");
    navigate("/login");
    return null;
  }

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        if (!chatId) {
          console.warn("Chat ID non disponibile. Creazione di una nuova chat...");
          if (!mentorId) {
            setError("Mentor ID mancante.");
            navigate("/chat-list");
            return;
          }

          const menteeId = userType === "mentee" ? userId : mentorId;
          const mentorIdFinal = userType === "mentor" ? userId : mentorId;

          const menteeName = `${nome || "Mentee"} ${cognome || "Sconosciuto"}`;
          const mentorName = "Mentore Sconosciuto";

          // Creazione della chat
          const createChatResponse = await createChat(menteeId, mentorIdFinal, menteeName, mentorName);
          if (!createChatResponse.success) {
            throw new Error("Errore nella creazione della chat.");
          }

          navigate("/chat-support", {
            state: { chatId: createChatResponse.id, mentorId: mentorIdFinal, problemType },
          });
          return;
        }
        if (problemType)
          setMessage("Ciao, ti contatto per il seguente problema: " + problemType);

        // Recupera i messaggi salvati
        const savedMessages = await getSupportMessages(chatId);
        setMessages(savedMessages);
      } catch (err) {
        console.error("Errore durante l'inizializzazione della chat:", err);
        setError("Errore durante l'inizializzazione della chat.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [chatId, mentorId, userId, userType, nome, cognome, navigate, problemType]);

  const handleSendMessage = async () => {
    if (!message.trim() || !chatId) {
      console.warn("Messaggio vuoto o chat non disponibile.");
      return;
    }

    try {
      const newMessage = {
        chatId,
        senderId: userId,
        text: message,
        timestamp: Date.now(),
      };

      await sendSupportMessage(newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    } catch (err) {
      console.error("Errore durante l'invio del messaggio:", err);
      setError("Errore durante l'invio del messaggio.");
    }
  };

  if (error) {
    useEffect(() => {
      const timer = setTimeout(() => navigate("/chat-list"), 3000);
      return () => clearTimeout(timer);
    }, [navigate]);

    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#178563] to-[#edf2f7]">
      {/* Inserimento dell'header */}
      <Header />

      <div className="container mx-auto py-6 space-y-6 text-white">
        {loading ? (
          <div>Caricamento...</div>
        ) : (
          <>
            <Card className="w-full bg-[#f8f9fa] mb-4 rounded-lg p-4 shadow-sm">
              <CardHeader>
              <h2 className="text-xl font-bold text-[#178563]">
  {userType === "mentor"
    ? `Chat con il ${location.state?.menteeName || "Mentee"}`
    : `Chat con il ${location.state?.mentorName || "Mentore"}`}
</h2>

                {problemType && problemType !== "Non specificato" && (
                  <p className="text-gray-600">
                    Stai discutendo del problema : {problemType}
                  </p>
                )}
              </CardHeader>
            </Card>

            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
              <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-gray-50 shadow-inner h-64">
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex items-center mb-4 ${
                        msg.senderId === userId ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-3 max-w-[70%] rounded-lg shadow-md ${
                          msg.senderId === userId
                            ? "bg-[#22A699] text-white"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        <p className="break-words">{msg.text}</p>
                        <span className="block text-xs mt-2 text-right opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">Nessun messaggio disponibile.</div>
                )}
              </div>

              <div className="p-4 bg-gray-100 border-t flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Scrivi un messaggio..."
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22A699] outline-none text-gray-900"
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-4 px-6 py-2 bg-[#22A699] text-white font-semibold rounded-lg shadow-md hover:bg-[#178563] transition"
                >
                  Invia
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
