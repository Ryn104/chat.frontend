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
            const response = await fetch('http://api-chat.itclub5.my.id/api/register', {
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
        <div className="bg-base-200 xl:min-h-screen">
            <div className="xl:flex xl:justify-between xl:min-h-screen bg">
                <div className="card w-full xl:max-w-[48vw] shadow-2xl backdrop-blur-md backdrop-brightness-100 rounded-none">
                    <form className="card-body" onSubmit={handleSubmit}>
                        <div className="grid place-content-center h-[100vh] xl:h-full">
                            <div className="logo gap-5 mb-10 mt-[-18vw]">
                                <div className="xl:w-[5vw] w-20">
                                    <img src={photos.logo} alt="Logo" />
                                </div>
                                <h1 className="text-[13vw] xl:text-[4vw] font-bold xl:font-bold text-gray-600">SENT</h1>
                            </div>
                            {error && <div className="text-red-500">{error}</div>} {/* Tampilkan error jika ada */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-800 font-semibold">Name</span>
                                </label>
                                <input
                                    type="name"
                                    placeholder="name"
                                    className="input input-bordered xl:w-[17vw] xl:h-[4vh] bg-gray-200 xl:text-[0.8vw] text-gray-700 placeholder:text-gray-700"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)} // Update state email
                                />
                            </div>
                            <div className="flex gap-4 w-[100%]]">
                                <div className="form-control w-[100%]">
                                    <label className="label">
                                        <span className="label-text text-gray-800 font-semibold">Kelas</span>
                                    </label>
                                    <details className="dropdown">
                                        <summary className="btn input border border-gray-300 w-[100%] xl:w-[14vw] xl:h-[4vh] bg-gray-200 xl:text-[0.8vw] text-gray-700 font-normal">{kelas || "Pilih Kelas"}</summary>
                                        <ul className="menu dropdown-content bg-gray-200 rounded-xl z-[1] shadow xl:w-[14vw]">
                                            <details className="dropdown">
                                                <summary className="input xl:w-full xl:h-[4vh] pt-2 bg-gray-200 xl:text-[0.8vw] text-gray-700 w-28">{"TJKT"}</summary>
                                                <ul className="menu dropdown-content bg-gray-200 xl:text-[0.8vw] text-gray-700 rounded-xl z-[1] shadow xl:w-[13vw] w-[100%]">
                                                    <li><a onClick={() => setKelas("X TJKT 1")}>X TJKT 1</a></li>
                                                    <li><a onClick={() => setKelas("X TJKT 2")}>X TJKT 2</a></li>
                                                    <li><a onClick={() => setKelas("X TJKT 3")}>X TJKT 3</a></li>
                                                    <li><a onClick={() => setKelas("XI TJKT 1")}>XI TJKT 1</a></li>
                                                    <li><a onClick={() => setKelas("XI TJKT 2")}>XI TJKT 2</a></li>
                                                    <li><a onClick={() => setKelas("XI TJKT 3")}>XI TJKT 3</a></li>
                                                    <li><a onClick={() => setKelas("XII TJKT 1")}>XII TJKT 1</a></li>
                                                    <li><a onClick={() => setKelas("XII TJKT 2")}>XII TJKT 2</a></li>
                                                    <li><a onClick={() => setKelas("XII TJKT 3")}>XII TJKT 3</a></li>
                                                </ul>
                                            </details>
                                            <details className="dropdown">
                                                <summary className="input xl:w-full xl:h-[4vh] pt-2 bg-gray-200 xl:text-[0.8vw] text-gray-700 w-28">{"GEO"}</summary>
                                                <ul className="menu dropdown-content bg-gray-200 xl:text-[0.8vw] text-gray-700 rounded-xl z-[1] shadow xl:w-[13vw] w-[100%]">
                                                    <li><a onClick={() => setKelas("X GEO 1")}>X GEO 1</a></li>
                                                    <li><a onClick={() => setKelas("X GEO 2")}>X GEO 2</a></li>
                                                    <li><a onClick={() => setKelas("X GEO 3")}>X GEO 3</a></li>
                                                    <li><a onClick={() => setKelas("XI GEO 1")}>XI GEO 1</a></li>
                                                    <li><a onClick={() => setKelas("XI GEO 2")}>XI GEO 2</a></li>
                                                    <li><a onClick={() => setKelas("XI GEO 3")}>XI GEO 3</a></li>
                                                    <li><a onClick={() => setKelas("XII GEO 1")}>XII GEO 1</a></li>
                                                    <li><a onClick={() => setKelas("XII GEO 2")}>XII GEO 2</a></li>
                                                    <li><a onClick={() => setKelas("XII GEO 3")}>XII GEO 3</a></li>
                                                </ul>
                                            </details>
                                        </ul>
                                    </details>
                                </div>
                                <div className="form-control w-[100%]">
                                    <label className="label">
                                        <span className="label-text text-gray-800 font-semibold">Divisi</span>
                                    </label>
                                    <details className="dropdown">
                                        <summary className="btn input border border-gray-300 w-[100%] xl:w-[14vw] xl:h-[4vh] bg-gray-200 xl:text-[0.8vw] text-gray-700 font-normal">{divisi || "Pilih Divisi"}</summary>
                                        <ul className="menu dropdown-content bg-gray-200 xl:text-[0.8vw] text-gray-700 rounded-xl z-[1]">
                                            <li><a onClick={() => setDivisi("Programming")}>Programming</a></li>
                                            <li><a onClick={() => setDivisi("Multimedia")}>Multimedia</a></li>
                                            <li><a onClick={() => setDivisi("Networking")}>Networking</a></li>
                                        </ul>
                                    </details>
                                </div>
                            </div>
                            <div className="xl:flex xl:gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-gray-800 font-semibold">Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="input input-bordered xl:w-[17vw] xl:h-[4vh] bg-gray-200 xl:text-[0.8vw] text-gray-700 placeholder:text-gray-700"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-gray-800 font-semibold">Password</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="input input-bordered xl:w-[17vw] xl:h-[4vh] bg-gray-200 xl:text-[0.8vw] text-gray-700 placeholder:text-gray-700"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-800 font-semibold">Confirm Password</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="input input-bordered xl:w-[17vw] xl:h-[4vh] bg-gray-200 xl:text-[0.8vw] text-gray-700 placeholder:text-gray-700"
                                    required
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                />
                            </div>
                            <div className="form-control mt-14">
                                <button className="mx-auto btn bg-gray-600 border border-gray-300 w-[50%]" disabled={loading}>
                                    {loading ? 'Registering...' : 'Register'}
                                </button>
                            </div>
                            <span className="label-text text-gray-800 text-center my-5 text-base w-[80vw]">
                                Already have an account?
                                <a href="#" className="text-gray-600 alt link link-hover font-semibold text-base" onClick={() => navigate('/login')}> Login</a>
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