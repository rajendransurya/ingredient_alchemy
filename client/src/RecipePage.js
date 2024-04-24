// import React, { useEffect, useRef, useState } from "react";

// const RecipePage = ({ recipeData }) => {
//   const [recipeText, setRecipeText] = useState("");
//   let eventSourceRef = useRef(null);

//   useEffect(() => {
//     closeEventStream(); // Close any existing connection
//   }, []);

//   useEffect(() => {
//     if (recipeData) {
//       closeEventStream(); // Close any existing connection
//       initializeEventStream(); // Open a new connection
//     }
//   }, [recipeData]);

//   const initializeEventStream = () => {
//     const queryParams = new URLSearchParams(recipeData).toString();
//     const url = `http://localhost:3001/recipeStream?${queryParams}`;
//     eventSourceRef.current = new EventSource(url);

//     eventSourceRef.current.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.action === "close") {
//         closeEventStream();
//       } else if (data.action === "chunk") {
//         setRecipeText((prev) => prev + data.chunk);
//       }
//     };

//     eventSourceRef.current.onerror = () => {
//       eventSourceRef.current.close();
//     };
//   };

//   const closeEventStream = () => {
//     if (eventSourceRef.current) {
//       eventSourceRef.current.close();
//       eventSourceRef.current = null;
//     }
//   };

//   return (
//     <div className="recipe-container">
//       <div className="recipe-header">
//         <div className="font-bold text-xl mb-2">Ingredient Alchemy</div>
//       </div>
//       <div className="recipe-text">
//         {recipeText}
//       </div>
//     </div>
//   );
// };

// export default RecipePage;

// import React, { useEffect, useRef, useState } from "react";

// const RecipePage = ({ recipeData, goBack }) => {
//   const [recipeText, setRecipeText] = useState("");
//   let eventSourceRef = useRef(null);

//   useEffect(() => {
//     closeEventStream(); // Close any existing connection
//   }, []);

//   useEffect(() => {
//     if (recipeData) {
//       closeEventStream(); // Close any existing connection
//       initializeEventStream(); // Open a new connection
//     }
//   }, [recipeData]);

//   const initializeEventStream = () => {
//     const queryParams = new URLSearchParams(recipeData).toString();
//     const url = `http://localhost:3001/recipeStream?${queryParams}`;
//     eventSourceRef.current = new EventSource(url);

//     eventSourceRef.current.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.action === "close") {
//         closeEventStream();
//       } else if (data.action === "chunk") {
//         setRecipeText((prev) => prev + data.chunk);
//       }
//     };

//     eventSourceRef.current.onerror = () => {
//       eventSourceRef.current.close();
//     };
//   };

//   const closeEventStream = () => {
//     if (eventSourceRef.current) {
//       eventSourceRef.current.close();
//       eventSourceRef.current = null;
//     }
//   };

  
//   return (
//     <div className="recipe-container">
//       <div className="recipe-header">
//         <div className="font-bold text-xl mb-2">Ingredient Alchemy</div>
//       </div>
//       <div className="recipe-text">{recipeText}</div>
//       <div className="flex justify-center mt-4">
//         <button
//           className="btn"
//           onClick={handleGoBack}
//         >
//           Go Back to Recipe Form
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RecipePage;

import React, { useEffect, useRef, useState } from "react";

const RecipePage = ({ recipeData, goBack, logOut }) => {
  const [recipeText, setRecipeText] = useState("");
  let eventSourceRef = useRef(null);

  useEffect(() => {
    closeEventStream(); // Close any existing connection
  }, []);

  useEffect(() => {
    if (recipeData) {
      closeEventStream(); // Close any existing connection
      initializeEventStream(); // Open a new connection
    }
  }, [recipeData]);

  const initializeEventStream = () => {
    const queryParams = new URLSearchParams(recipeData).toString();
    // const url = "http://localhost:3001/ingredient_alchemy/ingredientrecipe?${queryParams}";
    const url = "http://18.223.182.235:3001/ingredient_alchemy/ingredientrecipe?${queryParams}";

    eventSourceRef.current = new EventSource(url);

    eventSourceRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.action === "close") {
        closeEventStream();
      } else if (data.action === "chunk") {
        setRecipeText((prev) => prev + data.chunk);
      }
    };

    eventSourceRef.current.onerror = () => {
      eventSourceRef.current.close();
    };
  };

  const closeEventStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  const handleGoBack = () => {
    goBack();
  };

  // const handleLogout = () => {
  //   logOut();
  // };

  const handleLogout = async () => {
    try {
      // const response = await fetch("http://localhost:3001/ingredient_alchemy/logout", {
      const response = await fetch("http://18.223.182.235:3001/ingredient_alchemy/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        logOut();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };


  const handleRegenerate = () => {
    // Make a new API call with the same input data
    initializeEventStream();
    setRecipeText(""); // Clear the existing recipe text
  };

  return (
    <div className="recipe-container">
      <div className="recipe-header">
        <div className="font-bold text-xl mb-2">Ingredient Alchemy</div>
      </div>
      <div className="recipe-text">{recipeText}</div>
      <div className="flex justify-center mt-4">
        <button className="btn mr-2" onClick={handleRegenerate}>
          Regenerate Recipe
        </button>
        <button className="btn" onClick={handleGoBack}>
          Go Back to Recipe Form
        </button>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default RecipePage;





