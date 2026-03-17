import { useParams } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";

function CourseDetails(){

const {id} = useParams()

const enroll = async()=>{

await axiosInstance.post("/user-api/enroll-course",{
courseId:id
})

alert("Enrolled successfully")

}

return(

<div className="p-10">

<button
onClick={enroll}
className="bg-purple-500 text-white p-2"
>
Enroll Course
</button>

</div>

)

}

export default CourseDetails