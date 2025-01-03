//notificationCard

import { Button } from "@/components/ui/button";

// Definizione del tipo di notifica

function NotificationCard({ notification, onMarkAsRead, onView }) {
  return (
    <div className="mb-4 bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-col space-y-4">
        <div>
          {/* Mostra chi ha inviato la notifica e il ruolo */}
          <h3 className="text-lg font-medium text-[#178563]">
            {notification.oggetto} 
          </h3>
          {/* Mostra il titolo della notifica */}
          <p className="text-sm text-[#178563] font-semibold">{notification.title}</p>
          {/* Mostra il messaggio della notifica */}
          <p className="text-sm text-gray-600">{notification.corpo}</p>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            variant="default"
            onClick={() => onMarkAsRead(notification.id)}
            className="bg-[#178563] text-white hover:bg-[#178563]/80"
          >
            Segna come letto
          </Button>
          <Button
            variant="default"
            onClick={() => onView(notification.id)}
            className="bg-[#178563] text-white hover:bg-[#178563]/80"
          >
            Visualizza
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;
