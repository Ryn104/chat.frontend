import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import photos from "../assets/image.js";
import './login.css';

const Reg = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [kelas, setKelas] = useState('');
    const [divisi, setDivisi] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    kelas,
                    divisi,
                    password,
                    password_confirmation: passwordConfirmation,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const data = await response.json();
            console.log('Registration successful:', data);

            // Redirect to the login page
            navigate('/login');
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
                                    <span className="label-text text-gray-500">Name</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="input input-bordered xl:w-full xl:h-[4vh] bg-gray-200 xl:text-[0.8vw]"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-gray-500">Kelas</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Kelas"
                                        className="input input-bordered xl:w-[14vw] xl:h-[4vh] bg-gray-200 xl:text-[0.8vw]"
                                        required
                                        value={kelas}
                                        onChange={(e) => setKelas(e.target.value)}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-gray-500">Divisi</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Divisi"
                                        className="input input-bordered xl:w-[14vw] xl:h-[4vh] bg-gray-200 xl:text-[0.8vw]"
                                        required
                                        value={divisi}
                                        onChange={(e) => setDivisi(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-gray-500">Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="input input-bordered xl:w-[14vw] xl:h-[4vh] bg-gray-200 xl:text-[0.8vw]"
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
                                        placeholder="Password"
                                        className="input input-bordered xl:w-[14vw] xl:h-[4vh] bg-gray-200 xl:text-[0.8vw]"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-500">Confirm Password</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="input input-bordered xl:w-full xl:h-[4vh] bg-gray-200 xl:text-[0.8vw]"
                                    required
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                />
                            </div>
                            <div className="form-control mt-8">
                                <button className="mx-auto btn bg-gray-600 input-bordered w-[50%]" disabled={loading}>
                                    {loading ? 'Registering...' : 'Register'}
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
                            <span className="label-text text-gray-500 text-center my-5 text-lg">
                                Already have an account?
                                <a href="#" className="text-gray-500 alt link link-hover" onClick={() => navigate('/login')}> Login</a>
                            </span>
                        </div>
                    </form>
                </div>
                <div className="text-center lg:text-left"></div>
            </div>
        </div>
    );
};

export default Reg;
