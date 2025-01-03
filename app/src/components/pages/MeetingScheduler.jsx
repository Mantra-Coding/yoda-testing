import React, { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { getMentees, createMeeting } from "@/dao/meetingsDAO";
import Header from "@/components/ui/header";
import { useAuth } from '@/auth/auth-context';
const MeetingScheduler = () => {
  const [user, setUser] = useState(null);
  const [mentees, setMentees] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    topic: '',
    participant: '',
    description: '',
  });
  const {userId} = useAuth();
  const {nome} = useAuth();
  const {cognome} = useAuth();
  // Controllo se l'utente è un mentor e recupero i partecipanti (mentees)
  useEffect(() => {
    const fetchMenteesData = async () => {
      try {
        const menteesList = await getMentees();
        setMentees(menteesList);
      } catch (error) {
        console.error('Errore durante il recupero dei mentee:', error);
      }
    };
  
    fetchMenteesData();
  
    // Se non c'è nessun listener da disattivare, rimuovi il return
    return () => {
      console.log("Cleanup eseguito, ma non c'è nessun listener da disattivare.");
    };
  }, []);
  
  // Funzione per convalidare il form
  const validateForm = () => {
    return (
      formData.date &&
      formData.time &&
      formData.topic &&
      formData.participant &&
      formData.description
    );
  };

  // Funzione per raccogliere i dati del form
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Recupera il partecipante selezionato
        const selectedParticipant = mentees.find((mentee) => mentee.id === formData.participant);

        if (!selectedParticipant) {
          alert('Partecipante non trovato');
          return;
        }

        // Log dei dati del partecipante per debug
        console.log('Dati del partecipante selezionato:', selectedParticipant);

        // Verifica che tutti i dati necessari siano disponibili
        if (!selectedParticipant.nome || !selectedParticipant.email) {
          alert('I dati del partecipante sono incompleti');
          return;
        }

        // Combina data e ora per creare un timestamp
        const meetingDate = new Date(`${formData.date}T${formData.time}:00`);
        const timestamp = Timestamp.fromDate(meetingDate);  // Crea un timestamp
        // Aggiungi i dati nel database
        const newMeeting = {
          date: timestamp,  // Usa il timestamp
          time: formData.time,
          topic: formData.topic,
          description: formData.description,
          mentorId: userId,  // Assicurati che `user.uid` sia definito
          mentorName: nome,
          mentorSurname: cognome,
          menteeId: selectedParticipant.id, // Questo dovrebbe essere l'ID del mentee
          menteeName: selectedParticipant.nome, // Usa 'nome' invece di 'name'
          menteeEmail: selectedParticipant.email,
          userType: "mentee", // Puoi decidere dinamicamente se è mentee o mentor
        };

        await createMeeting(newMeeting);
        alert('Incontro programmato con successo');
      } catch (error) {
        console.error('Errore nella programmazione dell\'incontro: ', error);
        alert('Impossibile programmare l\'incontro');
      }
    } else {
      alert('Compila tutti i campi');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#178563] to-white text-black">
      <Header />
      <div className="mt-8"></div>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          backgroundColor: '#10B981',
          padding: '16px',
          color: '#ffffff'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            margin: 0
          }}>Programma un nuovo incontro</h1>
        </div>
        <form style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="date" style={{
              display: 'block',
              marginBottom: '4px',
              fontSize: '14px',
              fontWeight: '500'
            }}>Data</label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #D1FAE5',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
          <div>
            <label htmlFor="time" style={{
              display: 'block',
              marginBottom: '4px',
              fontSize: '14px',
              fontWeight: '500'
            }}>Orario</label>
            <input
              type="time"
              id="time"
              value={formData.time}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #D1FAE5',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
          <div>
            <label htmlFor="topic" style={{
              display: 'block',
              marginBottom: '4px',
              fontSize: '14px',
              fontWeight: '500'
            }}>Argomento</label>
            <input
              type="text"
              id="topic"
              value={formData.topic}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #D1FAE5',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
          <div>
            <label htmlFor="participant" style={{
              display: 'block',
              marginBottom: '4px',
              fontSize: '14px',
              fontWeight: '500'
            }}>Partecipante</label>
            <select
              id="participant"
              value={formData.participant}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #D1FAE5',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            >
              <option value="">Seleziona un partecipante</option>
              {mentees.map((mentee) => (
                <option key={mentee.id} value={mentee.id}>
                  {mentee.nome} ({mentee.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="description" style={{
              display: 'block',
              marginBottom: '4px',
              fontSize: '14px',
              fontWeight: '500'
            }}>Descrizione</label>
            <textarea
              id="description"
              rows="6"
              value={formData.description}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #D1FAE5',
                borderRadius: '4px',
                fontSize: '16px',
                resize: 'none'
              }}
            ></textarea>
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#10B981',
              color: '#ffffff',
              padding: '12px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Programma incontro
          </button>
        </form>
      </div>
    </div>
  );
};

export default MeetingScheduler;