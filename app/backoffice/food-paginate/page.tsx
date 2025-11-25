"use client";
import config from "@/app/config";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const FoodPaginatePage = () => {
  const [foods, setFoods] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (page: number = 1) => {
    try {
      const payload = {
        page: page,
        itemsPerPage: itemsPerPage,
      };

      const headers = {
        Authorization: `Bearer ${localStorage.getItem(config.token)}`,
      };

      const res = await axios.post(
        config.apiServer + "/api/food/paginate",
        payload,
        { headers }
      );
      setFoods(res.data.results);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.totalItems);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "error",
        text: error.message,
      });
    }
  };

  const changePage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      fetchData(page);
    }
  };
  return (
    <div className="card mt-3">
      <div className="card-header">รายการอาหาร</div>
      <div className="card-body">
        <table className="table table-bordered ">
          <thead>
            <tr>
              <th>ชื่ออาหาร</th>
              <th className="text-end" style={{ width: "100px" }}>
                ราคา
              </th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food: any) => (
              <tr key={food.id}>
                <td>{food.name}</td>
                <td className="text-end">{food.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 ">
          <div>
            จำนวนรายการ : {totalItems} จำนวนหน้า : {totalPages}
          </div>
        </div>

        <div className="col-md-6 mt-2 d-flex flex-wrap gap-2">
          <button
            className="btn btn-primary"
            onClick={() => changePage(1)}
            disabled={currentPage === 1}
          >
            <i className="fa fa-chevron-left"></i>หน้าแรก
          </button>
          <button
            className="btn btn-primary"
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="fa fa-chevron-left"></i>
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              className={`btn btn-primary ${currentPage === index + 1 ? "active" : ""}`}
              disabled={currentPage === index + 1}
              key={index}
              onClick={() => changePage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button 
            className="btn btn-primary"
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <i className="fa fa-chevron-right"></i>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => changePage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <i className="fa fa-chevron-right"></i>หน้าสุดท้าย
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodPaginatePage;
