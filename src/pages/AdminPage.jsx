import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AdminPage = () => {
  const [attendances, setAttendances] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'attendance'));
        const attendancesArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAttendances(attendancesArray);
      } catch (error) {
        console.error("Error fetching attendances:", error);
      }
    };

    fetchAttendances();
  }, []);

  const handleAttendanceClick = (attendanceId) => {
    navigate(`/admin/attendance/${attendanceId}`);
  };

  return (
    <>
    <Navbar/>
    <div className="admin-page">
     
      <h1>Admin Page</h1>
      <ul>
        {attendances.map(attendance => (
          <li key={attendance.id} onClick={() => handleAttendanceClick(attendance.id)}>
            {attendance.uid} -- {attendance.date}
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};

export default AdminPage;
