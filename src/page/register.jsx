import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import photos from "../assets/image.js";
import "./login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Reg = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [kelas, setKelas] = useState("");
  const [divisi, setDivisi] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
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
        toast.error("Gagal membuat user");
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      toast.success("Berhasil membuat user");
      console.log('Registration successful:', data);

      // Tunda navigate selama 1 detik untuk memastikan toast ditampilkan
      setTimeout(() => {
        navigate('/login');
      }, 2000); // 1000 ms = 1 detik
    } catch (err) {
      setError(err.message);
      toast.error(err.message); // Tampilkan error menggunakan toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-200 xl:min-h-screen">
      <div className="xl:flex xl:justify-between xl:min-h-screen bg">
        <div className="card w-full xl:max-w-[48vw] backdrop-blur-md backdrop-brightness-100 shadow-xl rounded-none">
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="grid place-content-center h-[100vh] xl:h-full">
              <div className="logo gap-5 mb-2 xl:mb-8 mt-[-14vw] xl:mt-[0vw]">
                <div className="xl:w-[5vw] w-20">
                  <img src={photos.logo} alt="Logo" />
                </div>
                <h1 className="text-7xl mt-3 xl:text-[4vw] font-bold xl:font-bold text-gray-600">
                  SENT
                </h1>
              </div>
              {error && <div className="text-red-500">{error}</div>}
              <div className="xl:w-[55vw] xl:pl-[25vw]">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-800 font-semibold">
                      Name
                    </span>
                  </label>
                  <input
                    type="name"
                    placeholder="name"
                    className="input input-bordered xl:w-full xl:h-[4vh] bg-gray-200 xl:text-[0.8vw] h-10 text-sm text-gray-700 placeholder:text-gray-700"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex gap-5 w-[100%]]">
                  <div className="form-control w-[100%]">
                    <label className="label">
                      <span className="label-text text-gray-800 font-semibold">
                        Kelas
                      </span>
                    </label>
                    <details className="dropdown">
                      <summary className="btn input border border-gray-300 w-[100%] xl:w-[14.5vw] xl:h-[4vh] bg-gray-200 xl:text-[0.8vw] text-gray-700 font-normal h-10 text-sm">
                        {kelas || "Pilih Kelas"}
                      </summary>
                      <ul className="menu dropdown-content bg-gray-200 rounded-xl z-[1] shadow xl:w-[14vw]">
                        <details className="dropdown">
                          <summary className="input xl:w-full xl:h-[4vh] h-6 bg-gray-200 xl:text-[0.8vw] text-gray-700 w-28">
                            {"TJKT"}
                          </summary>
                          <ul className="menu dropdown-content bg-gray-200 xl:text-[0.8vw] text-gray-700 rounded-xl z-[1] shadow xl:w-[13vw] w-[100%]">
                            <li>
                              <a onClick={() => setKelas("X TJKT 1")}>
                                X TJKT 1
                              </a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("X TJKT 2")}>
                                X TJKT 2
                              </a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("X TJKT 3")}>
                                X TJKT 3
                              </a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("XI TJKT 1")}>
                                XI TJKT 1
                              </a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("XI TJKT 2")}>
                                XI TJKT 2
                              </a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("XI TJKT 3")}>
                                XI TJKT 3
                              </a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("XII TJKT 1")}>
                                XII TJKT 1
                              </a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("XII TJKT 2")}>
                                XII TJKT 2
                              </a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("XII TJKT 3")}>
                                XII TJKT 3
                              </a>
                            </li>
                          </ul>
                        </details>
                        <details className="dropdown">
                          <summary className="input xl:w-full xl:h-[4vh] h-6 bg-gray-200 xl:text-[0.8vw] text-gray-700 w-28">
                            {"GEO"}
                          </summary>
                          <ul className="menu dropdown-content bg-gray-200 xl:text-[0.8vw] text-gray-700 rounded-xl z-[1] shadow xl:w-[13vw] w-[100%]">
                            <li>
                              <a onClick={() => setKelas("X GEO 1")}>X GEO 1</a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("X GEO 2")}>X GEO 2</a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("X GEO 3")}>X GEO 3</a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("XI GEO 1")}>
                                XI GEO 1
                              </a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("XI GEO 2")}>
                                XI GEO 2
                              </a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("XI GEO 3")}>
                                XI GEO 3
                              </a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("XII GEO 1")}>
                                XII GEO 1
                              </a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("XII GEO 2")}>
                                XII GEO 2
                              </a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("XII GEO 3")}>
                                XII GEO 3
                              </a>
                            </li>
                          </ul>
                        </details>
                        <details className="dropdown">
                          <summary className="input xl:w-full xl:h-[4vh] h-6 bg-gray-200 xl:text-[0.8vw] text-gray-700 w-28">
                            {"KA"}
                          </summary>
                          <ul className="menu dropdown-content bg-gray-200 xl:text-[0.8vw] text-gray-700 rounded-xl z-[1] shadow xl:w-[13vw] w-[100%]">
                            <li>
                              <a onClick={() => setKelas("X KA 1")}>X KA 1</a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("X KA 2")}>X KA 2</a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("XI KA 1")}>XI KA 1</a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("XI KA 2")}>XI KA 2</a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("XII KA 1")}>
                                XII KA 1
                              </a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("XII KA 2")}>
                                XII KA 2
                              </a>
                            </li>
                          </ul>
                        </details>
                        <details className="dropdown">
                          <summary className="input xl:w-full xl:h-[4vh] h-6 bg-gray-200 xl:text-[0.8vw] text-gray-700 w-28">
                            {"PF"}
                          </summary>
                          <ul className="menu dropdown-content bg-gray-200 xl:text-[0.8vw] text-gray-700 rounded-xl z-[1] shadow xl:w-[13vw] w-[100%]">
                            <li>
                              <a onClick={() => setKelas("X PF")}>X PF</a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("XI PF")}>XI PF</a>
                            </li>
                            <li>
                              <a onClick={() => setKelas("XII PF")}>XII PF</a>
                            </li>
                          </ul>
                        </details>
                      </ul>
                    </details>
                  </div>
                  <div className="form-control w-[100%]">
                    <label className="label">
                      <span className="label-text text-gray-800 font-semibold">
                        Divisi
                      </span>
                    </label>
                    <details className="dropdown">
                      <summary className="btn input border border-gray-300 w-[100%] xl:w-[14.5vw] xl:h-[4vh] bg-gray-200 xl:text-[0.8vw] text-gray-700 font-normal h-10">
                        {divisi || "Pilih Divisi"}
                      </summary>
                      <ul className="menu dropdown-content bg-gray-200 xl:text-[0.8vw] text-gray-700 rounded-xl z-[1]">
                        <li>
                          <a onClick={() => setDivisi("Programming")}>
                            Programming
                          </a>
                        </li>
                        <li>
                          <a onClick={() => setDivisi("Multimedia")}>
                            Multimedia
                          </a>
                        </li>
                        <li>
                          <a onClick={() => setDivisi("Networking")}>
                            Networking
                          </a>
                        </li>
                      </ul>
                    </details>
                  </div>
                </div>
                <div className="xl:flex xl:gap-5">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-gray-800 font-semibold">
                        Email
                      </span>
                    </label>
                    <input
                      type="email"
                      placeholder="Email"
                      className="input input-bordered xl:w-[14.5vw] xl:h-[4vh] text-sm bg-gray-200 xl:text-[0.8vw] h-10 text-gray-700 placeholder:text-gray-700"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-gray-800 font-semibold">
                        Password
                      </span>
                    </label>
                    <input
                      type="password"
                      placeholder="Password"
                      className="input input-bordered xl:w-[14.5vw] xl:h-[4vh] bg-gray-200 xl:text-[0.8vw] text-sm text-gray-700 h-10 placeholder:text-gray-700"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-800 font-semibold">
                      Confirm Password
                    </span>
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="input input-bordered xl:w-full xl:h-[4vh] bg-gray-200 xl:text-[0.8vw] h-10 text-sm text-gray-700 placeholder:text-gray-700"
                    required
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-control xl:mt-14 mt-6">
                <button
                  className="mx-auto btn bg-gray-600 input-bordered w-[50%] xl:w-[15%]"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </div>
              <span className="label-text text-gray-800 text-center my-5 text-base w-[80vw]">
                Already have an account?
                <a
                  href="#"
                  className="text-gray-800 alt link link-hover font-semibold text-base"
                  onClick={() => navigate("/login")}
                >
                  {" "}
                  Login
                </a>
              </span>
            </div>
          </form>
        </div>
        <div className="text-center lg:text-left"></div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Reg;
