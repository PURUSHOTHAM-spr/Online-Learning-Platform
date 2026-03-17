import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

function CreateCourse(){

const [form,setForm] = useState({
title:"",
description:"",
category:"",
courseLevel:"Beginner"
})

const createCourse = async(e)=>{
e.preventDefault()

const res = await axiosInstance.post(
"/instructor-api/create-course",
form
)

alert(res.data.message)

}

return(

<form onSubmit={createCourse} className="flex flex-col gap-3 p-10 w-96">

<input placeholder="Title"
className="border p-2"
onChange={(e)=>setForm({...form,title:e.target.value})}
/>

<input placeholder="Description"
className="border p-2"
onChange={(e)=>setForm({...form,description:e.target.value})}
/>

<input placeholder="Category"
className="border p-2"
onChange={(e)=>setForm({...form,category:e.target.value})}
/>

<select
className="border p-2"
onChange={(e)=>setForm({...form,courseLevel:e.target.value})}
>
<option>Beginner</option>
<option>Intermediate</option>
<option>Advanced</option>
</select>

<button className="bg-blue-600 text-white p-2">
Create Course
</button>

</form>

)

}

export default CreateCourse;