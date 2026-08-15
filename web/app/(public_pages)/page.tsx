// ISR: homepage data sections revalidate every 5 minutes
export const revalidate = 300;

import HomeClient from "./HomeClient";
import ProjectsSection from "./_components/ProjectSection";
import BlogSection from "./_components/BlogSection";
import ExperienceSection from "./_components/ExperienceSection";

export default async function Home() {
  return (
    <HomeClient
      projectsSection={<ProjectsSection />}
      blogSection={<BlogSection />}
      experienceSection={<ExperienceSection />}
    />
  );
}
