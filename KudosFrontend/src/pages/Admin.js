import React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, roleMap } from "../utility.js";
import { updateUserProfile, checkSession, getUserList } from "../api/user.js";
import { UserContext } from "../components/UserContext";
import UserCard from "../components/UserCard.js";

function Admin() {
  const { user, setUser } = useContext(UserContext);
  const current_user = getCurrentUser();
  const navigate = useNavigate();
  const [users, setUsers] = useState();
  const [selectType, setSelectType] = useState();
  const [selectStatus, setSelectStatus] = useState();
  const [selectKudos, setSelectKudos] = useState();
  const [selectReports, setSelectReports] = useState();
  const [selectUsername, setSelectUsername] = useState();

  const asyncRun = async () => {
    await checkSession();
    await getUserList().then((res) => {
      setUsers(res);
    });
  };

  useEffect(() => {
    if (!current_user) navigate("/login");
    else if (current_user.account_type !== 3) navigate("/login");
    else asyncRun();

    document.title = "Admin | Kudos";
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const edit_user = {
      account_type: selectType,
      status: selectStatus,
      kudos: selectKudos,
      reports: selectReports,
    };
    await updateUserProfile(users[selectUsername], edit_user);
  };

  return (
    <div className="root-content">
      <table>
        <tbody>
          <tr>
            <td className="table-wrapper">
              <table className="fl-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Kudos (+)</th>
                    <th>Reports (+)</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users &&
                    users.map((user, i) => {
                      return (
                        <tr key={i}>
                          <td>
                            <UserCard user={user} />
                          </td>
                          <td>{Object.keys(roleMap)[user.account_type]}</td>
                          <td>{user.status}</td>
                          <td>{user.kudos}</td>
                          <td>{user.reports}</td>
                          <td>{user.email}</td>
                        </tr>
                      );
                    })}
                  <tr>
                    <td>
                      <select
                        onChange={(e) => setSelectUsername(e.target.value)}
                      >
                        {users &&
                          users.map((user, i) => (
                            <option key={i} value={i}>
                              {user.username}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td>
                      <select onChange={(e) => setSelectType(e.target.value)}>
                        <option value={0}>No role</option>
                        <option value={1}>Student</option>
                        <option value={2}>Organization</option>
                        <option value={3}>Administrator</option>
                        <option value={4}>Club</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        min={-10000}
                        step={1}
                        max={10000}
                        onChange={(e) => setSelectStatus(e.target.value)}
                      ></input>
                    </td>
                    <td>
                      <input
                        type="number"
                        min={-10000}
                        step={1}
                        max={10000}
                        onChange={(e) => setSelectKudos(e.target.value)}
                      ></input>
                    </td>
                    <td>
                      <input
                        type="number"
                        min={-10000}
                        step={1}
                        max={10000}
                        onChange={(e) => setSelectReports(e.target.value)}
                      ></input>
                    </td>
                    <td>
                      <button onClick={handleSubmit}>Submit</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <div></div>
    </div>
  );
}

export default Admin;
