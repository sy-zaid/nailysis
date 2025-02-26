import { useEffect, useState } from "react";
import { getAccessToken } from "../utils/utils";
import { formatEhrRecords } from "../utils/utils";

export const useEhrUpdatesWS = (setRecords) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      console.error("WebSocket connection failed: No valid token found.");
      return;
    }

    const ws = new WebSocket(
      `ws://127.0.0.1:8000/ws/ehr_updates/?token=${token}`
    );

    ws.onopen = () => console.log("WebSocket Connected");
    ws.onerror = (error) => console.error("WebSocket Error:", error);
    ws.onclose = () => console.log("WebSocket Closed");

    setSocket(ws);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("New Record Received:", data);
        if (data.action === "create") {
          if (!data.ehr_data || !data.id) {
            console.warn(
              "Invalid WebSocket data received for 'create' action:",
              data
            );
            return;
          } else {
            const formattedData = formatEhrRecords(data);
            setRecords((prevRecords) => [...prevRecords, formattedData]);
          }
        } else if (data.action === "update" && data.updatedRecord) {
          setRecords((prevRecords) =>
            prevRecords.map((record) =>
              record.id === data.id
                ? { ...record, ...data.updatedRecord }
                : record
            )
          ); // Update only the changed record
        } else if (data.action === "delete" && data.id) {
          setRecords((prevRecords) =>
            prevRecords.filter((r) => r.id !== data.id)
          );
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
