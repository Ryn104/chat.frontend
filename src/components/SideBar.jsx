import photos from "../assets/image.js";
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const SideBar = ({ collapsed, toggleCollapsed }) => {
  const navigate = useNavigate()
  const token = localStorage.getItem("authToken");
  const [userName, setUserName] = useState("Loading...");
  const [userImg, setUserImg] = useState("Loading...");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", divisi: "", kelas: "", img: null });

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");// Ganti dengan token yang sesuai

    fetch("http://127.0.0.1:8000/api/user", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        console.log(data)
        setFormData({ name: data.name, email: data.email, divisi: data.divisi, kelas: data.kelas, img: data.img });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, img: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken");
    const formDataToSend = new FormData();
  
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("divisi", formData.divisi);
    formDataToSend.append("kelas", formData.kelas);
    if (formData.img) {
      formDataToSend.append("img", formData.img);
    }
  
    formDataToSend.append("_method", "PUT");
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/${user.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formDataToSend,
      });
  
      if (!response.ok) {
        throw new Error("Failed to update user data");
      }
  
      const data = await response.json();
      console.log("API Response:", data); // Debugging
  
      // Update the user state with the new data
      setUser(data.user);
      setEditing(false);
      toast.success("image updated succesfully");
    } catch (err) {
      toast.error("Update Error:", err.message);
      console.error("Update Error:", err.message); // Debugging
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Logout failed");

      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <div className='border-r border-gray-700 h-[100vh] xl:h-[100vh]'>
      <div className=" flex xl:h-[100vh] xl:w-[4vw] h-[100vh]">
        <div className="flex flex-col justify-between h-[100vh] xl:h-[100vh]">
          <div>
            <div className="self-center xl:ml-3 logo xl:my-4">
              <input id="my-drawer" type="checkbox" className="drawer-toggle" />
              <div className="drawer-content">
                {/* Page content here */}
                <label htmlFor="my-drawer" className="drawer-button">
                  <img src={photos.burger} alt="" className="w-10 xl:w-8 z-10" />
                </label>
              </div>
              <div className="drawer-side">
                <label
                  htmlFor="my-drawer"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                ></label>
                <ul className="menu bg-base-200 text-base-content min-h-full z-40 xl:w-60">
                  {/* Sidebar content here */}
                  <div className=" flex xl:h-[96vh] h-[97vh] z-40 pl-3">
                    <div className="flex flex-col justify-between">
                      <div className="">
                        <div className="logo xl:my-4">
                          <div className="flex">
                            <div className="img flex">
                              <img
                                src={photos.logo}
                                alt=""
                                className="self-center xl:w-8 mr-3 w-10"
                              />
                            </div>
                            <h1 className="font-semibold xl:text-4xl text-4xl">Sent</h1>
                          </div>
                        </div>
                        <div className="flex xl:justify-center mt-10">
                          <button
                            className="xl:w-[7vw]"
                            onClick={() => navigate('/private')} // Set ke Private
                          >
                            <div className="flex pl-1">
                              <img
                                src={photos.privates}
                                alt=""
                                className="xl:h-[25px] self-center mr-2 h-8"
                              />
                              <h1 className="xl:text-2xl text-xl self-center font-semibold">
                                Private
                              </h1>
                            </div>
                          </button>
                        </div>
                        <div className="flex xl:justify-center mt-10">
                          <button
                            className="xl:w-[7vw]"
                            onClick={() => navigate('/group')}  // Set ke Group
                          >
                            <div className="flex pl-1">
                              <img
                                src={photos.group}
                                alt=""
                                className="xl:h-[25px] self-center mr-2 h-8"
                              />
                              <h1 className="xl:text-2xl text-xl self-center font-semibold">
                                Group
                              </h1>
                            </div>
                          </button>
                        </div>
                        <div className="flex xl:justify-center mt-10">
                          <button className="xl:w-[7vw]"
                            onClick={() => navigate('/broadcast')}>
                            <div className="flex pl-1">
                              <img
                                src={photos.broadcast}
                                alt=""
                                className="xl:h-[25px] self-center mr-2 h-8"
                              />
                              <h1 className="xl:text-2xl text-xl self-center font-semibold">
                                Broadcast
                              </h1>
                            </div>
                          </button>
                        </div>
                      </div>
                      <div className="">
                        <div className="flex xl:justify-center">
                          <button className="xl:w-[7vw]"
                          onClick={() => document.getElementById('setting').showModal()}>
                            <div className="flex pl-1">
                              <img
                                src={photos.setting}
                                alt=""
                                className="xl:h-[25px] self-center mr-2 h-8"
                              />
                              <h1 className="xl:text-2xl text-xl self-center font-semibold">
                                Setting
                              </h1>
                            </div>
                          </button>
                        </div>
                        <div className="flex xl:justify-center mt-5">
                          <button className="xl:w-[7vw]"
                          onClick={() => document.getElementById('user').showModal()}>
                            <div className="flex pl-1">
                              <img
                                src={user.img}
                                alt=""
                                className="xl:h-[50px] h-12 w-12 rounded-full self-center mr-2"
                              />
                              <h1 className="xl:text-2xl text-xl text-left self-center font-semibold">
                                {user.name}
                              </h1>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ul>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <button
                className=""
                onClick={() => navigate('/private')} // Set ke Private
              >
                <div className="flex xl:ml-4">
                  <img
                    src={photos.privates}
                    alt=""
                    className="w-8 xl:w-8 self-center"
                  />
                </div>
              </button>
            </div>
            <div className="flex justify-center mt-8">
              <button
                className=""
                onClick={() => navigate('/group')} // Set ke Group
              >
                <div className="flex xl:ml-4">
                  <img
                    src={photos.group}
                    alt=""
                    className="w-8 xl:w-8 self-center"
                  />
                </div>
              </button>
            </div>
            <div className="flex justify-center mt-8">
              <button className=""
                onClick={() => navigate('/broadcast')}>
                <div className="flex xl:ml-4">
                  <img
                    src={photos.broadcast}
                    alt=""
                    className="w-8 xl:w-8 self-center"
                  />
                </div>
              </button>
            </div>
          </div>
          <div>
            <div className="flex justify-center">
              <button className="" onClick={() => document.getElementById('setting').showModal()}>
                <div className="flex xl:ml-4">
                  <img
                    src={photos.setting}
                    alt=""
                    className="w-8 xl:w-8 self-center"
                  />
                </div>
              </button>
            </div>
            <dialog id="setting" className="modal">
              <div className="modal-box overflow-x-hidden xl:h-[36vh]">
                <h3 className="font-bold xl:text-2xl text-center">Setting</h3>
                <div className='flex justify-between mt-5 border-t border-b border-gray-700'>
                  <p className="py-4 xl:text-xl">Notifikasi</p>
                  <label className="swap">
                    {/* this hidden checkbox controls the state */}
                    <input type="checkbox" />

                    {/* volume on icon */}
                    <svg
                      className="swap-on fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      width="35"
                      height="35"
                      viewBox="0 0 24 24">
                      <path
                        d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
                    </svg>

                    {/* volume off icon */}
                    <svg
                      className="swap-off fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      width="35"
                      height="35"
                      viewBox="0 0 24 24">
                      <path
                        d="M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z" />
                    </svg>
                  </label>
                </div>
                <div className='flex justify-between border-b border-gray-700'>
                  <p className='py-4 xl:text-xl'>Theme</p>
                  <div className="dropdown self-center">
                    <div tabIndex={0} role="button" className="btn">
                      Theme
                      <svg
                        width="12px"
                        height="12px"
                        className="h-2 w-2 fill-current opacity-60"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 2048 2048">
                        <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                      </svg>
                    </div>
                    <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl">
                      <li>
                        <input
                          type="radio"
                          name="theme-dropdown"
                          className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                          aria-label="Default"
                          value="default" />
                      </li>
                      <li>
                        <input
                          type="radio"
                          name="theme-dropdown"
                          className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                          aria-label="Retro"
                          value="retro" />
                      </li>
                      <li>
                        <input
                          type="radio"
                          name="theme-dropdown"
                          className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                          aria-label="Cyberpunk"
                          value="cyberpunk" />
                      </li>
                      <li>
                        <input
                          type="radio"
                          name="theme-dropdown"
                          className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                          aria-label="Valentine"
                          value="valentine" />
                      </li>
                      <li>
                        <input
                          type="radio"
                          name="theme-dropdown"
                          className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                          aria-label="Aqua"
                          value="aqua" />
                      </li>
                    </ul>
                  </div>
                </div>
                <div className='flex justify-between border-b border-gray-700'>
                  <p className="py-4 xl:text-xl">Volume</p>
                  <div className='flex'>
                    <input type="range" min={0} max="100" value="80" className="range range-xs self-center" />
                  </div>
                </div>
                <div className='flex justify-between border-b border-gray-700'>
                  <p className='py-4 xl:text-xl'>Log Out</p>
                  <button className="btn btn-outline btn-error self-center" onClick={handleLogout}>Log Out</button>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
            <div className="flex justify-center xl:my-5 xl:ml-4 my-4">
              <button className=""
                onClick={() => document.getElementById('user').showModal()}>
                <div className="flex">
                  <img
                    src={user.img}
                    alt=""
                    className="w-10 xl:w-12 xl:h-12 rounded-full self-center"
                  />
                </div>
              </button>
            </div>
            <dialog id="user" className="modal">
              <div className="modal-box">
                {editing ? (
                  <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      placeholder="Name"
                    />
                    <input
                      type="text"
                      name="divisi"
                      value={formData.divisi}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      placeholder="Divisi"
                    />
                    <input
                      type="text"
                      name="kelas"
                      value={formData.kelas}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      placeholder="Kelas"
                    />
                    <input
                      type="file"
                      name="img"
                      onChange={handleFileChange}
                      className="w-full p-2 border rounded"
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                      Save
                    </button>
                  </form>
                ) : (
                  <>
                    <img
                      src={user.img} // Use the full URL returned by the backend
                      alt="User Avatar"
                      className="w-24 h-24 rounded-full mx-auto"
                    />
                    <h2 className="text-xl font-bold text-center">{user.name}</h2>
                    <p className="text-gray-600 text-center">Email: {user.email}</p>
                    <p className="text-gray-600 text-center">Kelas: {user.kelas}</p>
                    <p className="text-gray-600 text-center">Divisi: {user.divisi}</p>
                    <div className="flex justify-end align-middle gap-3">
                      <div className="flex pt-6">
                        <button
                          onClick={() => setEditing(true)}
                          className="btn self-center"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="modal-action">
                        <form method="dialog" className="flex">
                          {/* if there is a button in form, it will close the modal */}
                          <button className="btn self-center">Close</button>
                        </form>
                      </div>

                    </div>
                  </>
                )}
              </div>
            </dialog>
          </div>
        </div>
      </div>
       {/* Toast Container */}
            <ToastContainer />
    </div>
  );
};

export default SideBar;