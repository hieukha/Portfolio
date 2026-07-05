import { ConnectDB } from "@/lib/db";
import Intro from "@/models/intro.model";
import About from "@/models/about.model";
import Skill from "@/models/skill.model";
import Project from "@/models/project.model";
import Experience from "@/models/experience.model";
import Education from "@/models/education.model";
import Award from "@/models/award.model";
import Publication from "@/models/publication.model";
import Blog from "@/models/blog.model";

export type IntroData = {
  name: string;
  roles: string[];
  desc: string;
  image: string;
  cvFile: string;
  github: string;
  linkedin: string;
  email: string;
  phone: string;
};
export type AboutData = { desc: string; email: string; phone: string; location: string };
export type SkillData = { name: string; category: string };
export type ProjectData = {
  name: string;
  desc: string;
  tech: string[];
  repo: string;
  live: string;
  image: string;
  tone: string;
};
export type ExperienceData = { role: string; company: string; time: string; desc: string };
export type EducationData = {
  degree: string;
  school: string;
  detail: string;
  time: string;
  language: string;
};
export type AwardData = { title: string; desc: string; time: string };
export type PublicationData = { title: string; desc: string; href: string };
export type BlogData = {
  _id: string;
  title: string;
  image: string;
  tags: string[];
  content: string;
  createdAt: string;
};

export type PortfolioData = {
  intro: IntroData;
  about: AboutData;
  skills: SkillData[];
  projects: ProjectData[];
  experiences: ExperienceData[];
  education: EducationData[];
  awards: AwardData[];
  publications: PublicationData[];
  blogs: BlogData[];
};

/** Hardcoded fallback content — used when MongoDB is empty or unreachable. */
export const defaultData: PortfolioData = {
  intro: {
    name: "Nguyen Hieu Kha",
    roles: [
      "Multi-Agent Systems",
      "Reliable AI Systems",
      "LLM Applications",
    ],
    desc: "I build AI systems that move from research ideas to real-world products, including RAG pipelines, multi-agent systems, multimodal retrieval, and real-time voice applications.",
    image: "/portfolio_avatar_v2.webp",
    cvFile: "/NguyenHieuKha_CV.pdf",
    github: "https://github.com/hieukha",
    linkedin: "https://www.linkedin.com/in/kha-nguyen-9359a8312",
    email: "khanguyenhieu@gmail.com",
    phone: "+84901796640",
  },
  about: {
    desc: "I am an AI Engineer based in Ho Chi Minh City, Vietnam, with a strong foundation in Natural Language Processing, Computer Vision, and Generative AI. I love turning research ideas into real-world products, from RAG pipelines and multi-agent systems to real-time voice applications. I'm driven by curiosity, collaboration, and the challenge of building impactful technology.",
    email: "khanguyenhieu@gmail.com",
    phone: "0901 796 640",
    location: "Ho Chi Minh City, Vietnam",
  },
  skills: [
    { name: "Python", category: "language" },
    { name: "C", category: "language" },
    { name: "C++", category: "language" },
    { name: "Java", category: "language" },
    { name: "JavaScript", category: "language" },
    { name: "PyTorch", category: "ai/ml" },
    { name: "TensorFlow", category: "ai/ml" },
    { name: "LangChain", category: "ai/ml" },
    { name: "LlamaIndex", category: "ai/ml" },
    { name: "Flask", category: "backend" },
    { name: "FastAPI", category: "backend" },
    { name: "Faiss / Qdrant / Milvus", category: "database" },
    { name: "PostgreSQL", category: "database" },
    { name: "Docker", category: "tools" },
    { name: "Git / CI-CD", category: "tools" },
  ],
  projects: [
    {
      name: "Vietnamese Real-time Voice Chat",
      desc: "Audio-based LLM system with browser client and FastAPI WebSocket backend, integrating Whisper STT, Gemini LLM, and fine-tuned Piper TTS. Real-time with avg RTF 0.46 and about 1.7s latency.",
      tech: ["Whisper", "FastAPI", "Gemini", "Piper TTS"],
      repo: "https://github.com/hieukha/Audio-based-LLM",
      live: "",
      image: "/voice_chat_project.webp",
      tone: "from-blue-500 to-cyan-400",
    },
    {
      name: "Multimodal Video Retrieval",
      desc: "Temporal Coherence Framework for video event retrieval using multimodal fusion with CLIP retrieval, PaddleOCR, Whisper, and AutoShot. 95% accuracy on AIC2025 with query latency under 1s.",
      tech: ["CLIP", "OCR", "Whisper", "Temporal Modeling"],
      repo: "https://github.com/hieukha/Temporal-Framework-for-Multimodal-Video-Retrieval",
      live: "",
      image: "/multimodal_video_retrieval.webp",
      tone: "from-violet-500 to-fuchsia-400",
    },
    {
      name: "ViSL Tool - VSL Dataset Builder",
      desc: "Full-stack system for automated collection and annotation of Vietnamese Sign Language data, one of the first sentence-level VSL datasets in Vietnam. 99.52% filtering accuracy.",
      tech: ["FastAPI", "Next.js", "Docker", "WhisperX"],
      repo: "https://github.com/hieukha/ViSL-Tool-Vietnamese-Sign-Language-Dataset-Builder",
      live: "",
      image: "/visl_tool.webp",
      tone: "from-emerald-500 to-teal-400",
    },
    {
      name: "Face Attendance System",
      desc: "Desktop app for automated attendance tracking using real-time facial recognition, with webcam-based user registration, face embedding storage, and optional anti-spoofing detection.",
      tech: ["Python", "OpenCV", "face_recognition", "Tkinter"],
      repo: "https://github.com/hieukha/Face-attendance-system",
      live: "",
      image: "/face_attendance.webp",
      tone: "from-rose-500 to-orange-400",
    },
  ],
  experiences: [
    {
      role: "AI Intern",
      company: "Gon Tech Asia",
      time: "Mar 2026 - Jun 2026",
      desc: "Built web search and RAG services for a Multi-Agent System with multi-layer caching; implemented prompt caching across agents and LLM providers with Langfuse tracing, reducing LLM cost by 68.5%.",
    },
    {
      role: "AI Intern",
      company: "VCCorp - Vietnam Communication Corporation",
      time: "Oct 2025 - Feb 2026",
      desc: "Built an automated data pipeline for dataset construction and validation, cutting manual data costs by 93.3% and annotation time by 80%; reproduced SOTA sign language translation models.",
    },
    {
      role: "AI Intern",
      company: "SIU AI Lab - Data & AI Center",
      time: "Jun 2024 - Oct 2024",
      desc: "R&D on a cancer-support medical chatbot with patient-centered experience; explored advanced RAG and multi-agent techniques for retrieval quality and reliability.",
    },
  ],
  education: [
    {
      degree: "BS in Artificial Intelligence",
      school: "Saigon International University (SIU)",
      detail: "GPA 3.6/4.0 - Full 4-year Scholarship (100% tuition)",
      time: "2022 - 2026 | Completed",
      language: "English (IELTS 6.5)",
    },
  ],
  awards: [
    {
      title: "Potential Prize - AI Challenge 2025",
      desc: "Cross-Segment Coherence Scorer: A Training-Free Temporal Framework for Multimodal Video Retrieval",
      time: "Nov 2025",
    },
    {
      title: "Consolation Prize - 26th Eureka 2024",
      desc: "Developing a Chatbot to Support the Assessment of Mental Health Conditions in University Students",
      time: "Jan 2025",
    },
    {
      title: "Consolation Prize - AI Challenge 2024",
      desc: "Enhanced Video Event Retrieval Using Fusion and Temporal Modeling",
      time: "Nov 2024",
    },
    {
      title: "First Prize - SIU Student Research",
      desc: "Developing a Chatbot to Support Mental Health Assessment for Students at SIU",
      time: "Apr 2024",
    },
  ],
  publications: [
    {
      title: "VizQuest: Enhanced Video Event Retrieval Using Fusion and Temporal Modeling",
      desc: "Information and Communication Technology, Springer Nature Singapore, 2025, pp. 155-166.",
      href: "https://doi.org/10.1007/978-981-96-4291-5_13",
    },
    {
      title:
        "Cross-Segment Coherence Scorer: A Training-Free Temporal Framework for Multimodal Video Retrieval",
      desc: "Accepted at SoICT 2025 - to appear in conference proceedings.",
      href: "",
    },
  ],
  blogs: [],
};

type Lean = Record<string, unknown>;
const pick = <T,>(rows: Lean[], keys: (keyof T)[]): T[] =>
  rows.map((r) => {
    const o = {} as T;
    for (const k of keys) o[k] = (r as Lean)[k as string] as T[keyof T];
    return o;
  });

/**
 * Reads portfolio content from MongoDB. Any collection that is empty or a
 * connection error falls back to `defaultData`, so the site always renders.
 */
export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    await ConnectDB();
    const [intro, about, skills, projects, experiences, education, awards, publications, blogs] =
      await Promise.all([
        Intro.findOne().sort({ updatedAt: -1 }).lean<Lean>(),
        About.findOne().sort({ updatedAt: -1 }).lean<Lean>(),
        Skill.find().sort({ priority: 1, createdAt: 1 }).lean<Lean[]>(),
        Project.find().sort({ priority: 1, createdAt: 1 }).lean<Lean[]>(),
        Experience.find().sort({ priority: 1, createdAt: 1 }).lean<Lean[]>(),
        Education.find().sort({ priority: 1, createdAt: 1 }).lean<Lean[]>(),
        Award.find().sort({ priority: 1, createdAt: 1 }).lean<Lean[]>(),
        Publication.find().sort({ priority: 1, createdAt: 1 }).lean<Lean[]>(),
        Blog.find().sort({ createdAt: -1 }).lean<Lean[]>(),
      ]);

    return {
      intro: intro
        ? {
            ...defaultData.intro,
            ...pick<IntroData>([intro], [
              "name",
              "roles",
              "desc",
              "image",
              "cvFile",
              "github",
              "linkedin",
              "email",
              "phone",
            ])[0],
          }
        : defaultData.intro,
      about: about
        ? {
            ...defaultData.about,
            ...pick<AboutData>([about], ["desc", "email", "phone", "location"])[0],
          }
        : defaultData.about,
      skills: skills.length
        ? pick<SkillData>(skills, ["name", "category"])
        : defaultData.skills,
      projects: projects.length
        ? pick<ProjectData>(projects, ["name", "desc", "tech", "repo", "live", "image", "tone"])
        : defaultData.projects,
      experiences: experiences.length
        ? pick<ExperienceData>(experiences, ["role", "company", "time", "desc"])
        : defaultData.experiences,
      education: education.length
        ? pick<EducationData>(education, ["degree", "school", "detail", "time", "language"])
        : defaultData.education,
      awards: awards.length
        ? pick<AwardData>(awards, ["title", "desc", "time"])
        : defaultData.awards,
      publications: publications.length
        ? pick<PublicationData>(publications, ["title", "desc", "href"])
        : defaultData.publications,
      blogs: blogs.map((b) => ({
        _id: String(b._id),
        title: b.title as string,
        image: (b.image as string) ?? "",
        tags: (b.tags as string[]) ?? [],
        content: (b.content as string) ?? "",
        createdAt: (b.createdAt as Date).toISOString(),
      })),
    };
  } catch {
    return defaultData;
  }
}

/** Fetches a single blog post by id for the public post page. Returns null if not found or DB unreachable. */
export async function getBlogById(id: string): Promise<BlogData | null> {
  try {
    await ConnectDB();
    const b = await Blog.findById(id).lean<Lean>();
    if (!b) return null;
    return {
      _id: String(b._id),
      title: b.title as string,
      image: (b.image as string) ?? "",
      tags: (b.tags as string[]) ?? [],
      content: (b.content as string) ?? "",
      createdAt: (b.createdAt as Date).toISOString(),
    };
  } catch {
    return null;
  }
}
