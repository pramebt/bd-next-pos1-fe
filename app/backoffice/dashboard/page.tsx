"use client"
import config from "@/app/config"
import axios from "axios"
import { Chart } from "chart.js/auto"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"


const DashboardPage = () => {
    const [incomePerDays, setIncomePerDays] = useState<any[]>([])
    const [incomePerMonths, setIncomePerMonths] = useState<any[]>([])
    const [years, setYears] = useState<number[]>([])
    const [monthName] = useState<string[]>([
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ])

    const [days, setDays] = useState<number[]>([])
    const [year, setYear] = useState<number>(dayjs().year())
    const [selectedYear, setSelectedYear] = useState<number>(dayjs().year())
    const [month, setMonth] = useState<number>(dayjs().month() + 1)

    useEffect(() => {
        const totalDayInMonth = dayjs().daysInMonth()
        setDays(Array.from({ length: totalDayInMonth }, (_, index) => index + 1))
        setYears(Array.from({ length: 5 }, (_, index) => dayjs().year() - index))

        fetchData()
    }, [])

    const fetchData = async () => {
        fetchDataSumPerDayInYearAndMonth()
        fetchDataSumPerMonthInYear()
    }

    const createBarChartDays = (incomePerDays: any[]) => {
        let labels: number[] = []
        let datas: number[] = []

        for (let i = 0; i < incomePerDays.length; i++) {
            const item = incomePerDays[i]
            labels.push(i + 1)
            datas.push(item.amount)
        }
        const ctx = document.getElementById('chartPerDay') as HTMLCanvasElement;
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'รายรับรวมตามวัน (บาท)',
                    data: datas,
                    borderWidth :1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })
    }

    const fetchDataSumPerDayInYearAndMonth = async () => {
        try {
            const payload = {
                year: selectedYear,
                month: month
            }

            const res = await axios.post(config.apiServer + '/api/report/sumPerDayInYearAndMonth', payload)
            setIncomePerDays(res.data.results)
            createBarChartDays(res.data.results)
        } catch (error: any) {
            console.log(error)
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            })
        }
    }

    const createBarChartMonths = (incomePerMonths: any[]) => {
        let datas : number[] = []
         for (let i = 0; i < incomePerMonths.length; i++) {
            const item = incomePerMonths[i]
            datas.push(item.amount)
         }

         const ctx = document.getElementById('chartPerMonth') as HTMLCanvasElement;

         new Chart(ctx, {
            type: 'bar',
            data: {
                labels: monthName,
                datasets: [{
                    label: 'รายรับรวมตามเดือน (บาท)',
                    data: datas,
                    borderWidth :1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
         }) 
    }

    const fetchDataSumPerMonthInYear = async () => {
        try {
            const payload = {
                year: selectedYear
            }
            const res = await axios.post(config.apiServer + '/api/report/sumPerMonthInYear', payload)
            setIncomePerMonths(res.data.results)
            createBarChartMonths(res.data.results)
        } catch (error: any) {
            console.log(error)
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            })
        }
    }
    
    return (
    <div className="card mt-3">
        <div className="card-header">แดชบอร์ด</div>
        <div className="card-body">
            <div className="row">
                <div className="col-md-3">
                    <div className="form-group">
                        <div>ปี</div>
                        <select className="form-control" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <select className="form-control" value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
                            {monthName.map((month, index) => (
                                <option key={index} value={index + 1}>{month}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-md-3">
                    
                        <button className="btn btn-primary" onClick={fetchData}>
                            <i className="fa fa-search me-2"></i>
                            แสดงช้อมูล
                        </button>
                </div>
            </div>

            <div className="col-md-12">
                <div className = "h4">สรุปยอดขายรายวัน</div>
                <canvas id="chartPerDay"height="120%"></canvas>
            </div>
            <div className="col-md-12">
                <div className = "h4">สรุปยอดขายรายเดือน</div>
                <canvas id="chartPerMonth"height="120%"></canvas>
            </div>
        </div>
    </div>
  )
}

export default DashboardPage