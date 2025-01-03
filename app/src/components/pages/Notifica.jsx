//notifica
import { useState, useEffect } from 'react';
import NotificationCard from '@/components/ui/NotificationCard';
import Header from '@/components/ui/Header';
import { useNavigate } from 'react-router-dom';
import { getByDest, deleteNotifica, getCurrentNotificaId } from '@/dao/notificaDAO';
import { useAuth } from '@/auth/auth-context';



export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const { userId } = useAuth();

  //  Carica notifiche all'avvio
  useEffect(() => {
    const fetchNotifications = async () => {
      try {

        const notificationsList = await getByDest(userId);
        console.log(notificationsList);

        setNotifications(notificationsList);
      } catch (error) {
        console.error('Errore nel recupero delle notifiche:', error);
      }
    };

    fetchNotifications();
  }, [userId]);

  //  Segna come letto (elimina la notifica)
  const handleMarkAsRead = async (id) => {
    try {
      await deleteNotifica(id);
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    } catch (error) {
      console.error('Errore nell\'eliminazione della notifica:', error);
    }
  };

  //  Visualizza dettaglio della notifica
  const handleView = async (notification) => {
    const id = getCurrentNotificaId(notification);
    if (id) {
      await deleteNotifica(id); // Elimina dopo la visualizzazione
      navigate(`/notification-detail/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#178563] to-[#ffffff] text-white">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6 text-[#ffffff]">Notifiche</h2>
        <div className="max-w-3xl">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={() => handleMarkAsRead(notification.id)}
              onView={() => handleView(notification)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
