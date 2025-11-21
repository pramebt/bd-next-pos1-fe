"use client";
import axios from 'axios';
import config from '@/app/config';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import Modal from '../components/Mymodal';

const ReportBillSalePage = () => {
    const [billSales, setBillSales] = useState([]);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [sumAmount, setSumAmount] = useState(0);
    const [billSaleDetails, setBillSaleDetails] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const payload = {
                startDate: new Date(fromDate),
                endDate: new Date(toDate)
            }

            const res = await axios.post(config.apiServer + '/api/billSale/list', payload);
            setBillSales(res.data.results);

            const sum = handleSumAmount(res.data.results);
            setSumAmount(sum);
        } catch (e: any) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const handleSumAmount = (rows: any) => {
        let sum = 0;

        rows.forEach((row: any) => {
            sum += row.amount;
        });

        return sum;
    }

    const handCancelBill = async (id: string) => {
        try {
            const button = await Swal.fire({
                title: 'ยืนยันการยกเลิกบิล',
                text: 'คุณต้องการยกเลิกบิลนี้หรือไม่?',
                icon: 'warning',
                showCancelButton: true,
                showConfirmButton: true,
            })

            if (button.isConfirmed) {
                await axios.delete(config.apiServer + '/api/billSale/remove/' + id);
                fetchData();
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
            <div className="card mt-3">
                <div className="card-header">รายงานการขาย</div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-2">
                            <div>จากวันที่</div>
                            <input
                                type="date"
                                className="form-control"
                                value={dayjs(fromDate).format('YYYY-MM-DD')}
                                onChange={(e) => setFromDate(new Date(e.target.value))}
                            />
                        </div>

                        <div className="col-md-2">
                            <div>ถึงวันที่</div>
                            <input
                                type="date"
                                className="form-control"
                                value={dayjs(toDate).format('YYYY-MM-DD')}
                                onChange={(e) => setToDate(new Date(e.target.value))}
                            />
                        </div>

                        <div className="col-md-2">
                            <div>&nbsp;</div>
                            <button className="btn btn-primary" onClick={fetchData}>
                                <i className="fa fa-search me-2"></i>
                                แสดงรายการ
                            </button>
                        </div>
                    </div>

                    <table className="table table-bordered mt-3">
                        <thead>
                            <tr>
                                <th style={{ width: '250px' }} className='text-center'>ยกเลิกบิล</th>
                                <th style={{ width: '200px' }} className='text-center'>วันที่</th>
                                <th>รหัสบิล</th>
                                <th style={{ width: '150px' }}>พนักงานขาย</th>
                                <th style={{ width: '100px' }} className='text-end'>โต๊ะ</th>
                                <th style={{ width: '100px' }} className='text-end'>จำนวนเงิน</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billSales.length > 0 && billSales.map((billSale: any, index: number) => (
                                <tr key={index}>
                                    <td className='text-center'>
                                        <button className='btn btn-danger me-2' onClick={() => handCancelBill(billSale.id)}>
                                            <i className='fa fa-times me-2'></i>
                                            ยกเลิกบิล
                                        </button>

                                        <button
                                            className='btn btn-primary'
                                            onClick={() => setBillSaleDetails(billSale.BillSaleDetails)}
                                            data-bs-toggle="modal"
                                            data-bs-target="#modalBillSaleDetail"
                                        >
                                            <i className='fa fa-info me-2'></i>
                                            รายละเอียด
                                        </button>
                                    </td>
                                    <td>{dayjs(billSale.payDate).format('DD/MM/YYYY HH:mm')}</td>
                                    <td>{billSale.id}</td>
                                    <td>{billSale.User.name}</td>
                                    <td className='text-end'>{billSale.tableNo}</td>
                                    <td className='text-end'>{billSale.amount.toLocaleString('th-TH')}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colSpan={5}>รวม</th>
                                <th className='text-end'>{sumAmount.toLocaleString('th-TH')}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <Modal id="modalBillSaleDetail" title="รายละเอียดบิล">
                <table className='table table-bordered table-striped'>
                    <thead>
                        <tr>
                            <th>รายการ</th>
                            <th className='text-end'>ราคา</th>
                            <th>รสชาติ</th>
                            <th>ขนาด</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billSaleDetails.length > 0 && billSaleDetails.map((billSaleDetail: any, index: number) => (
                            <tr key={index}>
                                <td>{billSaleDetail.Food.name}</td>
                                <td className='text-end'>{(billSaleDetail.price + billSaleDetail.moneyAdded).toLocaleString('th-TH')}</td>
                                <td>{billSaleDetail.Taste?.name}</td>
                                <td>
                                    {billSaleDetail.foodSizeId &&
                                        billSaleDetail.FoodSize?.name + ' +' + billSaleDetail.moneyAdded
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Modal>
        </>
    )
}

export default ReportBillSalePage