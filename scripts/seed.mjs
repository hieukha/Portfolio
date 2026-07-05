// Populate MongoDB with the current portfolio content.
// Run with: npm run seed   (re-running replaces existing content)
import mongoose from "mongoose";

const { MONGODB_URI } = process.env;
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in .env.local");
  process.exit(1);
}

const S = mongoose.Schema;
const model = (name, def) =>
  mongoose.models[name] || mongoose.model(name, new S(def, { timestamps: true }));

const Intro = model("Intro", {
  name: String, roles: [String], desc: String, image: String, cvFile: String,
  github: String, linkedin: String, email: String, phone: String,
});
const About = model("About", { desc: String, email: String, phone: String, location: String });
const Skill = model("Skill", { category: String, name: String, priority: Number });
const Project = model("Project", {
  name: String, desc: String, tech: [String], repo: String, live: String, image: String, tone: String, priority: Number,
});
const Experience = model("Experience", { role: String, company: String, time: String, desc: String, priority: Number });
const Education = model("Education", { degree: String, school: String, detail: String, time: String, language: String, priority: Number });
const Award = model("Award", { title: String, desc: String, time: String, priority: Number });
const Publication = model("Publication", { title: String, desc: String, href: String, priority: Number });

const skills = [
  ["language", "Python"], ["language", "C"], ["language", "C++"], ["language", "Java"], ["language", "JavaScript"],
  ["ai/ml", "PyTorch"], ["ai/ml", "TensorFlow"], ["ai/ml", "LangChain"], ["ai/ml", "LlamaIndex"],
  ["backend", "Flask"], ["backend", "FastAPI"],
  ["database", "Faiss / Qdrant / Milvus"], ["database", "PostgreSQL"],
  ["tools", "Docker"], ["tools", "Git / CI-CD"],
].map(([category, name], i) => ({ category, name, priority: i }));

const projects = [
  { name: "Vietnamese Real-time Voice Chat", desc: "Audio-based LLM system with browser client and FastAPI WebSocket backend, integrating Whisper STT, Gemini LLM, and fine-tuned Piper TTS. Real-time with avg RTF 0.46 and about 1.7s latency.", tech: ["Whisper", "FastAPI", "Gemini", "Piper TTS"], repo: "https://github.com/hieukha/Audio-based-LLM", live: "", image: "", tone: "from-blue-500 to-cyan-400", priority: 0 },
  { name: "Multimodal Video Retrieval", desc: "Temporal Coherence Framework for video event retrieval using multimodal fusion with CLIP retrieval, PaddleOCR, Whisper, and AutoShot. 95% accuracy on AIC2025 with query latency under 1s.", tech: ["CLIP", "OCR", "Whisper", "Temporal Modeling"], repo: "https://github.com/hieukha/Temporal-Framework-for-Multimodal-Video-Retrieval", live: "", image: "", tone: "from-violet-500 to-fuchsia-400", priority: 1 },
  { name: "ViSL Tool - VSL Dataset Builder", desc: "Full-stack system for automated collection and annotation of Vietnamese Sign Language data, one of the first sentence-level VSL datasets in Vietnam. 99.52% filtering accuracy.", tech: ["FastAPI", "Next.js", "Docker", "WhisperX"], repo: "https://github.com/hieukha/ViSL-Tool-Vietnamese-Sign-Language-Dataset-Builder", live: "", image: "", tone: "from-emerald-500 to-teal-400", priority: 2 },
];

const experiences = [
  { role: "AI Intern", company: "Gon Tech Asia", time: "Mar 2026 - Jun 2026", desc: "Built web search and RAG services for a Multi-Agent System with multi-layer caching; implemented prompt caching across agents and LLM providers with Langfuse tracing, reducing LLM cost by 68.5%.", priority: 0 },
  { role: "AI Intern", company: "VCCorp - Vietnam Communication Corporation", time: "Oct 2025 - Feb 2026", desc: "Built an automated data pipeline for dataset construction and validation, cutting manual data costs by 93.3% and annotation time by 80%; reproduced SOTA sign language translation models.", priority: 1 },
  { role: "AI Intern", company: "SIU AI Lab - Data & AI Center", time: "Jun 2024 - Oct 2024", desc: "R&D on a cancer-support medical chatbot with patient-centered experience; explored advanced RAG and multi-agent techniques for retrieval quality and reliability.", priority: 2 },
];

const awards = [
  { title: "Potential Prize - AI Challenge 2025", desc: "Cross-Segment Coherence Scorer: A Training-Free Temporal Framework for Multimodal Video Retrieval", time: "Nov 2025", priority: 0 },
  { title: "Consolation Prize - 26th Eureka 2024", desc: "Developing a Chatbot to Support the Assessment of Mental Health Conditions in University Students", time: "Jan 2025", priority: 1 },
  { title: "Consolation Prize - AI Challenge 2024", desc: "Enhanced Video Event Retrieval Using Fusion and Temporal Modeling", time: "Nov 2024", priority: 2 },
  { title: "First Prize - SIU Student Research", desc: "Developing a Chatbot to Support Mental Health Assessment for Students at SIU", time: "Apr 2024", priority: 3 },
];

const publications = [
  { title: "VizQuest: Enhanced Video Event Retrieval Using Fusion and Temporal Modeling", desc: "Information and Communication Technology, Springer Nature Singapore, 2025, pp. 155-166.", href: "https://doi.org/10.1007/978-981-96-4291-5_13", priority: 0 },
  { title: "Cross-Segment Coherence Scorer: A Training-Free Temporal Framework for Multimodal Video Retrieval", desc: "Accepted at SoICT 2025 - to appear in conference proceedings.", href: "", priority: 1 },
];

const education = [
  { degree: "BS in Artificial Intelligence", school: "Saigon International University (SIU)", detail: "GPA 3.6/4.0 - Full 4-year Scholarship (100% tuition)", time: "2022 - 2026 | Completed", language: "English (IELTS 6.5)", priority: 0 },
];

await mongoose.connect(MONGODB_URI);

await Promise.all([
  Intro.deleteMany({}), About.deleteMany({}), Skill.deleteMany({}), Project.deleteMany({}),
  Experience.deleteMany({}), Education.deleteMany({}), Award.deleteMany({}), Publication.deleteMany({}),
]);

await Intro.create({
  name: "Nguyen Hieu Kha",
  roles: ["Multi-Agent Systems", "Reliable AI Systems", "LLM Applications"],
  desc: "I build AI systems that move from research ideas to real-world products, including RAG pipelines, multi-agent systems, multimodal retrieval, and real-time voice applications.",
  image: "/portfolio_avatar.png", cvFile: "/NguyenHieuKha_CV.pdf",
  github: "https://github.com/hieukha", linkedin: "https://www.linkedin.com/in/kha-nguyen-9359a8312",
  email: "khanguyenhieu@gmail.com", phone: "+84901796640",
});
await About.create({
  desc: "I am an AI Engineer based in Ho Chi Minh City, Vietnam, with a strong foundation in Natural Language Processing, Computer Vision, and Generative AI. I love turning research ideas into real-world products, from RAG pipelines and multi-agent systems to real-time voice applications. I'm driven by curiosity, collaboration, and the challenge of building impactful technology.",
  email: "khanguyenhieu@gmail.com", phone: "0901 796 640", location: "Ho Chi Minh City, Vietnam",
});
await Skill.insertMany(skills);
await Project.insertMany(projects);
await Experience.insertMany(experiences);
await Education.insertMany(education);
await Award.insertMany(awards);
await Publication.insertMany(publications);

console.log("Seeded portfolio content successfully.");
await mongoose.disconnect();
process.exit(0);
