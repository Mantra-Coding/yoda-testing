import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Header from "@/components/ui/Header";
import { fetchMeetingsForMentee, filterDaysWithMeetings } from "@/dao/meetingsDAO";
import { useAuth } from '@/auth/auth-context';
import { Button } from "@/components/ui/button";
const CalendarioIncontri = () => {
  const [meetings, setMeetings] = useState([]);
  const [daysWithMeetings, setDaysWithMeetings] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const {userId} = useAuth();
  const fetchMeetings = async () => {
    try {
      // Recuperiamo i meeting per il mentee
      const fetchedMeetings = await fetchMeetingsForMentee(userId);
      setMeetings(fetchedMeetings);
    } catch (error) {
      alert("Errore durante il recupero degli incontri." + error);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  useEffect(() => {
    const filteredDays = filterDaysWithMeetings(meetings, currentMonth, currentYear);
    setDaysWithMeetings(filteredDays);
  }, [currentMonth, currentYear, meetings]);

  const changeMonth = (direction) => {
    if (direction === 'next') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    } else if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#178563] to-white text-black">
      <Header />

      <div style={{
        background: 'linear-gradient(180deg, #10B981 0%, #ffffff 100%)',
        padding: '20px 0',
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '20px',
        }}>
          <h1 style={{
            fontSize: '24px',
            color: 'black',
            marginBottom: '20px'
          }}>
            Calendario Incontri
          </h1>

          {/* Calendar Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            {/* Calendar Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <button
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
                onClick={() => changeMonth('prev')}
              >
                ←
              </button>
              <span>{new Date(currentYear, currentMonth).toLocaleString('it-IT', { month: 'long', year: 'numeric' })}</span>
              <button
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
                onClick={() => changeMonth('next')}
              >
                →
              </button>
            </div>

            {/* Calendar Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '8px'
            }}>
              {/* Days of week */}
              {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map(day => (
                <div key={day} style={{
                  textAlign: 'center',
                  padding: '8px',
                  fontSize: '14px'
                }}>
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }, (_, i) => {
                const day = i + 1;
                const hasMeeting = daysWithMeetings.includes(day);

                return (
                  <div
                    key={day}
                    style={{
                      padding: '8px',
                      textAlign: 'center',
                      backgroundColor: hasMeeting ? '#10B981' : 'transparent',
                      color: hasMeeting ? 'white' : 'black',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    {day}
                    {hasMeeting && (
                      <div style={{
                        position: 'absolute',
                        bottom: '2px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '4px',
                        height: '4px',
                        backgroundColor: '#10B981',
                        borderRadius: '50%'
                      }}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

         {/* Upcoming Meetings Section */}
<h2 style={{
  fontSize: '20px',
  color: 'black',
  marginBottom: '16px'
}}>
  Prossimi Incontri
</h2>

<div style={{
  backgroundColor: 'white',
  borderRadius: '8px',
  padding: '16px'
}}>
  {meetings.map(meeting => (
    <div
      key={meeting.id}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', // Aggiungi per mettere il bottone a destra
        padding: '12px',
        borderBottom: '1px solid #eee'
      }}
    >
      {/* Calendar Icon */}
      <div style={{
        width: '24px',
        height: '24px',
        backgroundColor: '#E6F7F2',
        borderRadius: '4px',
        marginRight: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        📅
      </div>

      {/* Meeting Details */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '500' }}>
          Incontro con {meeting.mentorName}
        </div>
        <div style={{
          fontSize: '14px',
          color: '#666'
        }}>
          {meeting.date.toLocaleDateString()}, {meeting.time}
        </div>
      </div>

      {/* Post-Meeting Button */}
      <Link to={`/MeetingSummaryMentee/${meeting.id}`}>
        <Button
          variant="solid"
          color="green"
          className="flex items-center gap-2 justify-center p-4"
          style={{
            backgroundColor: '#10B981',
            color: 'white',
            width: '120px',  // Imposta una larghezza fissa per il bottone
          }}
        >
          <span className="text-white text-lg font-medium" style={{ fontSize: '14px' }}>
            Visualizza Minuta
          </span>
        </Button>
      </Link>
    </div>
  ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarioIncontri;
