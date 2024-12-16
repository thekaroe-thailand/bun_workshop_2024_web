'use client';

import { useState, useEffect } from 'react';
import Modal from '../../components/modal';
import Swal from 'sweetalert2';
import config from '../../config';
import axios from 'axios';
import dayjs from 'dayjs';

export default function Page() {
    const [devices, setDevices] = useState([]); // here
    const [repairRecords, setRepairRecords] = useState([]); // here

    const [showModal, setShowModal] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [deviceBarcode, setDeviceBarcode] = useState('');
    const [deviceSerial, setDeviceSerial] = useState('');
    const [problem, setProblem] = useState('');
    const [solving, setSolving] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [expireDate, setExpireDate] = useState(''); // here

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        const response = await axios.get(`${config.apiUrl}/api/device/list`);
        setDevices(response.data);
    }

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    const handleDeviceChange = (deviceId: string) => {
        const device = (devices as any).find((device: any) => device.id === parseInt(deviceId));

        if (device) {
            setDeviceId(device.id);
            setDeviceName(device.name);
            setDeviceBarcode(device.barcode);
            setDeviceSerial(device.serial);
            setExpireDate(dayjs(device.expire_date).format('YYYY-MM-DD'));
        } else {
            setDeviceId('');
            setDeviceName('');
            setDeviceBarcode('');
            setDeviceSerial('');
            setExpireDate('');
        }
    }

    const handleSave = async () => {
        const payload = {
            customerName: customerName,
            customerPhone: customerPhone,
            deviceId: deviceId == '' ? undefined : deviceId,
            deviceName: deviceName,
            deviceBarcode: deviceBarcode,
            deviceSerial: deviceSerial,
            expireDate: expireDate == '' ? undefined : expireDate,
            problem: problem,
            solving: solving
        }

        try {
            await axios.post(`${config.apiUrl}/api/repairRecord/create`, payload);
            Swal.fire({
                icon: 'success',
                title: 'บันทึกข้อมูล',
                text: 'บันทึกข้อมูลเรียบร้อย',
                timer: 1000
            });

            closeModal();
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: error.message,
            });
        }
    }

    return (
        <div>
            <div className="card">
                <h1>บันทึกการซ่อม</h1>
                <div className="card-body">
                    <button className="btn-primary" onClick={openModal}>
                        <i className="fa-solid fa-plus mr-3"></i>
                        เพิ่มการซ่อม
                    </button>
                </div>
            </div>

            <Modal title="เพิ่มการซ่อม" isOpen={showModal}
                onClose={() => closeModal()} size="xl">
                <div className='flex gap-4'>
                    <div className='w-1/2'>
                        <div>ชื่อลูกค้า</div>
                        <input type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="form-control w-full" />
                    </div>
                    <div className='w-1/2'>
                        <div>เบอร์โทรศัพท์</div>
                        <input type="text"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="form-control w-full" />
                    </div>
                </div>

                <div className='mt-4'>ชื่ออุปกรณ์ (ในระบบ)</div>
                <select className="form-control w-full" value={deviceId}
                    onChange={(e) => handleDeviceChange(e.target.value)}>
                    <option value="">--- เลือกอุปกรณ์ ---</option>
                    {devices.map((device: any) => (
                        <option value={device.id} key={device.id}>
                            {device.name}
                        </option>
                    ))}
                </select>

                <div className='mt-4'>ชื่ออุปกรณ์ (นอกระบบ)</div>
                <input type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    className="form-control w-full" />

                <div className="flex gap-4 mt-4">
                    <div className="w-1/2">
                        <div>barcode</div>
                        <input type="text"
                            value={deviceBarcode}
                            onChange={(e) => setDeviceBarcode(e.target.value)}
                            className="form-control w-full" />
                    </div>

                    <div className="w-1/2">
                        <div>serial</div>
                        <input type="text"
                            value={deviceSerial}
                            onChange={(e) => setDeviceSerial(e.target.value)}
                            className="form-control w-full" />
                    </div>
                </div>

                <div className="mt-4">วันหมดประกัน</div>
                <input type="date"
                    value={expireDate}
                    onChange={(e) => setExpireDate(e.target.value)}
                    className="form-control w-full" />

                <div className="mt-4">อาการเสีย</div>
                <textarea className="form-control w-full"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}></textarea>

                <button className='btn-primary mt-4' onClick={handleSave}>
                    <i className="fa-solid fa-check mr-3"></i>
                    บันทึก
                </button>
            </Modal>
        </div>
    );
}