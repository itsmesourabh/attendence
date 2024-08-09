import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AttendanceDetailPage = () => {
  const { attendanceId } = useParams();
  const [attendance, setAttendance] = useState(null);


  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const docRef = doc(firestore, 'attendance', attendanceId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const formattedDate = new Date(data.date).toLocaleDateString();
          const formattedSignInTime = new Date(data.signInTime).toLocaleTimeString();
          const formattedSignOutTime = new Date(data.signOutTime).toLocaleTimeString();

          setAttendance({
            ...data,
            date: formattedDate,
            signInTime: formattedSignInTime,
            signOutTime: formattedSignOutTime,
          });
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching attendance details:", error);
      }
    };

    fetchAttendance();
  }, [attendanceId]);

  return (
    <>
    <Navbar/>
    <div className="admin-page">
      <h1>Attendance Details</h1>
      {attendance ? (
        <div>
          <p><strong>Date:</strong> {attendance.date}</p>
          <p><strong>Sign In Time:</strong> {attendance.signInTime}</p>
          <p><strong>Sign Out Time:</strong> {attendance.signOutTime}</p>
          
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    </>
  );
};

export default AttendanceDetailPage;
