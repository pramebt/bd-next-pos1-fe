'use client';

import config from '@/app/config';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import Modal from '../components/Mymodal';

const UserPage = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [id, setId] = useState<number>(0);
    const [name, setName] = useState<string>("");
    const [level, setLevel] = useState<string[]>(['admin', 'user']);
    const [levelSelected, setLevelSelected] = useState<string>("admin");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [currentUserId, setCurrentUserId] = useState<number>(0);

    useEffect(()=>{
        setCurrentUserId(parseInt(localStorage.getItem("next_user_id") || "0"));
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiServer + "/api/user/list");
            setUsers(res.data.results);
        } catch (error: any) {
            Swal.fire({
                title: "error",
                text: error.message,
                icon: "error",
            });
        }
    }

    const handleSave = async () => {
        try {
            const payload = {
                id: id,
                name: name,
                level: levelSelected,
                username: username,
                password: password,
            }
            if (id == 0) {
                await axios.post(config.apiServer + "/api/user/create", payload);
            } else {
                await axios.put(config.apiServer + "/api/user/update", payload);
                setId(0);
            }
            fetchData();

            document.getElementById("modalUser_btnClose")?.click();
        } catch (error: any) {
            Swal.fire({
                title: "error",
                text: error.message,
                icon: "error",
            });
        }
    }

    const handleClearForm = () => {
        setName("");
        setLevelSelected("admin");
        setUsername("");
        setPassword("");
    }

    const handleEdit = (id:number) => {
        setId(id);

        const user = users.find((item: any) => item.id == id);
        setName(user.name || "");
        setLevelSelected(user.level || "admin");
        setUsername(user.username || "");
        setPassword(user.password || "");
    }

    const handleDelete = async (id:number) => {
        try {
            const button = await Swal.fire({
                title: "ยืนยันการลบ",
                text: "คุณต้องการลบข้อมูลนี้",
                icon: "question",
                showCancelButton: true,
                showConfirmButton: true,
            });
            if (button.isConfirmed) {
                await axios.delete(config.apiServer + "/api/user/remove/" + id);
                fetchData();
            }
        }catch (error: any) {
            Swal.fire({
                title: "error",
                text: error.message,
                icon: "error",
            });
        }
    }

    return (
        <div className="card mt-3">
            <div className="card-header">ผู้ใช้งาน</div>
            <div className="card-body">
                <button className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#modalUser"
                    onClick={() => handleClearForm()}>
                    <i className="fa fa-plus me-2"></i>
                    เพิ่มผู้ใช้งาน
                </button>

                <table className="table table-bordered table-striped mt-3">
                    <thead>
                        <tr>
                            <th>ชื่อ</th>
                            <th>username</th>
                            <th>ระดับผู้ใช้งาน</th>
                            <th style={{ width: '110px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.username}</td>
                                <td>{user.level}</td>
                                <td className="text-center">
                                    {currentUserId != user.id ? (
                                        <>
                                            <button className="btn btn-primary me-2"
                                                data-bs-toggle="modal"
                                                data-bs-target="#modalUser"
                                                onClick={() => handleEdit(user.id)}>
                                                <i className="fa fa-edit"></i>
                                            </button>
                                            <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </>
                                    ) : null}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal id="modalUser" title="ผู้ใช้งาน">
                <div>ชื่อ</div>
                <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />

                <div className="mt-3">ระดับผู้ใช้งาน</div>
                <select className="form-control" value={levelSelected} onChange={(e) => setLevelSelected(e.target.value)}>
                    {level.map((level) => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                </select>

                <div className="mt-3">username</div>
                <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />

                <div className="mt-3">password</div>
                <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <button className="btn btn-primary mt-3" onClick={handleSave}>
                    <i className="fa fa-check me-2"></i>
                    บันทึก
                </button>
            </Modal>
        </div>
    )
}

export default UserPage