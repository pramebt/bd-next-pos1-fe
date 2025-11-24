'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Chart as ChartJS } from 'chart.js/auto';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '@/app/config';

export default function Dashboard() {
    const [incomePerDays, setIncomePerDays] = useState<any[]>([]);
    const [incomePerMonths, setIncomePerMonths] = useState<any[]>([]);
    const [years, setYears] = useState<number[]>([]);
    const [monthName, setMonthName] = useState<string[]>([
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ]);
    const [days, setDays] = useState<number[]>([]);
    const [year, setYear] = useState<number>(0);
    const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
    const [month, setMonth] = useState<number>(dayjs().month() + 1);
    const [chartPerDay, setChartPerDay] = useState<ChartJS | null>(null);
    const [chartPerMonth, setChartPerMonth] = useState<ChartJS | null>(null);

    useEffect(() => {
        const totalDayInMonth = dayjs().daysInMonth();

        setDays(Array.from({ length: totalDayInMonth }, (_, index) => index + 1));
        setYears(Array.from({ length: 5 }, (_, index) => dayjs().year() - index));

        fetchData();
    }, []);

    const fetchData = () => {
        fetchDataSumPerDayInYearAndMonth();
        fetchDataSumPerMonthInYear();
    }

    const createBarChartDays = (incomePerDays: any[]) => {
        let labels: number[] = [];
        let datas: number[] = [];

        for (let i = 0; i < incomePerDays.length; i++) {
            const item = incomePerDays[i];
            labels.push(i + 1);
            datas.push(item.amount);
        }

        const ctx = document.getElementById('chartPerDay') as HTMLCanvasElement;

        if (chartPerDay) {
            chartPerDay.destroy();
        }

        const chart = new ChartJS(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'รายรับรวมตามวัน (บาท)',
                    data: datas,
                    borderWidth: 1
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

        setChartPerDay(chart);
    }

    const fetchDataSumPerDayInYearAndMonth = async () => {
        try {
            const payload = {
                year: selectedYear,
                month: month
            }

            const token = localStorage.getItem(config.token);
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const res = await axios.post(`${config.apiServer}/api/report/sumPerDayInYearAndMonth`, payload, { headers });
            setIncomePerDays(res.data.results);
            createBarChartDays(res.data.results);
        } catch (e: any) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: e.message
            });
        }
    }

    const createBarChartMonths = (incomePerMonths: any[]) => {
        let datas: number[] = [];

        for (let i = 0; i < incomePerMonths.length; i++) {
            datas.push(incomePerMonths[i].amount);
        }

        const ctx = document.getElementById('chartPerMonth') as HTMLCanvasElement;

        if (chartPerMonth) {
            chartPerMonth.destroy();
        }

        const chart = new ChartJS(ctx, {
            type: 'bar',
            data: {
                labels: monthName,
                datasets: [{
                    label: 'รายรับรวมตามเดือน (บาท)',
                    data: datas,
                    borderWidth: 1
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

        setChartPerMonth(chart);
    }

    const fetchDataSumPerMonthInYear = async () => {
        try {
            const payload = {
                year: selectedYear
            }

            const token = localStorage.getItem(config.token);
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const res = await axios.post(`${config.apiServer}/api/report/sumPerMonthInYear`, payload, { headers });
            setIncomePerMonths(res.data.results);
            createBarChartMonths(res.data.results);
        } catch (e: any) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: e.message
            });
        }
    }

    return (
        <div className='card mt-3'>
            <div className='card-header'>
                Dashboard
            </div>
            <div className='card-body'>
                <div className='row'>
                    <div className='col-md-3'>
                        <div className='form-group'>
                            <div>ปี</div>
                            <select className='form-control' value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                                {years.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <div className='form-group'>
                            <div>เดือน</div>
                            <select className='form-control' value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
                                {monthName.map((item, index) => (
                                    <option key={index} value={index + 1}>{item}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <div>&nbsp;</div>
                        <button className='btn btn-primary' onClick={fetchData}>
                            <i className='fa fa-search me-2' />
                            แสดงข้อมูล
                        </button>
                    </div>

                    <div className='col-md-6'>
                        <div className='h4'>สรุปยอดขายรายวัน</div>
                        <canvas id='chartPerDay' height="200" />
                    </div>

                    <div className='col-md-6'>
                        <div className='h4'>สรุปยอดขายรายเดือน</div>
                        <canvas id='chartPerMonth' height="200" />
                    </div>
                </div>
            </div>
        </div>
    )
}