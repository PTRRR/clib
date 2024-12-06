import { readFileSync } from "fs";
import { join } from "path";
import OpenAI from "openai";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Validate request method
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { script } = req.body;

    // Validate request body
    if (!script || typeof script !== "string") {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const client = new OpenAI({
      apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
    });

    const lib = readFileSync(join(process.cwd(), ".context/lib.txt"), "utf8");

    const examples = readFileSync(
      join(process.cwd(), ".context/lib.txt"),
      "utf8"
    );

    const introductionMessage =
      "You are a computer graphics specialist giving a workshop to graphic designers students that never coded before. You work with PIXI.js V8, html canvas, webgl 2, and a custom made library that abstracts a lot of logic from the students. As they never coded before you will review their code and give back a corrected version of it if you encounter syntax errors or if you see that there is an error in the usage of the library.";
    const libMessage = `Here is the custom library based on PIXI.js V8 and webgl 2: ${lib}`;
    const examplesMessage = `Here are some examples ${examples}`;
    const pseudoCodeMessage =
      "If you encounter pseudo code in comments please come up with the a correct implementation that fits the requirements of the pseudo code, but only if the comments does not already have an implementation.";

    const openaiResponse = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: introductionMessage,
        },
        {
          role: "system",
          content: libMessage,
        },
        {
          role: "system",
          content: examplesMessage,
        },
        {
          role: "system",
          content: pseudoCodeMessage,
        },
        {
          role: "system",
          content:
            "You should give back a JSON response with the following format: { script: {{ the whole script corrected by you }}, message: {{ a message for the student }} }",
        },
        {
          role: "user",
          content: script,
        },
      ],
      temperature: 0,
      response_format: {
        type: "json_object",
      },
    });

    const response = JSON.parse(
      openaiResponse.choices[0]?.message?.content || {}
    );

    return res.status(200).json({
      originalScript: script,
      ...response,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
