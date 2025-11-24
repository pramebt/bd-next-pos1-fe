'use client'

import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import axios from 'axios'
import config from '@/app/config'
import Swal from 'sweetalert2'

export default function ReportSumSalePerMonth() {
    const [data, setData] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)
    const [arrYear, setArrYear] = useState<number[]>([])
    const [selectedYear, setSelectedYear] = useState(dayjs().year());

    useEffect(() => {
        setArrYear(Array.from({ length: 10 }, (_, index) => dayjs().year() - index));
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const payload = {
                year: selectedYear
            }
            
            const headers = {
                Authorization: `Bearer ${localStorage.getItem(config.token)}`
            }
            const res = await axios.post(config.apiServer + '/api/report/sumPerMonthInYear', payload, { headers });
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

    const sumTotalAmount = (data: any) => {
        let sum = 0;

        data.forEach((item: any) => {
            sum += item.amount
        })

        return sum;
    }

    return (
        <div className="card mt-3">
            <div className="card-header">สรุปยอดขายรายเดือน</div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-3">
                        <div>ปี</div>
                        <select className="form-control" value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                            {arrYear.map((year, index) => (
                                <option key={index} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <div>&nbsp;</div>
                        <button className="btn btn-primary btn-block" onClick={fetchData}>
                            <i className="fa fa-search me-2" />
                            แสดงรายการ
                        </button>
                    </div>
                </div>

                <table className="table table-bordered table-striped mt-3">
                    <thead>
                        <tr>
                            <th>เดือน</th>
                            <th className="text-end" style={{ width: '100px' }}>ยอดขาย</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item: any, index: number) => (
                            <tr key={index}>
                                <td>{item.month}</td>
                                <td className="text-end">{item.amount.toLocaleString('th-TH')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}