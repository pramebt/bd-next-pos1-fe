"use client";
import config from "@/app/config";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Modal from "../components/Mymodal";

const Page = () => {
  const [foodTypeId, setFoodTypeId] = useState(0);
  const [foodTypes, setFoodTypes] = useState([]);
  const [name, setName] = useState("");
  const [remark, setRemark] = useState("");
  const [price, setPrice] = useState(0);
  const [id, setId] = useState(0);
  const [img, setImg] = useState("");
  const [myFile, setMyFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDataFoodType();
  }, []);

  const fetchDataFoodType = async () => {
    try {
      const res = await axios.get(config.apiServer + "/api/foodType/list");
      
      if(res.data.results.length > 0) {
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

  const handleSelectedFile = (e: any) => {
    if(e.target.files.length > 0) {
      setMyFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
        const img = await handleUpload();
        const payload = {
            foodTypeId: foodTypeId,
            name:name,
            remark:remark,
            price:price,
            img:img,
            id:id,
        }

        const res = await axios.post(config.apiServer + "/api/food/create", payload);

        if(res.data.message === "success") {
            Swal.fire({
                icon: "success",
                title: "success",
                text: "บันทึกข้อมูลสำเร็จ",
            });
        }

        document.getElementById("modalFood_btnClose")?.click();
    } catch (error: any) {
        Swal.fire({
            icon: "error",
            title: "error",
            text: error.message,
        });
    }
  };

  const handleUpload = async () => {
    try {
        const formData = new FormData();
        formData.append("file", myFile);

        const res = await axios.post(config.apiServer + "/api/food/upload", formData);
        setImg(res.data.results.image);

    } catch (error: any) {
        Swal.fire({
            icon: "error",
            title: "error",
            text: error.message,
        });
    }
  };

  return (
    <>
    <div className="card mt-3">
      <div className="card-header">อาหาร</div>
      <div className="card-body">
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#modalFood"
        >
          <i className="fa fa-plus me-2"></i>เพิ่มอาหาร
        </button>

      </div>
    </div>
    <Modal id="modalFood" title="อาหาร">
        <div>ประเภท</div>
        <select className="form-control" value={foodTypeId} onChange={(e) => setFoodTypeId(parseInt(e.target.value))}>
            {foodTypes.map((item: any) => (
                <option value={item.id} key={item.id}>
                    {item.name}
                </option>
            ))}
        </select>

        <div className="mt-3">ภาพ</div>
        <input type="file" className="form-control" onChange={handleSelectedFile}/>

        <div className="mt-3">ชื่อ</div>
        <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />

        <div className="mt-3">หมายเหตุ</div>
        <input className="form-control" value={remark} onChange={(e) => setRemark(e.target.value)} />

        <div className="mt-3">ราคา</div>
        <input className="form-control" value={price} onChange={(e) => setPrice(parseInt(e.target.value))} />

        <button className="mt-3 btn btn-primary" onClick={handleSave}>
            <i className="fa fa-check me-2"></i>บันทึก
        </button>
    </Modal>
    </>
  );
};

export default Page;
