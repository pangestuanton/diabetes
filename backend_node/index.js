const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

/**
 * Diabetes Risk Prediction Logic (Simplified Logistic Regression Weights)
 * Based on Pima Indians Diabetes Dataset analysis.
 * Formula: z = intercept + w1*pregnancies + w2*glucose + ...
 * probability = 1 / (1 + exp(-z))
 */
const predictDiabetes = (data) => {
    // These weights are approximations for demonstration purposes
    const weights = {
        intercept: -8.4,
        pregnancies: 0.12,
        glucose: 0.035,
        bloodPressure: -0.013,
        skinThickness: 0.0006,
        insulin: -0.001,
        bmi: 0.089,
        dpf: 0.94,
        age: 0.014
    };

    let z = weights.intercept +
        (weights.pregnancies * data.pregnancies) +
        (weights.glucose * data.glucose) +
        (weights.bloodPressure * data.blood_pressure) +
        (weights.skinThickness * data.skin_thickness) +
        (weights.insulin * data.insulin) +
        (weights.bmi * data.bmi) +
        (weights.dpf * data.diabetes_pedigree_function) +
        (weights.age * data.age);

    const probability = 1 / (1 + Math.exp(-z));
    const prediction = probability > 0.5 ? "High Risk" : "Low Risk";

    // Feature importance approximation
    const factors = [];
    if (data.glucose > 140) factors.push("Glucose");
    if (data.bmi > 30) factors.push("BMI");
    if (data.age > 45) factors.push("Age");
    if (data.pregnancies > 5) factors.push("Pregnancies");
    
    // Fallback if no high factors detected but risk is high
    if (prediction === "High Risk" && factors.length === 0) {
        factors.push("Glucose", "BMI");
    }

    return {
        prediction,
        confidence: probability > 0.5 ? probability : 1 - probability,
        main_factors: factors.length > 0 ? factors.slice(0, 3) : ["Metrik Kesehatan Umum"],
        message: prediction === "High Risk" 
            ? "Model memperkirakan risiko diabetes yang tinggi. Mohon segera konsultasikan dengan dokter." 
            : "Model memperkirakan risiko diabetes yang rendah. Tetap jaga pola makan sehat."
    };
};

app.post('/predict', (req, res) => {
    try {
        const result = predictDiabetes(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Gagal memproses prediksi" });
    }
});

app.post('/chat', async (req, res) => {
    try {
        if (!process.env.OPENROUTER_API_KEY) {
            // Fallback for demo if no key is provided, but prompt user to set it
            return res.json({ reply: "Maaf, fitur AI belum diaktifkan oleh admin (OPENROUTER_API_KEY belum diatur)." });
        }

        const { message, history } = req.body;

        // Convert frontend history to OpenRouter (OpenAI-compatible) format
        const formattedHistory = history ? history.filter((msg) => msg.role !== 'bot' || msg.content !== 'Halo! Saya asisten AI kesehatan Anda. Ada yang ingin Anda tanyakan tentang risiko diabetes atau pola hidup sehat?').map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content,
        })) : [];

        const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "DiaPredict",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b:free", // Updated per user request
                messages: [
                    {
                        role: "system",
                        content: "Anda adalah asisten medis virtual yang berfokus pada diabetes, pencegahannya, pola makan, dan gaya hidup sehat. Jawab pertanyaan pengguna dengan ramah, ringkas, berempati, dan menggunakan bahasa Indonesia. Ingatkan selalu bahwa Anda bukan pengganti dokter profesional. DILARANG KERAS menggunakan format markdown seperti tanda bintang (*) untuk membuat teks tebal atau daftar bullet. Jawab dengan teks biasa (plain text)."
                    },
                    ...formattedHistory,
                    {
                        role: "user",
                        content: message
                    }
                ]
            })
        });

        if (!openRouterResponse.ok) {
            const errData = await openRouterResponse.text();
            throw new Error(`OpenRouter API Error: ${openRouterResponse.status} ${errData}`);
        }

        const data = await openRouterResponse.json();
        let responseText = data.choices[0]?.message?.content || "Maaf, saya tidak bisa memberikan jawaban saat ini.";
        
        // Remove any asterisks just in case the AI still generates them
        responseText = responseText.replace(/\*/g, '');

        res.json({ reply: responseText });
    } catch (error) {
        console.error("AI Chat Error:", error);
        res.status(500).json({ error: "Gagal memproses pesan AI", reply: "Maaf, terjadi kesalahan saat menghubungi server AI." });
    }
});

app.get('/', (req, res) => {
    res.send('Diabetes Risk Prediction Node.js API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
