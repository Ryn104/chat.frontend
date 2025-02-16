import { useEffect, useState } from "react";

const User = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", divisi: "", kelas: "", img: null });

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");// Ganti dengan token yang sesuai

    fetch("http://api-chat.itclub5.my.id/api/user", {
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
        setFormData({ name: data.name, email: data.email, divisi: data.divisi, kelas: data.kelas, img: null });
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

  const handleSubmit = (e) => {
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
    fetch(`http://api-chat.itclub5.my.id/api/users/${user.id}`, {
     method: "POST", // Laravel's PUT is simulated with POST and _method=PUT
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formDataToSend,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update user data");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data.user);
        setEditing(false);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
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
            src={user.img || "https://via.placeholder.com/150"}
            alt="User Avatar"
            className="w-24 h-24 rounded-full mx-auto"
          />
          <h2 className="text-xl font-bold text-center">{user.name}</h2>
          <p className="text-gray-600 text-center">Email: {user.email}</p>
          <p className="text-gray-600 text-center">Kelas: {user.kelas}</p>
          <p className="text-gray-600 text-center">Divisi: {user.divisi}</p>
          <button
            onClick={() => setEditing(true)}
            className="w-full bg-yellow-500 text-white p-2 rounded mt-4"
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
};

export default User;
