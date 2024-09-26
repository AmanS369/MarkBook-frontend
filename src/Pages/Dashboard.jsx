import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Header from "../Components/DashboardComponent/Header";
import SpaceSection from "../Components/DashboardComponent/SpaceSection";
import QuickCapture from "../Components/DashboardComponent/QuickCapture";
import RecentNotes from "../Components/DashboardComponent/RecentNotes";
import RemindersSection from "../Components/DashboardComponent/ReminderSection";

const Dashboard = () => {
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 18) setGreeting("Good afternoon");
      else setGreeting("Good evening");
    };

    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };

    updateGreeting();
    updateTime();

    const timeInterval = setInterval(updateTime, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="flex-1 p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-8xl mx-auto"
        >
          <Header greeting={greeting} currentTime={currentTime} />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
            <div className="lg:col-span-3 space-y-8">
              <SpaceSection />
              <QuickCapture />
              <RecentNotes />
            </div>
            <div className="lg:col-span-1">
              <RemindersSection />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
