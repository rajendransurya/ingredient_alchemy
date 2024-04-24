import React, { useState } from "react";

// const LoginPage = ({ onLogin }) => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = () => {
//     if (username === "admin" && password === "password") {
//       onLogin();
//     } else {
//       setError("Invalid username or password");
//     }
//   };

//   return (
//     <div className="w-[400px] border rounded-lg overflow-hidden shadow-lg">
//       <div className="px-6 py-4 bg-blue-500 text-white">
//         <div className="font-bold text-xl mb-2">Ingredient Alchemy</div>
//       </div>
//       <div className="px-6 py-4">
//         <div className="font-bold text-xl mb-2">Login</div>
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="username"
//           >
//             Username
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="username"
//             type="text"
//             placeholder="Enter username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//         </div>
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="password"
//           >
//             Password
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
//             id="password"
//             type="password"
//             placeholder="Enter password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         {error && <p className="text-red-500 text-xs italic">{error}</p>}
//         <div className="px-6 py-4">
//           <button
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             type="button"
//             onClick={handleSubmit}
//           >
//             Login
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
  
    const handleSubmit = async () => {
      try {
        const response = await fetch("http://localhost:3001/ingredient_alchemy/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          onLogin();
        } else {
          setError(data.message);
        }
      } catch (err) {
          setError(err.toString())
          setError("Error logging in");
      }
    };
  
    return (
      <div className="w-[400px] border rounded-lg overflow-hidden shadow-lg">
        <div className="px-6 py-4 bg-blue-500 text-white">
          <div className="font-bold text-xl mb-2">Ingredient Alchemy</div>
        </div>
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">Login</div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          <div className="px-6 py-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleSubmit}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  };
  

export default LoginPage;
