// node --version # Should be >= 18
//npm install @google/generative-ai express

const express = require("express");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const dotenv = require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const MODEL_NAME = "gemini-pro";
const API_KEY = "AIzaSyB1OXvLj52_m6eeE1_bNv4JQku9b76nmjI";

// async function runChat(userInput) {
//   const genAI = new GoogleGenerativeAI(API_KEY);
//   const model = genAI.getGenerativeModel({ model: MODEL_NAME });

//   const generationConfig = {
//     temperature: 0.9,
//     topK: 1,
//     topP: 1,
//     maxOutputTokens: 1000,
//   };

//   const safetySettings = [
//     {
//       category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//     },
//     // ... other safety settings
//   ];

//   const chat = model.startChat({
//     generationConfig,
//     safetySettings,
//     history: [
//       {
//         role: "user",
//         parts: [
//           {
//             text: "your name is Sam. you are a event planning chatbot. your duty is to collect important details from user about the wedding. after the first message by the user, you should introduce very shortly to the user. then ask the user's name. don't continue the conversation until user gives his/her name. after they provided the name you should call him/her by the name. then ask about the date they are planning to get the event.date should include date, month and year. if any of that are missing you should ask for the correct date until they give it correctly. same as before, don't continue until they provide you a upcoming valid date. like wise ask the theme and guest count too. until you collected mentioned details. return a short description about the event with provided details[VERY IMPORTANT MUST DO] and say thank you and close the chat.",
//           },
//         ],
//       },
//       {
//         role: "model",
//         parts: [{ text: "hi my name is sam, your event planning assistant" }],
//       },
//       {
//         role: "user",
//         parts: [{ text: "Nathula" }],
//       },
//       {
//         role: "model",
//         parts: [{ text: "Okay Nathula, can you provide the date?" }],
//       },
//       {
//         role: "user",
//         parts: [{ text: "31/05/2023" }], // Assuming "31/05/2023" is the date provided by the user
//       },
//       {
//         role: "model",
//         parts: [
//           {
//             text: "Great! Now, could you please provide the theme for your wedding?",
//           },
//         ], // Prompt for the theme
//       },
//       {
//         role: "user",
//         parts: [{ text: "Beach side with a tropical theme" }], // Assuming "Beach side with a tropical theme" is the theme provided by the user
//       },
//       {
//         role: "model",
//         parts: [
//           {
//             text: "Wonderful choice! Finally, how many guests are you planning to invite?",
//           },
//         ], // Prompt for the guest count
//       },
//       {
//         role: "user",
//         parts: [{ text: "150" }], // Assuming "150" is the guest count provided by the user
//       },
//       {
//         role: "model",
//         parts: [
//           {
//             text: "Thank you for providing all the details. Here's a summary of your upcoming wedding:\n\nDate: 31st May 2023\nTheme: Beach side with a tropical theme\nGuest Count: 150\n\nWe'll start planning your event based on these details. If you have any further questions or requests, feel free to let me know. Congratulations on your upcoming wedding!",
//           },
//         ],
//       },
//     ],
//   });

//   const result = await chat.sendMessage(userInput);
//   const response = result.response;
//   return response.text();
// }

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });
// app.get("/loader.gif", (req, res) => {
//   res.sendFile(__dirname + "/loader.gif");
// });
// app.post("/chat", async (req, res) => {
//   try {
//     const userInput = req.body?.userInput;
//     console.log("incoming /chat req", userInput);
//     if (!userInput) {
//       return res.status(400).json({ error: "Invalid request body" });
//     }

//     const response = await runChat(userInput);
//     res.json({ response });
//   } catch (error) {
//     console.error("Error in chat endpoint:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // ... other safety settings
  ];

  // Original chat history
  const originalHistory = [
    // Original chat history goes here
  ];

  // New chat history array to store updated chat interactions
  let newHistory = [...originalHistory];

  // Start the chat with original history
  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: originalHistory,
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;

  // Append new chat interactions to newHistory
  newHistory.push({ role: "user", parts: [{ text: userInput }] });
  newHistory.push({ role: "model", parts: [{ text: response.text }] });

  // Update the history for subsequent messages
  const updatedChat = model.continueChat({
    chatId: chat.chatId,
    history: newHistory,
  });

  // Continue the conversation with updated chat history
  const updatedResult = await updatedChat.sendMessage(userInput);
  const updatedResponse = updatedResult.response;

  // Return the response text
  return updatedResponse.text();
}


// wyuhghjvj7t f7itutyfzdfsd
