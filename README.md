# 🎙️ AutoMeet

**AI-powered meeting recorder and transcription app** that automatically transcribes your meetings and generates intelligent summaries using OpenAI Whisper and LLM technology.

![AutoMeet Dashboard](/.github/images/automeet_hero.png)

## ✨ Features

### 🎯 Core Functionality
- **High-Quality Audio Recording** - Crystal clear audio capture with noise suppression and echo cancellation
- **AI-Powered Transcription** - Automatic transcription using OpenAI Whisper API with multi-language support
- **Smart Summaries** - Generate concise meeting summaries using OpenAI GPT or Google Gemini
- **Real-Time Processing** - Fast transcription and summary generation after recording

### 📊 Meeting Management
- **Meeting History** - Browse all your recorded meetings in an organized grid
- **Rename & Delete** - Easily manage your meetings with dropdown actions
- **Email Summaries** - Send meeting transcripts and summaries via email using Resend
- **Analytics Dashboard** - Track your meeting statistics and insights

### 🎨 Modern UI/UX
- **Responsive Design** - Fully optimized for desktop, tablet, and mobile devices
- **Dark Mode Support** - Beautiful dark theme for comfortable viewing
- **Minimalist Interface** - Clean, professional design with glassmorphism effects
- **Real-Time Feedback** - Live recording indicators and timer displays

![Recording Interface](/.github/images/recording_interface.png)

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: [Turso](https://turso.tech/) (SQLite)
- **ORM**: [Drizzle](https://orm.drizzle.team/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **AI Services**:
  - [OpenAI Whisper](https://openai.com/research/whisper) - Transcription
  - [OpenAI GPT-4o-mini](https://openai.com/) - Summarization
  - [Google Gemini](https://ai.google.dev/) - Alternative summarization
- **Email**: [Resend](https://resend.com/)
- **Audio Recording**: react-media-recorder

## 📋 Prerequisites

- Node.js 18+ and npm
- OpenAI API key (required for transcription)
- Turso database (free tier available)
- (Optional) Google Gemini API key for alternative summarization
- (Optional) Resend API key for email functionality

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/AutoMeet.git
   cd AutoMeet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database (Turso)
   TURSO_DATABASE_URL=your_turso_database_url
   TURSO_AUTH_TOKEN=your_turso_auth_token
   
   # Authentication
   AUTH_SECRET=your_random_secret_key
   
   # Optional: Email (Resend)
   RESEND_API_KEY=your_resend_api_key
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### First Time Setup

1. **Sign up** - Create an account on the login page
2. **Configure API Keys** - Add your OpenAI API key (and optionally Gemini) in Settings
3. **Start Recording** - Go to the Dashboard and click "Start Recording"

### Recording a Meeting

1. Click **"Start Recording"** on the dashboard
2. Speak clearly into your microphone
3. Use **Pause/Resume** to control the recording
4. Click **"Stop & Process"** when finished
5. Wait for AI transcription and summarization
6. View your meeting in the Meeting History

![Meeting History](/.github/images/meeting_history.png)

### Managing Meetings

- **View Details** - Click on any meeting card to see full transcript and summary
- **Rename** - Use the three-dot menu to rename meetings
- **Delete** - Remove meetings you no longer need
- **Email** - Send summaries directly via email
- **Analytics** - Track your meeting statistics

## 🌍 Multi-Language Support

AutoMeet supports multiple languages including:
- English
- Spanish
- Catalan
- And many more supported by OpenAI Whisper

The app automatically detects the language and generates summaries in the same language as the transcript.

## 📱 Mobile Support

AutoMeet is fully responsive and optimized for mobile devices:
- Touch-friendly buttons and controls
- Adaptive layouts for small screens
- Full functionality on smartphones and tablets

## 🔒 Security & Privacy

- **Secure Authentication** - Password hashing with bcrypt
- **User Isolation** - Each user can only access their own meetings
- **API Key Protection** - Keys stored securely in the database
- **HTTPS Ready** - Production-ready security configuration

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- OpenAI for Whisper and GPT APIs
- Google for Gemini API
- Vercel for Next.js framework
- Turso for the database platform

---

**Built with ❤️ using Next.js and AI**
