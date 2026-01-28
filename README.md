# 🧠 MindSync AI - Holistic Wellness Companion

**MindSync AI** is a secure, full-stack wellness assistant designed to provide mental health support and fitness coaching. Unlike standard chatbots, MindSync features **emotional intelligence**—it detects user sentiment in real-time and dynamically adjusts its personality to be more empathetic during stressful conversations.

The application supports **multimodal interaction** (Voice & Text), maintains long-term memory via a cloud database, and enforces strict security standards through server-side authentication.

---

## 🚀 Key Features

### 🗣️ Multimodal Interaction
* **Voice-to-Text & Text-to-Speech:** Integrated Web Speech API for hands-free, conversational coaching.
* **Auto-Scrolling Interface:** Modern, responsive UI that mimics native messaging apps.

### ❤️ Emotional Intelligence (Sentiment Analysis)
* **Real-Time Emotion Detection:** Uses **Hugging Face Transformers (DistilBERT)** to analyze user input before generating a response.
* **Adaptive Persona:** The backend automatically modifies the **Google Gemini** system prompt. If "Negative" sentiment is detected, the AI shifts to a supportive, therapeutic tone.

### 🔐 Enterprise-Grade Security
* **Secure Authentication:** **Firebase OAuth (Google Sign-In)** ensures every user has a private, isolated session.
* **Backend-for-Frontend (BFF) Architecture:** All sensitive API keys (Gemini, Hugging Face) are hidden in the Node.js server. The client never accesses secrets directly.
* **Role-Based Access:** Firestore database rules restrict data access strictly to the authenticated owner.

### 💾 Persistent Memory
* **Cloud Storage:** All conversations are stored in **Firebase Firestore**, allowing users to review past advice and track their wellness journey over time.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, CSS3 (Flexbox), Web Speech API, Axios
* **Backend:** Node.js, Express.js
* **AI Models:**
    * **Logic:** Google Gemini 1.5 Flash (via `gemini-flash-latest`)
    * **Sentiment:** Hugging Face Inference API (`distilbert-base-uncased`)
* **Database & Auth:** Firebase Firestore, Firebase Authentication, Firebase Admin SDK
* **Tools:** Git, GitHub, RESTful APIs

---

## ⚙️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/yourusername/MindSync-AI.git](https://github.com/yourusername/MindSync-AI.git)
    cd MindSync-AI
    ```

2.  **Setup Server (Backend)**
    ```bash
    cd server
    npm install
    ```
    *Create a `.env` file in the `server` folder:*
    ```env
    GEMINI_API_KEY=your_google_key
    HUGGING_FACE_KEY=your_hf_key
    PORT=5001
    ```
    *(Note: You will also need your `serviceAccountKey.json` from Firebase)*

3.  **Setup Client (Frontend)**
    ```bash
    cd ../client
    npm install
    ```
    *Update `src/firebaseConfig.js` with your public Firebase keys.*

4.  **Run the Application**
    * Terminal 1 (Server): `cd server && npm run dev`
    * Terminal 2 (Client): `cd client && npm start`

---

## 🔮 Future Improvements
* **Rate Limiting:** Implement middleware to prevent API spam.
* **Data Visualization:** Add charts to track user mood trends over time.
* **Mobile App:** Convert the React frontend to React Native.
