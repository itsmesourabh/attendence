import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const AdminPage = () => {
  const [attendances, setAttendances] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(firestore, "attendance")
        );
        const attendancesArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAttendances(attendancesArray);
      } catch (error) {
        console.error("Error fetching attendances:", error);
      }
    };

    fetchAttendances();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "users"));
        const usersArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersArray);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (userId) => {
    setSelectedUser(userId);
  };

  const getUniqueUsers = () => {
    const userIds = new Set(attendances.map((att) => att.uid));
    return users.filter((user) => userIds.has(user.id));
  };

  const getUserAttendances = (userId) => {
    return attendances.filter((attendance) => attendance.uid === userId);
  };

  const formatTime = (time) => {
    if (time) {
      const options = { hour: '2-digit', minute: '2-digit' };
      return new Date(time).toLocaleTimeString('en-US', options);
    } else {
      return 'Pending';
    }
  };

  return (
    <>
      <Navbar />

      <div className="admin-page">
        <h1></h1>
        {!selectedUser ? (
          <ul>
            {getUniqueUsers().map((user) => (
              <li key={user.id} onClick={() => handleUserClick(user.id)}>
                {user.username}   --   {user.email}   --   {user.phoneNumber}
              </li>
            ))}
          </ul>
        ) : (
          <>
            <div className="button-container">
              <button onClick={() => setSelectedUser(null)}>
                Back to User List
              </button>
            </div>
            <h2>
              Attendance Records for{" "}
              {users.find((user) => user.id === selectedUser)?.username}
            </h2>
            <div className="table-container">
              <table
                style={{
                  borderCollapse: "separate",
                  borderSpacing: "0 20px",
                  width: "400px",
                  maxWidth: "800px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f4f4f4" }}>
                    <th
                      style={{ padding: "10px", textAlign: "left", width: "25%" }}
                    >
                      Date
                    </th>
                    <th
                      style={{ padding: "10px", textAlign: "left", width: "25%" }}
                    >
                      Sign-In
                    </th>
                    <th
                      style={{ padding: "10px", textAlign: "left", width: "25%" }}
                    >
                      Sign-Out
                    </th>
                    <th
                      style={{ padding: "10px", textAlign: "left", width: "25%" }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getUserAttendances(selectedUser).map((record) => (
                    <tr key={record.id}>
                      <td style={{ padding: "10px" }}>{record.date}</td>
                      <td style={{ padding: "10px" }}>
                        {formatTime(record.signInTime)}
                      </td>
                      <td style={{ padding: "10px" }}>
                        {formatTime(record.signOutTime)}
                      </td>
                      <td style={{ padding: "10px" }}>{getStatus(record)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const getStatus = (record) => {
  if (!record.signInTime) {
    return "Absent";
  } else if (!record.signOutTime) {
    return "Pending";
  } else {
    return "Present";
  }
};

export default AdminPage;
