"use client";
import { useEffect, useState } from "react";
import Modal from "../components/Mymodal";
import axios from "axios";
import config from "@/app/config";
import Swal from "sweetalert2";

const Page = () => {
  const [foodTypeId, setFoodTypeId] = useState(0);
  const [foodTypes, setFoodTypes] = useState([]);
  const [tastes, setTastes] = useState([]);
  const [name, setName] = useState("");
  const [remark, setRemark] = useState("");
  const [id, setId] = useState(0);

  useEffect(() => {
    fetchDataFoodType();
    fetchData();
  }, []);

  const fetchDataFoodType = async () => {
    try {
      const res = await axios.get(config.apiServer + "/api/foodType/list");

      if (res.data.results.length > 0) {
        setFoodTypes(res.data.results);
        setFoodTypeId(res.data.results[0].id);
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "error",
        text: error.message,
      });
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiServer + "/api/taste/list");
      setTastes(res.data.results);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "error",
        text: error.message,
      });
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        foodTypeId: foodTypeId,
        name: name,
        remark: remark,
        id: id,
      };
      
      if (id == 0) {
        await axios.post(config.apiServer + "/api/taste/create", payload);
      } else {
        await axios.put(config.apiServer + "/api/taste/update", payload);
        setId(0);
      }

      fetchData();
      document.getElementById("modalTaste_btnClose")?.click();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "error",
        text: error.message,
      });
    }
  };

  const handleClearForm = () => {
    setName("");
    setRemark("");
  };

  const handleRemove = async (id: number) => {
    try {
      const button = await Swal.fire({
        title: "ยืนยันการลบ",
        text: "คุณต้องการลบข้อมูลนี้",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
      });
      if (button.isConfirmed) {
        await axios.delete(config.apiServer + "/api/taste/remove/" + id);
        fetchData();
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "error",
        text: error.message,
      });
    }
  };

  const edit = (item: any) => {
    setId(item.id);
    setFoodTypeId(item.foodTypeId);
    setName(item.name);
    setRemark(item.remark);
  }
  return (
    <div>
      <div className="card mt-3">
        <div className="card-header">รสชาติอาหาร</div>
        <div className="card-body">
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalTaste"
            onClick={handleClearForm}
          >
            <i className="fa fa-plus me-2"></i> เพิ่มรสชาติอาหาร
          </button>

          <table className="mt-3 table table-bordered table-striped">
            <thead>
              <tr>
                <th style={{ width: "200px" }}>ประเภทอาหาร</th>
                <th style={{ width: "100px" }}>ชื่อ</th>
                <th>หมายเหตุ</th>
                <th style={{ width: "110px" }}></th>
              </tr>
            </thead>
            <tbody>
              {tastes.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.FoodType.name}</td>
                  <td>{item.name}</td>
                  <td>{item.remark}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-primary me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#modalTaste"
                      onClick={() => edit(item)}
                    >
                      <i className="fa fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemove(item.id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal id="modalTaste" title="รสชาติอาหาร">
        <div>ประเภทอาหาร</div>
        <select
          className="form-control"
          value={foodTypeId}
          onChange={(e) => setFoodTypeId(parseInt(e.target.value))}
        >
          {foodTypes.map((item: any) => (
            <option value={item.id} key={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <div className="mt-3">ชื่อ</div>
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

        <button className="mt-3 btn btn-primary" onClick={handleSave}>
          <i className="fa fa-check me-2"></i>บันทึก
        </button>
      </Modal>
    </div>
  );
};

export default Page;
