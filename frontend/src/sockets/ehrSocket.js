import { useEffect, useState } from "react";
import { getAccessToken } from "../utils/utils";

export const useEhrUpdatesWS = (setRecords) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = getAccessToken();
    
    if (!token) {
      console.error("WebSocket connection failed: No valid token found.");
      return;
    }

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/ehr_updates/?token=${token}`);

    ws.onopen = () => console.log("WebSocket Connected");
    ws.onerror = (error) => console.error("WebSocket Error:", error);
    ws.onclose = () => console.log("WebSocket Closed");
    
    setSocket(ws);

    ws.onmessage = (event) => {
      try {
        const newRecord = JSON.parse(event.data);
        console.log("New Record Received:", newRecord);

        if (newRecord.id) {
          setRecords((prevRecords) => [...prevRecords, newRecord]);
        } else {
          console.error("Received record with null id:", newRecord);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    return () => {
      ws.close(); // Cleanup on unmount
    };
  }, [setRecords]);

  return socket;
};
