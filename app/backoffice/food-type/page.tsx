"use client";
import { useState } from "react";
import Modal from "../components/Mymodal";
import Swal from "sweetalert2";
import axios from "axios";
import config from "@/app/config";

export default function Page() {
  const [name, setName] = useState("");
  const [remark, setRemark] = useState("");

  const handleSave = async () => {
    try {
      const payload = {
        name,
        remark,
      };

      await axios.post(config.apiServer + "/api/foodtype/create", payload);
      fetchData();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "error",
        text: error.message,
      });
    }
  };

  const fetchData = async () => {};
  return (
    <div className="card mt-3">
      <div className="card-header">ประเภทอาหาร/เครื่องดื่ม</div>
      <div className="card-body">
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#modalFoodType"
        >
          <i className="fa fa-plus me-2"></i>เพิ่มรายการ
        </button>
      </div>

      <Modal id="modalFoodType" title="ประเภทอาหาร/เครื่องดื่ม">
        <div>ชื่อ</div>
        <input
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="mt-3">หมายเหตุ</div>
        <input
          className="form-control"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />

        <div className="mt-3">
          <button className="btn btn-primary" onClick={handleSave}>
            <i className="fa fa-check me-2"></i>บันทึก
          </button>
        </div>
      </Modal>
    </div>
  );
}
