// import { useEffect } from "react";
// import API from "../../services/axios";

// useEffect(() => {
//   API.get("/health")
//     .then((res) => console.log(res.data))
//     .catch(console.error);
// }, []);

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center">

      <h1 className="text-5xl font-bold">

        MERN Job Portal

      </h1>

    </div>
  );
}