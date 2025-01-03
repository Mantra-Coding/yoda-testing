// src/components/ChatSupporto.jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { sendMessage, getMessages } from "@/dao/ChatSupportoDAO"; // Importa le funzioni DAO

export default function ChatSupporto() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { mentorId } = router.query; // Ottieni l'id del mentore dalla URL

  // Funzione per inviare il messaggio
  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(mentorId, "user123", message); // Usa l'ID dell'utente attualmente loggato
      setMessage(""); // Resetta il campo del messaggio
    }
  };

  // Ascolta i messaggi in tempo reale
  useEffect(() => {
    if (mentorId) {
      const unsubscribe = getMessages(mentorId, setMessages, setLoading);
      
      // Restituisce la funzione per annullare l'iscrizione al componentWillUnmount
      return () => unsubscribe();
    }
  }, [mentorId]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-center">Chat con {mentorId}</h2>
        <div className="space-y-4 mt-4">
          {loading ? (
            <div>Caricamento messaggi...</div>
          ) : (
            <div className="space-y-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 ${msg.userId === "user123" ? "bg-blue-100" : "bg-gray-100"} rounded-lg`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Scrivi un messaggio..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Invia
          </button>
        </div>
      </div>
    </div>
  );
}
