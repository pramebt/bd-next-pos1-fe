"use client";
import axios from "axios";
import config from "@/app/config";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

const Page = () => {
  const [table, setTable] = useState(1);
  const [foods, setFoods] = useState([]);

  
  useEffect(() => {
    getFoods();
    
  }, []);

  const getFoods = async () => {
    try {
      const res = await axios.get(config.apiServer + "/api/food/list");
      setFoods(res.data.results);
    } catch (error: any) {
      Swal.fire({
        title: "มีข้อผิดพลาด",
        text: error.message,
        icon: "error",
      });
    }
  };

  const filterFoods = async (foodType: string) => {
    try {
      const res = await axios.get(
        config.apiServer + "/api/food/filter/" + foodType
      );
      setFoods(res.data.results);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "error",
        text: error.message,
      });
    }
  };

  const sale = async (foodId: number) => {
    try {
      const payload = {
        tableNo: table,
        userId: Number(localStorage.getItem("next_user_id")),
        foodId: foodId,
      };

      await axios.post(config.apiServer + "/api/saleTemp/create", payload);
      
    } catch (e: any) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  
  return (
    <>
      <div className="card mt-3">
        <div className="card-header">ขายสินค้า</div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <div className="input-group">
                <div className="input-group-text">โต๊ะ</div>
                <input
                  type="text"
                  className="form-control"
                  value={table}
                  onChange={(e) => setTable(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="col-md-9">
              <button
                className="btn btn-primary me-1"
                onClick={() => filterFoods("food")}
              >
                <i className="fa fa-hamburger me-2"></i>
                อาหาร
              </button>
              <button
                className="btn btn-primary me-1"
                onClick={() => filterFoods("drink")}
              >
                <i className="fa fa-coffee me-2"></i>
                เครื่องดื่ม
              </button>
              <button
                className="btn btn-primary me-1"
                onClick={() => filterFoods("all")}
              >
                <i className="fa fa-list me-2"></i>
                ทั้งหมด
              </button>
              <button className="btn btn-danger me-1">
                <i className="fa fa-trash me-2"></i>
                ล้างรายการ
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-9">
          <div className="row g-1">
            {foods.map((food: any) => (
              <div className="col-md-3 col-lg-3 col-sm-4 col-6" key={food.id}>
                <div className="card">
                  <img
                    src={config.apiServer + "/uploads/" + food.img}
                    style={{ height: "200px", objectFit: "cover" }}
                    alt={food.name}
                    className="img-fluid"
                    onClick={() => sale(food.id)}
                  />
                  <div className="card-body">
                    <h5>{food.name}</h5>
                    <p className="fw-bold text-success h4">{food.price} .-</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-3">
          <div className="alert p-3 text-end h1 text-white bg-dark">
            0.00 .-
          </div>
          <div className="d-grid mt-2">
            <div className="card">
              <div className="card-body">
                <div className="fw-bold">ชื่ออาหาร</div>
                <div>100 x 2 = 200 .-</div>
              </div>
              <div className="card-footer p-1">
                <div className="row g-1">
                  <div className="col-md-6">
                    <button className="btn btn-danger btn-block">
                      <i className="fa fa-time me-2"></i>
                      ยกเลิก
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button className="btn btn-success btn-block">
                      <i className="fa fa-cog me-2"></i>
                      แก้ไข
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
