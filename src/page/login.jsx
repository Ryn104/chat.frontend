import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Untuk navigasi antar halaman
import photos from "../assets/image.js";
import './login.css';

const Log = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Inisialisasi useNavigate untuk navigasi

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            const response = await fetch('http://api-chat.itclub5.my.id/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });             
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }
    
            const data = await response.json();
            console.log('Login successful:', data);
    
            if (data.token) {
                localStorage.setItem('authToken', data.token); // Simpan token
            }
    
            navigate('/private'); // Navigasi ke halaman utama
        } catch (err) {
            if (err.name === 'TypeError') {
                setError('Failed to connect to the server. Please check your network.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="bg-base-200 min-h-screen">
            <div className="flex justify-between xl:min-h-screen bg">
                <div className="card w-full max-w-[48vw] shadow-2xl backdrop-blur-md backdrop-brightness-100 rounded-none">
                    <form className="card-body" onSubmit={handleSubmit}>
                        <div className="grid place-content-center h-full">
                            <div className="logo gap-5">
                                <div className="xl:w-[5vw]">
                                    <img src={photos.logo} alt="Logo" />
                                </div>
                                <h1 className="xl:text-[4vw] xl:font-bold text-gray-600">SENT</h1>
                            </div>
                            {error && <div className="text-red-500">{error}</div>} {/* Tampilkan error jika ada */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-500">Email</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="email"
                                    className="input input-bordered xl:w-[17vw] xl:h-[4vh] bg-gray-200 xl:text-[0.8vw]"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} // Update state email
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-500">Password</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="password"
                                    className="input input-bordered xl:w-[17vw] xl:h-[4vh] bg-gray-200 xl:text-[0.8vw]"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} // Update state password
                                />
                                <label className="label">
                                    <a href="#" className="label-text text-gray-500 alt link link-hover">
                                        Forgot password?
                                    </a>
                                </label>
                            </div>
                            <div className="form-control mt-6">
                                <button
                                    className="mx-auto btn bg-gray-600 input-bordered w-[50%]"
                                    disabled={loading} // Disable tombol jika sedang loading
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                            </div>
                            <span className="label-text text-gray-500 text-center my-5 text-lg">or continue with</span>
                            <div className="flex justify-center gap-4">
                                <div className="bg-gray-200 hover:bg-gray-100 px-11 py-4 w-max rounded-xl border-gray-300 border">
                                    <img src={photos.google} alt="Google" className="xl:w-8" />
                                </div>
                                <div className="bg-gray-200 hover:bg-gray-100 px-11 py-4 w-max rounded-xl border-gray-300 border">
                                    <img src={photos.github} alt="GitHub" className="xl:w-8" />
                                </div>
                            </div>
                            <span className="label-text text-gray-500 text-center my-5 text-lg">
                                Don’t have an account yet?
                                <a
                                    href="#"
                                    className="text-gray-500 alt link link-hover"
                                    onClick={() => navigate('/register')} // Navigasi ke halaman register
                                >
                                    {' '}
                                    Register now
                                </a>
                            </span>
                        </div>
                    </form>
                </div>
                <div className="text-center lg:text-left"></div>
            </div>
        </div>
    );
};

export default Log;
