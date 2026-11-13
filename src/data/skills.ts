export type SkillCategory = "language" | "database" | "platform";

export type Skill = {
  name: string;
  src: string;
  category: SkillCategory;
  /** Most-used technologies get a larger circle. */
  major?: boolean;
};

export const CATEGORIES: { key: SkillCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "language", label: "Language" },
  { key: "database", label: "Database" },
  { key: "platform", label: "Platform" },
];

export const SKILLS: Skill[] = [
  { name: "PHP", src: "/images/pg/PHP.webp", category: "language", major: true },
  { name: "Java", src: "/images/pg/Java.webp", category: "language", major: true },
  { name: "C#", src: "/images/pg/csharp.webp", category: "language", major: true },
  { name: "TypeScript", src: "/images/pg/typescript.webp", category: "language", major: true },
  { name: "JavaScript", src: "/images/pg/js.webp", category: "language", major: true },
  { name: "Python", src: "/images/pg/python.webp", category: "language" },
  { name: "Ruby", src: "/images/pg/ruby.webp", category: "language" },
  { name: "Go", src: "/images/pg/go.webp", category: "language" },
  { name: "Swift", src: "/images/pg/swift.webp", category: "language" },
  { name: "C++", src: "/images/pg/C++.webp", category: "language" },
  { name: "HTML5", src: "/images/pg/html5.webp", category: "language" },
  { name: "CSS3", src: "/images/pg/css3.webp", category: "language" },
  { name: "Visual Basic", src: "/images/pg/VB.webp", category: "language" },

  { name: "Aurora", src: "/images/db/aws-aurora.webp", category: "database", major: true },
  { name: "MySQL", src: "/images/db/mysql.webp", category: "database", major: true },
  { name: "PostgreSQL", src: "/images/db/postgresql.webp", category: "database", major: true },
  { name: "Oracle", src: "/images/db/oracledb.webp", category: "database" },
  { name: "SQL Server", src: "/images/db/SQLServer.webp", category: "database" },
  { name: "DB2", src: "/images/db/db2.webp", category: "database" },

  { name: "AWS", src: "/images/os/aws.webp", category: "platform", major: true },
  { name: "Linux", src: "/images/os/centOS.webp", category: "platform", major: true },
  { name: "Red Hat", src: "/images/os/redhat.webp", category: "platform" },
  { name: "Windows", src: "/images/os/windows.webp", category: "platform" },
  { name: "macOS", src: "/images/os/apple.webp", category: "platform" },
  { name: "iOS", src: "/images/os/apple.webp", category: "platform" },
  { name: "Android", src: "/images/os/android.webp", category: "platform" },
  { name: "Solaris", src: "/images/os/Solaris.webp", category: "platform" },
  { name: "AIX", src: "/images/os/aix.webp", category: "platform" },
];
