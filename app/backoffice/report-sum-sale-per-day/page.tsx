"use client";
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'
import axios from 'axios'
import config from '@/app/config'
const ReportSumSalePerDayPage = () => {
    const [arrYear, setArrYear] = useState<number[]>([])
    const [arrMonth, setArrMonth] = useState(['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [data, setData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        setArrYear(Array.from({ length: 5 }, (_, index) => dayjs().year() - index));
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const payload = {
                year: selectedYear,
                month: selectedMonth
            }

            const res = await axios.post(config.apiServer + '/api/report/sumPerDayInYearAndMonth', payload);
            setData(res.data.results)
            setTotalAmount(sumTotalAmount(res.data.results))
        } catch (e: any) {
            Swal.fire({
                title: 'Error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const sumTotalAmount = (data: any[]) => {
        let sum = 0;
        data.forEach((item: any) => {
            sum += item.amount
        })
        return sum
    }
  return (
  <div className='card mt-3'>
            <div className='card-header'>สรุปยอดขายรายวัน</div>
            <div className='card-body'>
                <div className='row'>
                    <div className='col-md-3'>
                        <div>ปี</div>
                        <select
                            className='form-control'
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                            {arrYear.map((year, index) => (
                                <option key={index} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div className='col-md-3'>
                        <div>เดือน</div>
                        <select
                            className='form-control'
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
                            {arrMonth.map((month, index) => (
                                <option key={index} value={index + 1}>{month}</option>
                            ))}
                        </select>
                    </div>
                    <div className='col-md-3'>
                        <div>&nbsp;</div>
                        <button className='btn btn-primary' onClick={fetchData}>
                            <i className='fa fa-search me-2'></i>
                            แสดงรายการ
                        </button>
                    </div>
                </div>

                <table className='table table-bordered table-striped mt-3'>
                    <thead>
                        <tr>
                            <th>วันที่</th>
                            <th className='text-end' style={{ width: '100px' }}>ยอดขาย</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item: any, index: number) => (
                            <tr key={index}>
                                <td>{dayjs(item.date).format('DD')}</td>
                                <td className='text-end'>{item.amount.toLocaleString('th-TH')}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>รวม</th>
                            <th className='text-end'>{totalAmount.toLocaleString('th-TH')}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}

export default ReportSumSalePerDayPage