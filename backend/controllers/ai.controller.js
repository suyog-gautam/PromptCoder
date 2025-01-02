import { generateResult } from "../services/ai.service.js";
export const generateResultController = async (req, res) => {
  const { prompt } = req.query;
  try {
    const result = await generateResult(prompt);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
