"use client";

import { motion } from "framer-motion";
import {
  defaultViewport,
  fadeLeftVariants,
  fadeRightVariants,
  headingRevealVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animation-utils";

const statItem = staggerItemVariants(12);

const stats = [
  { key: '"experience":', value: '"5+ years"' },
  { key: '"projects":', value: '"50+ completed"' },
  { key: '"clients":', value: '"30+ satisfied"' },
  { key: '"coffee":', value: '"∞ cups"' },
];

export default function AboutSection() {
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
            <span className="opacity-60">$ </span>whoami
          </span>
          <h2 className="mt-2 text-4xl font-bold text-white">About Me</h2>
        </motion.div>

        <div className="grid gap-12 md:grid-cols-2">
          {/* Bio text — slides from left */}
          <motion.div
            className="space-y-4 text-zinc-400"
            variants={fadeLeftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            <p>
              {`I'm a passionate developer with 5+ years of experience building
              web applications that users love. My journey started with a simple
              "Hello World" and evolved into architecting complex distributed
              systems.`}
            </p>
            <p>
              {`When I'm not coding, you'll find me contributing to open source,
              writing technical articles, or exploring new technologies. I
              believe in continuous learning and sharing knowledge with the
              community.`}
            </p>
            <p>
              Currently focused on building scalable applications with React,
              Next.js, and Node.js, while exploring the exciting world of AI and
              machine learning.
            </p>
          </motion.div>

          {/* Stats card — slides from right, children stagger in */}
          <motion.div
            className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6"
            variants={fadeRightVariants}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            {/* macOS-style dots */}
            <div className="mb-4 flex items-center gap-2 text-xs">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-zinc-600">stats.json</span>
            </div>

            {/* Staggered stat rows */}
            <motion.div
              className="space-y-3 font-mono text-sm"
              variants={staggerContainerVariants(0.12, 0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
            >
              {stats.map(({ key, value }) => (
                <motion.div
                  key={key}
                  className="flex justify-between"
                  variants={statItem}
                >
                  <span className="text-emerald-500">{key}</span>
                  <span className="text-white">{value}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
