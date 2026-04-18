const MMSEQuestion = require("../models/mmseQuestionModel");
const MMSE_Result = require("../models/mmseResultModel");

// -------- GET QUESTIONS --------
const getQuestions = async (req, res) => {
  try {
    const questions = await MMSEQuestion.find();
    res.json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------- ADD QUESTIONS --------
const addQuestions = async (req, res) => {
  try {
    const saved = await MMSEQuestion.insertMany(req.body);
    res.json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------- DELETE ALL --------
const deleteAllQuestions = async (req, res) => {
  try {
    await MMSEQuestion.deleteMany({});
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------- SUBMIT TEST (FINAL FIXED) --------
const submitTest = async (req, res) => {
  try {
    const userId = req.userId;
    const { answers } = req.body;

    let totalScore = 0;

    const now = new Date();

    const months = [
      "january","february","march","april","may","june",
      "july","august","september","october","november","december"
    ];

    const days = [
      "sunday","monday","tuesday","wednesday",
      "thursday","friday","saturday"
    ];

    for (let item of answers) {
      const q = await MMSEQuestion.findById(item.questionId);
      if (!q) continue;

      let ans = (item.answer || "").toLowerCase().trim();

      console.log("Q:", q.question);
      console.log("User:", ans);

      // -------- YEAR --------
      if (q.type === "year") {
        if (ans === now.getFullYear().toString()) totalScore++;
      }

      // -------- MONTH --------
      else if (q.type === "month") {
        if (ans === months[now.getMonth()]) totalScore++;
      }

      // -------- DATE --------
      else if (q.type === "date") {
        if (ans === now.getDate().toString()) totalScore++;
      }

      // -------- DAY --------
      else if (q.type === "day") {
        if (ans === days[now.getDay()]) totalScore++;
      }

      // -------- SEASON --------
      else if (q.type === "season") {
        let m = now.getMonth() + 1;
        let season = [12,1,2].includes(m) ? "winter"
          : [3,4,5].includes(m) ? "summer"
          : [6,7,8].includes(m) ? "monsoon"
          : "autumn";

        if (ans === season) totalScore++;
      }

      // -------- MCQ --------
      else if (q.type === "mcq") {
        if (ans && ans === q.answer.toLowerCase()) {
          totalScore += q.marks || 1;
        }
      }

      // -------- EXACT / IMAGE --------
      else if (q.type === "exact" || q.type === "image") {
        if (ans && ans === q.answer.toLowerCase()) {
          totalScore += q.marks || 1;
        }
      }

      // -------- RECALL --------
      else if (q.type === "recall") {
        let correct = q.answers.map(w => w.toLowerCase());
        let userWords = ans.split(/[\s,]+/);

        let matched = new Set();

        for (let word of userWords) {
          if (correct.includes(word)) {
            matched.add(word);
          }
        }

        totalScore += matched.size;
      }

      // -------- TEXT --------
      else if (q.type === "text") {
        if (ans.length > 2) {
          totalScore += q.marks || 1;
        }
      }

      // -------- ACTION --------
      else if (q.type === "action") {
        totalScore += q.marks || 1;
      }
    }

    // -------- STAGE --------
    let stage = "";
    if (totalScore >= 24) stage = "normal";
    else if (totalScore >= 18) stage = "mild_cognitive_impairment";
    else stage = "severe_impairment";

    // -------- SAVE --------
    await MMSE_Result.create({
      userId,
      totalScore,
      stage
    });

    // -------- RESPONSE --------
    res.json({
      success: true,
      totalScore,
      stage
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getLatestmmse = async (req, res) => {
  try {
    const userId = req.userId;
    const latestResult = await MMSE_Result.findOne({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: latestResult });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ EXPORT (OUTSIDE FUNCTION)
module.exports = {
  getQuestions,
  addQuestions,
  submitTest,
  deleteAllQuestions,
  getLatestmmse
};