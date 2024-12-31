import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import photos from "../assets/image.js";
import './login.css';

const Reg = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://192.168.105.1:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            // Handle successful login (e.g., store token, redirect, etc.)
            console.log('Login successful:', data);

            // Redirect to the index page (or any other page)
            navigate('/'); // Change '/' to the desired route if needed
        } catch (err) {
            setError(err.message);
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
                                <div className="xl:w-[5vw]"><img src={photos.logo} alt="" /></div>
                                <h1 className="xl:text-[4vw] xl:font-bold text-gray-600">SENT</h1>
                            </div>
                            {error && <div className="text-red-500">{error}</div>}
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
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label className="label">
                                    <a href="#" className="label-text text-gray-500 alt link link-hover">Forgot password?</a>
                                </label>
                            </div>
                            <div className="form-control mt-6">
                                <button className="mx-auto btn bg-gray-600 input-bordered w-[50%]" disabled={loading}>
                                    {loading ? 'Register in...' : 'Register'}
                                </button>
                            </div>
                            <span className="label-text text-gray-500 text-center my-5 text-lg">or continue with</span>    
                            <div className="flex justify-center gap-4">
                                <div className="bg-gray-200 hover:bg-gray-100 px-11 py-4 w-max rounded-xl border-gray-300 border">
                                    <img src={photos.google} alt="" className="xl:w-8" />
                                </div>
                                <div className="bg-gray-200 hover:bg-gray-100 px-11 py-4 w-max rounded-xl border-gray-300 border">
                                    <img src={photos.github} alt="" className="xl:w-8" />
                                </div>
                            </div>
                            <span className="label-text text-gray-500 text-center my-5 text-lg">Don’t have an account yet?<a href="#"  className="text-gray-500 alt link link-hover" onClick={() => navigate('/login')}> Register now</a></span>    
                        </div>
                    </form>
                </div>
                <div className="text-center lg:text-left">
                </div>
            </div>
        </div>
    );
};

export default Reg;