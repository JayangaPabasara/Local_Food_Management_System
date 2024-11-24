import React, { useState } from 'react';
import '../SupplierStyles/SupplierForm.css'

const SupplierForm = ({ onHide, setSuppliers }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [province, setProvince] = useState('');
    const [phone, setPhone] = useState('');
    const [notification, setNotification] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

       
        if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
            setError('Phone number must be 10 digits long and contain only numbers.');
            return;
        }
        if (!validateEmail(email)) {
            setError('Invalid email format.');
            return;
        }

        const newSupplier = {
            name,
            email,
            address,
            province,
            phone,
            registrationDate: new Date().toISOString(),
        };

        
        await fetch('http://localhost:4000/api/suppliers/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSupplier),
        });
        
        setSuppliers(prevSuppliers => [...prevSuppliers, newSupplier]);
        
        setName('');
        setEmail('');
        setAddress('');
        setProvince('');
        setPhone('');
        onHide();
    };

    const handleCloseNotification = () => setNotification('');

    return (
        <div className="add1">
            <h2>Supplier Add</h2>
        <form className="flex-col" onSubmit={handleSubmit}>
            {notification && (
                <div style={{ color: 'green', marginBottom: '10px' }}>
                    <strong>Success!</strong> {notification}
                    <button onClick={handleCloseNotification} style={{ marginLeft: '10px', cursor: 'pointer' }}>X</button>
                </div>
            )}
            {error && (
                <div style={{ color: 'red', marginBottom: '10px', display:'flex' }}>
                    <strong>Error!</strong> {error}
                    <button onClick={() => setError('')} style={{ marginLeft: '10px', cursor: 'pointer' }}>X</button>
                </div>
            )}

            <div style={{ marginBottom: '10px' }}>
                <label>Supplier Name:</label>
                <div>
                    <input
                        type="text"
                        placeholder="Enter supplier name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label>Email:</label>
                <div>
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label>Address:</label>
                <div>
                    <input
                        type="text"
                        placeholder="Enter address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label>Province:</label>
                <div>
                    <input
                        type="text"
                        placeholder="Enter province"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label>Phone Number:</label>
                <div>
                    <input
                        type="text"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                </div>
            </div>

            <button type="submit" className='add-supplier-button'>
                Submit
            </button>
        </form>
        </div>
    );
};

export default SupplierForm;