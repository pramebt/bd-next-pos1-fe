'use client'

import { useEffect, useState } from "react"
import Swal from "sweetalert2";
import config from "@/app/config";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
    const [name, setName] = useState('');
    const router = useRouter();

    useEffect(() => {
        const name = localStorage.getItem('next_name');
        setName(name ?? "");
    }, []);

    const signOut = async () => {
        try {
            const button = await Swal.fire({
                title: 'ออกจากระบบ',
                text: 'คุณต้องการออกจากระบบ',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            })

            if (button.isConfirmed) {
                localStorage.removeItem(config.token);
                localStorage.removeItem('next_name');
                localStorage.removeItem('next_user_id');

                router.push('/signin');
            }
        } catch (e: any) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    return (
        <>
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                <a href="index3.html" className="brand-link">
                    <img src="../dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
                    <span className="brand-text font-weight-light">NextPOS 2024</span>
                </a>

                <div className="sidebar">
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div className="image">
                            <img src="../dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
                        </div>
                        <div className="info">
                            <a href="#" className="d-block">{name}</a>
                            <button className="btn btn-danger mt-3" onClick={signOut}>
                                <i className="fa fa-times mr-2"></i>ออกจากระบบ
                            </button>
                        </div>
                    </div>

                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            <li className="nav-item">
                                <Link href="/backoffice/food-type" className="nav-link">
                                    <i className="nav-icon fas fa-th"></i>
                                    <p>ประเภทอาหาร</p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/backoffice/food-size" className="nav-link">
                                    <i className="nav-icon fas fa-th"></i>
                                    <p>ขนาดอาหาร</p>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    )
}