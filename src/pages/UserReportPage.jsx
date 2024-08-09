import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
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
        setAttendance(attendanceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    };

    fetchAttendance();
  }, [user]);

  const isAbsent = (record) => {
    return !record.signInTime;
  };

  const getStatus = (record) => {
    if (isAbsent(record)) {
      return 'Absent';
    } else if (record.signInTime && !record.signOutTime) {
      return 'Pending';
    } else if (record.signInTime && record.signOutTime) {
      return 'Present';
    }
    return 'Unknown'; // Fallback case
  };

  const formatTime = (time) => {
    if (time) {
      const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
      return new Date(time).toLocaleTimeString('en-US', options);
    } else {
      return 'Pending';
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto', flexDirection: 'column', padding: '40px' }}>
        <table style={{ borderCollapse: 'separate', borderSpacing: '0 20px', width: '100%', maxWidth: '800px', marginTop: '60px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4' }}>
              <th style={{ padding: '10px', textAlign: 'left', width: '25%' }}>Date</th>
              <th style={{ padding: '10px', textAlign: 'left', width: '25%' }}>Sign-In</th>
              <th style={{ padding: '10px', textAlign: 'left', width: '25%' }}>Sign-Out</th>
              <th style={{ padding: '10px', textAlign: 'left', width: '25%' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map(record => (
              <tr key={record.id}>
                <td style={{ padding: '10px' }}>{record.date}</td>
                <td style={{ padding: '10px' }}>{formatTime(record.signInTime)}</td>
                <td style={{ padding: '10px' }}>{formatTime(record.signOutTime)}</td>
                <td style={{ padding: '10px' }}>{getStatus(record)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserReportPage;
