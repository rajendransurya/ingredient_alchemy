// import React, { useState } from "react";
// import "./App.css";
// import RecipeCard from "./RecipeCard";
// import RecipePage from "./RecipePage";

// function App() {
//   const [currentPage, setCurrentPage] = useState("RecipeCard");
//   const [recipeData, setRecipeData] = useState(null);

//   const renderPage = () => {
//     switch (currentPage) {
//       case "RecipeCard":
//         return <RecipeCard onSubmit={onSubmit} />;
//       case "RecipePage":
//         return <RecipePage recipeData={recipeData} />;
//       default:
//         return <RecipeCard onSubmit={onSubmit} />;
//     }
//   };

//   const onSubmit = (data) => {
//     setRecipeData(data);
//     setCurrentPage("RecipePage");
//   };

//   return (
//     <div className="App">
//       {/* <div className="flex flex-row h-full my-4 gap-2 justify-center">
//         {renderPage()}
//       </div> */}
//     <div className="flex-container h-full my-4 gap-2 justify-center">
//       {renderPage()}
//     </div>
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import "./App.css";
import RecipeCard from "./RecipeCard";
import RecipePage from "./RecipePage";

function App() {
  const [currentPage, setCurrentPage] = useState("RecipeCard");
  const [recipeData, setRecipeData] = useState(null);

  const renderPage = () => {
    switch (currentPage) {
      case "RecipeCard":
        return <RecipeCard onSubmit={onSubmit} />;
      case "RecipePage":
        return <RecipePage recipeData={recipeData} goBack={goBack} />;
      default:
        return <RecipeCard onSubmit={onSubmit} />;
    }
  };

  const onSubmit = (data) => {
    setRecipeData(data);
    setCurrentPage("RecipePage");
  };

  const goBack = () => {
    setCurrentPage("RecipeCard");
  };

  return (
    <div className="App">
      <div className="flex-container h-full my-4 gap-2 justify-center">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;

// import React, { useState } from "react";
// import "./App.css";
// import RecipeCard from "./RecipeCard";
// import RecipePage from "./RecipePage";

// function App() {
//   const [currentPage, setCurrentPage] = useState("RecipeCard");
//   const [recipeData, setRecipeData] = useState(null);

//   const renderPage = () => {
//     switch (currentPage) {
//       case "RecipeCard":
//         return <RecipeCard onSubmit={onSubmit} />;
//       case "RecipePage":
//         return <RecipePage recipeData={recipeData} goBack={goBack} onSubmit={onSubmit} />;
//       default:
//         return <RecipeCard onSubmit={onSubmit} />;
//     }
//   };

//   const onSubmit = (data) => {
//     setRecipeData(data);
//     setCurrentPage("RecipePage");
//   };

//   const goBack = () => {
//     setCurrentPage("RecipeCard");
//   };

//   return (
//     <div className="App">
//       <div className="flex-container h-full my-4 gap-2 justify-center">
//         {renderPage()}
//       </div>
//     </div>
//   );
// }

// export default App;


  
