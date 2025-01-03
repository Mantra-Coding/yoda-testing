import React, { useEffect, useState } from "react";
import { useAuth } from "@/auth/auth-context";
import { fetchMentorship } from "@/dao/mentorshipSessionDAO";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Calendar, MessageSquare, FileEdit } from "lucide-react";
import Header from "@/components/ui/Header"; // ✅ Importazione dell'Header

const MentorshipPage = () => {
    const { userId } = useAuth(); // Prendiamo l'ID utente dal contesto Auth
    const [mentorshipSessions, setMentorshipSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCard, setExpandedCard] = useState(null);

    useEffect(() => {
        const loadMentorshipSessions = async () => {
            if (userId) {
                try {
                    const sessions = await fetchMentorship(userId);
                    setMentorshipSessions(sessions);

                } catch (error) {
                    console.error("Errore nel caricamento delle sessioni mentorship:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadMentorshipSessions();
    }, [userId]);

    const toggleCard = (id) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    if (loading) {
        return <p>Caricamento delle sessioni di mentorship...</p>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-700 to-emerald-50">
            {/* ✅ Aggiunto Header */}
            <Header />

            <div className="container px-4 py-8">
                <h1 className="text-2xl font-bold text-white mb-6">Le Tue Sessioni di Mentorship</h1>
                <div className="space-y-4">
                    {mentorshipSessions.length > 0 ? (
                        mentorshipSessions.map((session) => {
                            const initials = session.mentore
                                .split(" ")
                                .map((word) => word[0])
                                .join("")
                                .toUpperCase();

                            return (
                                <Card
                                    key={session.id}
                                    className={`transition-all duration-200 ${
                                        expandedCard === session.id ? "shadow-lg" : "shadow"
                                    }`}
                                >
                                    <CardHeader
                                        className="cursor-pointer"
                                        onClick={() => toggleCard(session.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center text-lg font-bold">
                                                    {initials}
                                                </div>
                                                <span className="font-medium">
                                                    Mentore: {session.mentore}
                                                </span>
                                            </div>
                                            {expandedCard === session.id ? (
                                                <ChevronUp className="h-5 w-5 text-gray-500" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5 text-gray-500" />
                                            )}
                                        </div>
                                    </CardHeader>
                                    {expandedCard === session.id && (
                                        <CardContent className="pt-0">
                                            <div className="space-y-6">
                                                <div>
                                                    <h3 className="text-sm font-semibold text-emerald-700 mb-2">
                                                        Dettagli della Sessione
                                                    </h3>
                                                    <p>
                                                        <strong>Mentee:</strong> {session.mentee}
                                                    </p>
                                                    <p>
                                                        <strong>Data di Creazione:</strong>{" "}
                                                        {new Date(
                                                            session.createdAt.seconds * 1000
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex gap-3 pt-4 border-t">
                                                    <Button variant="outline" className="flex-1">
                                                        <Calendar className="h-4 w-4 mr-2" />
                                                        Schedule
                                                    </Button>
                                                    <Button variant="outline" className="flex-1">
                                                        <MessageSquare className="h-4 w-4 mr-2" />
                                                        Message
                                                    </Button>
                                                    <Button variant="outline" className="flex-1">
                                                        <FileEdit className="h-4 w-4 mr-2" />
                                                        Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            );
                        })
                    ) : (
                        <p className="text-white">Nessuna sessione di mentorship trovata.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MentorshipPage;
