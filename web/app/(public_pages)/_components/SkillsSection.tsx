"use client";

import { motion } from "framer-motion";
import {
  defaultViewport,
  headingRevealVariants,
  scaleInVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animation-utils";

const cardItem = staggerItemVariants(16);
const skillItem = staggerItemVariants(8);

const skills: Record<string, string[]> = {
  Frontend: [
    "React",
    "Next.js",
    "Redux.js / Redux Toolkit",
    "RTK Query",
    "React(TanStack) Query",
    "TanStack Router",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
  ],
  Backend: [
    "Node.js",
    "NestJS",
    "Express",
    "Python",
    "FastAPI",
    "Apache Kafka",
    "Redis",
    "TypeORM",
    "PrismaORM",
    "PostgreSQL",
    "MongoDB",
    "OAuth",
    "JWT",
  ],
  Tools: [
    "Git",
    "Docker",
    "AWS",
    "Vercel",
    "GitHub Actions",
    "Postman",
    "Linux",
  ],
  Other: ["REST APIs", "GraphQL", "WebSockets", "Testing", "CI/CD"],
};

export default function SkillsSection() {
  return (
    <section className="relative border-t border-zinc-800 px-6 py-24">
      <div className="container mx-auto max-w-6xl">
        {/* Section heading */}
        <motion.div
          className="mb-12"
          variants={headingRevealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          <span className="font-mono text-sm text-emerald-500">
            <span className="opacity-60">$ </span>ls skills/
          </span>
          <h2 className="mt-2 text-4xl font-bold text-white">
            Skills &amp; Technologies
          </h2>
        </motion.div>

        {/* Cards grid — staggered */}
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainerVariants(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          {Object.entries(skills).map(([category, items]) => (
            <motion.div
              key={category}
              variants={cardItem}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6"
            >
              <h3 className="mb-4 font-mono text-sm text-emerald-500">
                {category}/
              </h3>

              {/* Skill list — staggered inside each card */}
              <motion.ul
                className="space-y-2"
                variants={staggerContainerVariants(0.06, 0.15)}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
              >
                {items.map((skill) => (
                  <motion.li
                    key={skill}
                    variants={skillItem}
                    className="flex items-center gap-2 text-sm text-zinc-400"
                  >
                    <motion.span
                      className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                      variants={scaleInVariants}
                    />
                    {skill}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
