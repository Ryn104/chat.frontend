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
                                    <details className="dropdown">
                                        <summary className="btn m-1 bg-gray-200 text-gray-500">{kelas || "Pilih Kelas"}</summary>
                                        <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                            <details className="dropdown">
                                                <summary className=" m-1 bg-gray-200 text-gray-500">{"TJKT"}</summary>
                                                <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
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
                                                <summary className=" m-1 bg-gray-200 text-gray-500">{"GEO"}</summary>
                                                <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
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
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-gray-500">Divisi</span>
                                    </label>
                                    <details className="dropdown">
                                        <summary className="btn m-1 bg-gray-200 text-gray-500">{divisi || "Pilih Divisi"}</summary>
                                        <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2">
                                            <li><a onClick={() => setDivisi("Programming")}>Programming</a></li>
                                            <li><a onClick={() => setDivisi("Design")}>Design</a></li>
                                            <li><a onClick={() => setDivisi("Networking")}>Networking</a></li>
                                        </ul>
                                    </details>
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