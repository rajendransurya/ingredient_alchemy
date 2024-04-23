const dotenv = require('dotenv');
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const session = require('express-session');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');


dotenv.config();
const app = express();
const PORT = 3001;
const bodyParser = require("body-parser");

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Enable CORS for all routes
app.use(cors());

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Registration route
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if the username or email already exists in the database
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Insert the new user into the database with the hashed password
    const newUser = await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, hashedPassword]);

    res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    client.release();

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      req.session.userId=username
      req.session.authenticated = true;
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// SSE Endpoint
router.get("/ingredientrecipe", (req, res) => {

  if (!req.session.authenticated) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const ingredients = req.query.ingredients;
  const mealType = req.query.mealType;
  const cuisine = req.query.cuisine;
  const cookingTime = req.query.cookingTime;
  const complexity = req.query.complexity;

  console.log(req.query)

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Function to send messages
  const sendEvent = (chunk) => {
    let chunkResponse;
    if (chunk.choices[0].finish_reason === "stop") {
      res.write(`data: ${JSON.stringify({ action: "close" })}\n\n`);
    } else {
      if (
        chunk.choices[0].delta.role &&
        chunk.choices[0].delta.role === "assistant"
      ) {
        chunkResponse = {
          action: "start",
        };
      } else {
        chunkResponse = {
          action: "chunk",
          chunk: chunk.choices[0].delta.content,
        };
      }
      res.write(`data: ${JSON.stringify(chunkResponse)}\n\n`);
    }
  };

  const prompt = [];
  prompt.push("Generate a recipe that incorporates the following details:");
  prompt.push(`[Ingredients: ${ingredients}]`);
  prompt.push(`[Meal Type: ${mealType}]`);
  prompt.push(`[Cuisine Preference: ${cuisine}]`);
  prompt.push(`[Cooking Time: ${cookingTime}]`);
  prompt.push(`[Complexity: ${complexity}]`);
  prompt.push(
    "Please provide a recipe, including steps for preparation and cooking. Only use the ingredients provided."
  );
  prompt.push(
    "Provide nutrional values example calories, protein, etc of the ingredients."
  );
  prompt.push(
    "The recipe should highlight the fresh and vibrant flavors of the ingredients."
  );
  prompt.push(
    "Also give the recipe a suiable name in its local language based on cuisine preference. "
  );
  prompt.push(
      "Include the nutritional value per serving."
  );

  const messages = [
    {
      role: "system",
      content: prompt.join(" "),
    },
  ];
  fetchOpenAICompletionsStream(messages, sendEvent);

  // Clear interval and close connection on client disconnect
  req.on("close", () => {
    res.end();
  });
});

router.get("/recipe", (req, res) => {

  if (!req.session.authenticated) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const recipename = req.query.recipename;

  console.log(req.query)

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Function to send messages
  const sendEvent = (chunk) => {
    let chunkResponse;
    if (chunk.choices[0].finish_reason === "stop") {
      res.write(`data: ${JSON.stringify({ action: "close" })}\n\n`);
    } else {
      if (
          chunk.choices[0].delta.role &&
          chunk.choices[0].delta.role === "assistant"
      ) {
        chunkResponse = {
          action: "start",
        };
      } else {
        chunkResponse = {
          action: "chunk",
          chunk: chunk.choices[0].delta.content,
        };
      }
      res.write(`data: ${JSON.stringify(chunkResponse)}\n\n`);
    }
  };

  const prompt = [];
  prompt.push("Give the recipe for the following dish");
  prompt.push(`[Dish: ${recipename}]`);
  prompt.push(
      "Please provide a recipes, including steps for preparation and cooking. Only use the ingredients provided."
  );
  prompt.push(
      "The recipe should highlight the fresh and vibrant flavors of the ingredients."
  );
  prompt.push(
      "Also give the recipe a suitable name in its local language based on cuisine preference. "
  );
  prompt.push(
      "Include the nutritional value per serving."
  );

  const messages = [
    {
      role: "system",
      content: prompt.join(" "),
    },
  ];
  fetchOpenAICompletionsStream(messages, sendEvent);

  // Clear interval and close connection on client disconnect
  req.on("close", () => {
    res.end();
  });
});


async function fetchOpenAICompletionsStream(messages, callback) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  const aiModel = "gpt-3.5-turbo";
  try {
    const completion = await openai.chat.completions.create({
      model: aiModel,
      messages: messages,
      temperature: 1,
      stream: true,
    });

    for await (const chunk of completion) {
      callback(chunk);
    }
  } catch (error) {
    console.error("Error fetching data from OpenAI API:", error);
    throw new Error("Error fetching data from OpenAI API.");
  }
}



router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).json({ message: "Internal server error" });
    } else {
      res.status(200).json({ message: "Logout successful" });
    }
  });
});

app.use("/ingredient_alchemy", router);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
