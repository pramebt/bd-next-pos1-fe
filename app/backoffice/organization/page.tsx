"use client";

import axios from "axios";
import config from "@/app/config";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const OrganizationPage = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [promptpay, setPromptpay] = useState("");
  const [logo, setLogo] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  
  const handleFileChange = (e:any) => {
    setFileSelected(e.target.files[0]);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", fileSelected as Blob);
    
    const res = await axios.post(config.apiServer + "/api/organization/upload", formData);
    setLogo(res.data.fileName);
  }
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    
      const res = await axios.get(config.apiServer + "/api/organization/info");
        setName(res.data.results.name);
        setPhone(res.data.results.phone);
        setAddress(res.data.results.address);
        setEmail(res.data.results.email);
        setWebsite(res.data.results.website);
        setLogo(res.data.results.logo);
        setTaxCode(res.data.results.taxCode);
        setPromptpay(res.data.results.promptpay);
  };

  const save = async () => {
    try {
      const fileName = await uploadFile();
      const payload = {
        name: name,
        phone: phone,
        address: address,
        email: email,
        website: website,
        promptpay: promptpay,
        logo: fileName,
        taxCode: taxCode,
      };

      await axios.post(config.apiServer + "/api/organization/create", payload);

      Swal.fire({
        title: "success",
        text: "บันทึกข้อมูลสำเร็จ",
        icon: "success",
      });
    } catch (e: any) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="card mt-3">
      <div className="card-header">
        <h5>ข้อมูลร้าน</h5>
      </div>
      
      <div className="card-body">
        <div>ชื่อ</div>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="mt-3">ที่อยู่</div>
        <input
          type="text"
          className="form-control"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="mt-3">เบอร์โทรศัพท์</div>
        <input
          type="text"
          className="form-control"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="mt-3">อีเมล</div>
        <input
          type="text"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="mt-3">เว็บไซต์</div>
        <input
          type="text"
          className="form-control"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />

        <div className="mt-3">โลโก</div>
        {logo && (
          <img src={config.apiServer + "/uploads/" + logo} alt="Logo" className="img-fluid mb-2 mt-2" width="100" />
        )}
        <input
          type="file"
          className="form-control"
          onChange={handleFileChange}
        />

        <div className="mt-3">เลขประจำตัวผู้เสียภาษี</div>
        <input
          type="text"
          className="form-control"
          value={taxCode}
          onChange={(e) => setTaxCode(e.target.value)}
        />

        <div className="mt-3">เลขพร้อมเพย์</div>
        <input
          type="text"
          className="form-control"
          value={promptpay}
          onChange={(e) => setPromptpay(e.target.value)}
        />

        <button className="btn btn-primary mt-3" onClick={save}>
          <i className="fa fa-save me-2"></i>
          บันทึก
        </button>
      </div>
    </div>
  );
};

export default OrganizationPage;
