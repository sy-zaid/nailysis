import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./appointments-timeline.module.css";
import { getRole } from "../../../utils/utils";

export const AppointmentsTimelineChart = ({
  clinicAppointments = [],
  labAppointments = [],
}) => {
  const userRole = getRole();

  // Calculate chartData directly without useState/useEffect
  const chartData = useMemo(() => {
    let appointments = [];

    if (userRole === "patient") {
      appointments = [...clinicAppointments, ...labAppointments];
    } else if (userRole === "doctor" || userRole === "clinic_admin") {
      appointments = [...clinicAppointments];
    } else if (userRole === "lab_technician" || userRole === "lab_admin") {
      appointments = [...labAppointments];
    }

    const dateStatusMap = {};

    appointments.forEach((appointment) => {
      const date = new Date(appointment.checkin_datetime).toLocaleDateString();

      if (!dateStatusMap[date]) {
        dateStatusMap[date] = {
          date,
          Scheduled: 0,
          Completed: 0,
          Cancelled: 0,
          Total: 0,
        };
      }

      dateStatusMap[date][appointment.status] += 1;
      dateStatusMap[date].Total += 1;
    });

    return Object.values(dateStatusMap).sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
  }, [clinicAppointments, labAppointments, userRole]);

  // Memoize the chart title
  const chartTitle = useMemo(() => {
    return userRole === "patient"
      ? "All Appointments Timeline"
      : userRole === "doctor" || userRole === "clinic_admin"
      ? "Clinic Appointments Timeline"
      : "Lab Appointments Timeline";
  }, [userRole]);

  // Memoize CustomTooltip to prevent unnecessary recreations
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          <p className={styles.tooltipItem}>
            <span
              className={styles.tooltipDot}
              style={{ backgroundColor: "#8884d8" }}
            />
            Scheduled: {payload[0].payload.Scheduled}
          </p>
          <p className={styles.tooltipItem}>
            <span
              className={styles.tooltipDot}
              style={{ backgroundColor: "#82ca9d" }}
            />
            Completed: {payload[0].payload.Completed}
          </p>
          <p className={styles.tooltipItem}>
            <span
              className={styles.tooltipDot}
              style={{ backgroundColor: "#ff8042" }}
            />
            Cancelled: {payload[0].payload.Cancelled}
          </p>
          <p className={styles.tooltipItem}>
            <span
              className={styles.tooltipDot}
              style={{ backgroundColor: "#0088fe" }}
            />
            Total: {payload[0].payload.Total}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className={styles.heading}>
        <div className={styles.blue}></div>
        <h4>{chartTitle}</h4>
      </div>
      <div className={styles.mainDiv}>
        <h3 className={styles.chartTitle}>{chartTitle}</h3>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#666" }}
              tickMargin={10}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#666" }}
              tickMargin={10}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) => (
                <span style={{ color: "#666", fontSize: "12px" }}>{value}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="Scheduled"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Completed"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Cancelled"
              stroke="#ff8042"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Total"
              stroke="#0088fe"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};
