import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

function Register() {

  const [form, setForm] = useState({
    firstName:"",
    lastName:"",
    email:"",
    password:"",
    role:"STUDENT"
  });

  const handleSubmit = async (e)=>{
    e.preventDefault();

    try{
      const res = await axiosInstance.post("/common-api/register", form);
      alert(res.data.message);
    }catch(err){
      console.log(err);
      alert("Registration failed");
    }
  };

  return (

    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Register
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="First Name"
            className="bg-gray-200 p-2 rounded-md text-center"
            onChange={(e)=>setForm({...form,firstName:e.target.value})}
          />

          <input
            type="text"
            placeholder="Last Name"
            className="bg-gray-200 p-2 rounded-md text-center"
            onChange={(e)=>setForm({...form,lastName:e.target.value})}
          />

          <input
            type="email"
            placeholder="Email"
            className="bg-gray-200 p-2 rounded-md text-center"
            onChange={(e)=>setForm({...form,email:e.target.value})}
          />

          <input
            type="password"
            placeholder="Password"
            className="bg-gray-200 p-2 rounded-md text-center"
            onChange={(e)=>setForm({...form,password:e.target.value})}
          />

          <select
            className="bg-gray-200 p-2 rounded-md text-center"
            onChange={(e)=>setForm({...form,role:e.target.value})}
          >
            <option value="STUDENT">Student</option>
            <option value="INSTRUCTOR">Instructor</option>
          </select>

          <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition">
            Register
          </button>

        </form>

      </div>

    </div>

  );
}

export default Register;