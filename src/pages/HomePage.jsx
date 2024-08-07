import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../src/components/Navbar'

const HomePage = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const checkAttendance = async () => {
      const user = auth.currentUser;
      if (user) {
        const today = new Date().toISOString().split('T')[0]; 
        const attendanceQuery = query(
          collection(firestore, 'attendance'),
          where('uid', '==', user.uid),
          where('date', '==', today)
        );
        const attendanceSnapshot = await getDocs(attendanceQuery);
        setSignedIn(attendanceSnapshot.docs.length > 0);
      }
    };

    checkAttendance();
  }, [auth.currentUser]);

  const handleSignIn = async () => {
    const user = auth.currentUser;
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      await addDoc(collection(firestore, 'attendance'), {
        uid: user.uid,
        date: today,
        signInTime: new Date().toISOString()
      });
      setSignedIn(true);
    }
  };


  const handleSignOut = async () => {
    const user = auth.currentUser;
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      const attendanceQuery = query(
        collection(firestore, 'attendance'),
        where('uid', '==', user.uid),
        where('date', '==', today)
      );
      const attendanceSnapshot = await getDocs(attendanceQuery);
      attendanceSnapshot.docs.forEach(async (docSnapshot) => {
        await updateDoc(doc(firestore, 'attendance', docSnapshot.id), {
          signOutTime: new Date().toISOString()
        });
      });
      setSignedIn(false);
    }
  };

  const viewReport = () => {
    navigate('/report');
  };

  const signo = () => {
    signOut(auth); 
    navigate('/');
  };

  const today = new Date().toISOString().split('T')[0];
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
    <Navbar/>
    <div className="home-page">
      <h1>Home Page</h1>
      <h2>{today}</h2>
      <h3>{currentTime.toLocaleTimeString()}</h3> 
      {!signedIn ? (
        <button onClick={handleSignIn}className='button1'>Sign In</button>
      ) : (
        <button onClick={handleSignOut}className='button1'>Sign Out</button>
      )}
      <button onClick={viewReport}className='button2'>View Report</button>

      <button onClick={signo}className='button1'>Logout</button>
    </div>
    </>
  );
};

export default HomePage;
