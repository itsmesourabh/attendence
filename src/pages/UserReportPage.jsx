import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import Navbar from '../components/Navbar';

const UserReportPage = () => {
  const [attendance, setAttendance] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchAttendance = async () => {
      if (user) {
        const attendanceQuery = query(
          collection(firestore, 'attendance'),
          where('uid', '==', user.uid)
        );
        const attendanceSnapshot = await getDocs(attendanceQuery);
        setAttendance(attendanceSnapshot.docs.map(doc => doc.data()));
      }
    };

    fetchAttendance();
  }, [user]);

  const isAbsent = (record) => {
    return !record || !record.signInTime || !record.signOutTime;
  };

  const getStatus = (record) => {
    if (isAbsent(record)) {
      return 'Absent';
    } else if (!record.signOutTime) {
      return 'Pending';
    } else {
      return 'Present';
    }
  };

  const formatTime = (time) => {
    if (time) {
      const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
      return new Date(time).toLocaleTimeString('en-US', options);
    } else {
      return 'N/A';
    }
  };

  return (

    <>
    <Navbar/>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh',flexDirection:'column', padding: '40px' }}>
      
      <table>
        <thead>
          <tr>
            <th>Date</th>
         
            <th>Sign-In </th>
           
            <th>Sign-Out </th>
           
            <th>Status</th>
           
          </tr>
        </thead>
        <tbody>
          {attendance.map(record => (
            <tr key={record.id}>
              <td>{record.date}</td>
              <td>{formatTime(record.signInTime)}</td>
              <td>{formatTime(record.signOutTime)}</td>
              <td>{getStatus(record)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default UserReportPage;