"use client";

import { useEffect, useState } from "react";
import Modal from "../components/Mymodal";
import axios from "axios";
import config from "@/app/config";
import Swal from "sweetalert2";

const Page = () => {
  const [name, setName] = useState("");
  const [remark, setRemark] = useState("");
  const [id, setId] = useState(0);
  const [foodTypes, setFoodTypes] = useState([]);
  const [foodTypeId, setFoodTypeId] = useState(0);
  const [moneyAdded, setMoneyAdded] = useState(0);
  const [foodSizes, setFoodSizes] = useState([]);

  useEffect(() => {
    fetchData();
    fetchDataFoodSize();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiServer + "/api/foodSize/list");
      setFoodSizes(res.data.results);
    } catch (e: any) {
      Swal.fire({
        title: "error",
        icon: "error",
        text: e.message,
      });
    }
  };

  const fetchDataFoodSize = async () => {
    try {
      const res = await axios.get(config.apiServer + "/api/foodType/list");
      setFoodTypes(res.data.results);
      setFoodTypeId(res.data.results[0].id);
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
    setName(item.name);
    setRemark(item.remark);
    setFoodTypeId(item.foodTypeId);
    setMoneyAdded(item.moneyAdded);
  };

  const remove = async (item: any) => {
    try {
      const button = await Swal.fire({
        title: "ลบข้อมูล",
        text: "คุณต้องการลบข้อมูลนี้",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
      });

      if (button.isConfirmed) {
        await axios.delete(
          config.apiServer + "/api/foodSize/remove/" + item.id
        );
        fetchData();
      }
    } catch (e: any) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const save = async () => {
    try {
      const payload = {
        name: name,
        remark: remark,
        id: id,
        foodTypeId: foodTypeId,
        moneyAdded: moneyAdded,
      };

      if (id == 0) {
        await axios.post(config.apiServer + "/api/foodSize/create", payload);
      } else {
        await axios.put(config.apiServer + "/api/foodSize/update", payload);
        setId(0);
      }
      fetchData();

      document.getElementById("modalFoodSize_btnClose")?.click();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "error",
        text: error.message,
      });
    }
  };

  const clearForm = () => {
    setId(0);
    setName("");
    setRemark("");
    setMoneyAdded(0);
  };

  return (
    <div>
      <div className="card mt-3">
        <div className="card-header">ขนาดอาหาร</div>
        <div className="card-body">
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalFoodSize"
            onClick={clearForm}
          >
            <i className="fa fa-plus me-2"></i> เพิ่มขนาดอาหาร
          </button>

          <table className="mt-3 table table-bordered table-striped">
            <thead>
              <tr>
                <th style={{ width: "150px" }}>ประเภทอาหาร</th>
                <th style={{ width: "100px" }}>ชื่อ</th>
                <th>หมายเหตุ</th>
                <th style={{ width: "100px" }} className="text-end">
                  คิดเงินเพิ่ม
                </th>
                <th style={{ width: "110px" }}></th>
              </tr>
            </thead>
            <tbody>
              {foodSizes.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.FoodType.name}</td>
                  <td>{item.name}</td>
                  <td>{item.reamrk}</td>
                  <td className="text-end">{item.moneyAdded}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#modalFoodSize"
                      onClick={(e) => edit(item)}
                    >
                      <i className="fa fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-danger ms-2"
                      onClick={(e) => remove(item)}
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal id="modalFoodSize" title="ขนาดอาหาร">
        <div>ประเภทอาหาร</div>
        <select
          className="form-control"
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

        <div className="mt-3">คิดเงินเพิ่ม (บาท)</div>
        <input
          className="form-control"
          value={moneyAdded}
          type="number"
          onChange={(e) => setMoneyAdded(parseInt(e.target.value))}
        />

        <div className="mt-3">หมายเหตุ</div>
        <input
          className="form-control"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />

        <button className="mt-3 btn btn-primary" onClick={save}>
          <i className="fa fa-check mr-2"></i>บันทึก
        </button>
      </Modal>
    </div>
  );
};

export default Page;
