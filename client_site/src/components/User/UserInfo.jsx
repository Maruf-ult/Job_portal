import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineEdit } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../common/Layout";

function UserInfo() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const url = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate();

  const getUserDetails = async () => {
    try {
      const res = await axios.post(
        `${url}/api/get-userid`,
        { userId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (error) {
      toast.error("Could not fetch user details");
      console.error(error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, [id]);

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  const profileImage = user.image
    ? `${url}/${user.image.replace("\\", "/")}`
    : "https://via.placeholder.com/100";

  return (
    <Layout>
        <h2
  className="font-bold text-black pl-10"
  style={{
    position: "fixed",
    top: "12px", 
    left: "180px", 
    zIndex: 9999,
    backgroundColor: "white", 
    padding: "0 6px",
  }}
>
        User Profile
      </h2>
     <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-4 border relative">
  {/* Back Button */}
  <button
    className="absolute right-3 top-3 bg-blue-500 px-3 py-1 text-white hover:text-black flex items-center rounded"
    onClick={() => navigate(`/update/user/${id}`)}
  >
    <AiOutlineEdit size={20} />
  </button>

  <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-12 mt-6">
    {/* Profile Image Section */}
    <div className="flex flex-col items-center">
      <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border border-gray-500 flex justify-center items-center">
        <img
          src={profileImage}
          alt="User"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <strong className="mt-2 text-center">{user.name || "Not provided"}</strong>
    </div>

    {/* User Information Section */}
    <div className="flex flex-col w-full space-y-4">
      <h3 className="text-xl font-semibold">Personal Information</h3>
      <p><strong>Email:</strong> {user.email || "Not provided"}</p>
      <p><strong>Phone Number:</strong> {user.phoneNumber || "Not provided"}</p>
      <p><strong>Bio:</strong> {user.bio || "No bio available"}</p>

      <p className="flex flex-wrap items-center gap-2">
        <strong>Skills:</strong>
        {user.skills.length ? (
          user.skills[0].split(", ").map((skill, index) => {
            const colors = [
              "bg-blue-500",
              "bg-green-500",
              "bg-yellow-500",
              "bg-red-500",
              "bg-purple-500",
              "bg-indigo-500",
            ];
            const skillColor = colors[index % colors.length];

            return (
              <span
                key={index}
                className={`px-3 py-1 text-white text-sm rounded-md ${skillColor}`}
              >
                {skill}
              </span>
            );
          })
        ) : (
          <span className="text-gray-500">No skills listed</span>
        )}
      </p>

      {/* <p>
        <strong>Website:</strong>
        <span className="ml-2">
          <a
            href={user.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {user.website || "N/A"}
          </a>
        </span>
      </p> */}

      <div className="flex items-center flex-wrap">
        <strong>Resume:</strong>
        {user.resume ? (
          <a
            href={`${url}/${user.resume.replace("\\", "/")}`}
            className="text-blue-600 underline ml-2 break-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Resume (PDF)
          </a>
        ) : (
          <span className="text-gray-500 ml-2">No resume uploaded</span>
        )}
      </div>
    </div>
  </div>
</div>
    </Layout>
  );
}

export default UserInfo;
