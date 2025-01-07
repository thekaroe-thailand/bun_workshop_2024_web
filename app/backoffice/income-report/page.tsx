'use client'

import { useState } from "react";
import dayjs from "dayjs";

export default function IncomeReportPage() {
    const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));

    return (
        <div className="card">
            <h1>รายงานรายได้</h1>
            <div className="card-body">
                <div className="flex gap-4 items-center">
                    <div className="w-[80px] text-right">จากวันที่</div>
                    <div className="w-[200px]">
                        <input type="date" className="form-control w-full"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)} />
                    </div>

                    <div className="w-[80px] text-right">ถึงวันที่</div>
                    <div className="w-[200px]">
                        <input type="date" className="form-control w-full"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <div className="w-[200px]">
                        <button className="btn-primary" style={{ marginTop: '3px' }}>
                            <i className="fa-solid fa-search mr-3"></i>
                            ค้นหา
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}