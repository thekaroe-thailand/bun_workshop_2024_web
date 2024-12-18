'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import config from "@/app/config";
import Swal from "sweetalert2";
import Modal from "@/app/components/modal";
import dayjs from "dayjs";

export default function Page() {
    const [repairRecords, setRepairRecords] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [id, setId] = useState(0);

    useEffect(() => {
        fetchRepairRecords();
    }, []);

    const fetchRepairRecords = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/api/repairRecord/list`);
            setRepairRecords(response.data);
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: error.message,
            });
        }
    }

    const getStatusName = (status: string) => {
        switch (status) {
            case 'active':
                return 'รอซ่อม';
            case 'pending':
                return 'รอลูกค้ายืนยัน';
            case 'repairing':
                return 'กำลังซ่อม';
            case 'done':
                return 'ซ่อมเสร็จ';
            case 'cancel':
                return 'ยกเลิก';
            case 'complete':
                return 'ลูกค้ามารับอุปกรณ์';
            default:
                return 'รอซ่อม';
        }
    }

    const handleEdit = (id: number) => {
        setId(id);
        setShowModal(true);
    }

    return (
        <>
            <div className="card">
                <h1>สถานะการซ่อม</h1>
                <div className="card-body">
                    <table className="table mt-3">
                        <thead>
                            <tr>
                                <th>ชื่อลูกค้า</th>
                                <th>เบอร์โทรศัพท์</th>
                                <th>อุปกรณ์</th>
                                <th>อาการ</th>
                                <th>วันที่รับซ่อม</th>
                                <th>วันที่ซ่อมเสร็จ</th>
                                <th>สถานะ</th>
                                <th style={{ width: '170px' }} className="text-center">จัดการสถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {repairRecords.map((repairRecord: any) => (
                                <tr key={repairRecord.id}>
                                    <td>{repairRecord.customerName}</td>
                                    <td>{repairRecord.customerPhone}</td>
                                    <td>{repairRecord.deviceSerial}</td>
                                    <td>{repairRecord.problem}</td>
                                    <td>{dayjs(repairRecord.createdAt).format('DD/MM/YYYY')}</td>
                                    <td>{repairRecord.endJobDate ? dayjs(repairRecord.endJobDate).format('DD/MM/YYYY') : '-'}</td>
                                    <td>{getStatusName(repairRecord.status)}</td>
                                    <td className="text-center">
                                        <button className="btn-edit" onClick={() => handleEdit(repairRecord.id)}>
                                            <i className="fa-solid fa-edit mr-3"></i>
                                            ปรับสถานะ
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal title="ปรับสถานะ" isOpen={showModal} onClose={() => setShowModal(false)}>
                <div>
                    <div>เลือกสถานะ</div>
                    <div>
                        <select className="form-control w-full">
                            <option value="active">รอซ่อม</option>
                            <option value="pending">รอลูกค้ายืนยัน</option>
                            <option value="repairing">กำลังซ่อม</option>
                            <option value="done">ซ่อมเสร็จ</option>
                            <option value="cancel">ยกเลิก</option>
                            <option value="complete">ลูกค้ามารับอุปกรณ์</option>
                        </select>
                    </div>

                    <div className="mt-3">
                        <div>การแก้ไข</div>
                        <textarea className="form-control w-full" rows={5}></textarea>
                    </div>

                    <button className="btn-primary mt-3">
                        <i className="fa-solid fa-check mr-3"></i>
                        บันทึก
                    </button>
                </div>
            </Modal>
        </>
    )
}