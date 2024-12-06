import { readFileSync } from "fs";
import { join } from "path";
import OpenAI from "openai";

const SYSTEM_MESSAGES = {
  introduction:
    "You are a computer graphics specialist giving a workshop to graphic designers students that never coded before. You work with PIXI.js V8, html canvas, webgl 2, and a custom made library that abstracts a lot of logic from the students. As they never coded before you will review their code and give back a corrected version of it if you encounter syntax errors or if you see that there is an error in the usage of the library.",
  pseudoCode:
    "If you encounter pseudo code in comments please come up with the a correct implementation that fits the requirements of the pseudo code, but only if the comments does not already have an implementation.",
  responseFormat:
    "You should give back a JSON response with the following format: { script: {{ the whole content of the javascript script corrected by you }}, message: {{ a message for the student }} }",
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      const script = readFileSync(
        join(process.cwd(), "autopilot", "script.js"),
        "utf-8"
      );
      res.setHeader("Content-Type", "application/javascript");
      return res.status(200).send(script);
    } catch (error) {
      console.error("Error reading script file:", error);
      return res.status(500).json({ message: "Error loading script file" });
    }
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { script } = req.body;
    if (!script || typeof script !== "string") {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const [lib, examples] = await Promise.all([
      readFileSync(join(process.cwd(), ".context/lib.txt"), "utf8"),
      readFileSync(join(process.cwd(), ".context/examples.txt"), "utf8"),
    ]);

    const openaiResponse = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_MESSAGES.introduction },
        {
          role: "system",
          content: `Here is the custom library based on PIXI.js V8 and webgl 2: ${lib}`,
        },
        { role: "system", content: `Here are some examples ${examples}` },
        { role: "system", content: SYSTEM_MESSAGES.pseudoCode },
        { role: "system", content: SYSTEM_MESSAGES.responseFormat },
        { role: "user", content: script },
      ],
      temperature: 0,
      response_format: { type: "json_object" },
    });

    const response = JSON.parse(
      openaiResponse.choices[0]?.message?.content || "{}"
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
