const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.lessonActivity.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // -----------------------
  // Create Course
  // -----------------------
  const course = await prisma.course.create({
    data: {
      title: "Programming Fundamentals",
      description: "Core programming concepts"
    }
  });

  // -----------------------
  // Create Lessons
  // -----------------------
  const lessons = [];

  const difficulties = [
    "easy","easy","easy","medium","medium","medium",
    "hard","hard","hard","easy","medium","hard"
  ];

  for (let i = 0; i < 12; i++) {
    const lesson = await prisma.lesson.create({
      data: {
        title: `Lesson ${i + 1}`,
        contentLength: 10 + (i % 3) * 5, // 10, 15, 20 mins
        difficultyLevel: difficulties[i],
        courseId: course.id
      }
    });
    lessons.push(lesson);
  }

  // -----------------------
  // Create Learners
  // -----------------------
  const learners = [];

  for (let i = 0; i < 10; i++) {
    const learner = await prisma.user.create({
      data: {
        name: `Student ${i + 1}`,
        email: `student${i + 1}@example.com`
      }
    });
    learners.push(learner);
  }

  // -----------------------
  // Activity Patterns
  // -----------------------

  for (let i = 0; i < learners.length; i++) {
    const learner = learners[i];

    for (let j = 0; j < lessons.length; j++) {
      const lesson = lessons[j];

      let timeSpent;
      let completed = true;

      const expected = lesson.contentLength * 60;

      // Pattern logic
      switch (i) {

        // Healthy learners (1–2)
        case 0:
        case 1:
          timeSpent = expected * (0.8 + Math.random() * 0.3);
          break;

        // Disengaged (3–4)
        case 2:
        case 3:
          timeSpent = expected * 0.1;
          completed = false;
          break;

        // Early Exit (5–6)
        case 4:
        case 5:
        timeSpent = expected * (0.25 + Math.random() * 0.1); // 25–35%
        completed = false;
        break;

        // Difficulty Avoidance (7–8)
        case 6:
        case 7:
          if (lesson.difficultyLevel === "hard") {
            timeSpent = expected * 0.1;
          } else {
            timeSpent = expected * 0.9;
          }
          break;

        // Drift learner (9)
        case 8:
          if (j < 6) {
            timeSpent = expected * 0.9;
          } else {
            timeSpent = expected * 0.2;
          }
          break;

        // Improving learner (10)
        case 9:
          if (j < 6) {
            timeSpent = expected * 0.2;
          } else {
            timeSpent = expected * 0.9;
          }
          break;
      }

      await prisma.lessonActivity.create({
        data: {
          userId: learner.id,
          lessonId: lesson.id,
          timeSpent: Math.floor(timeSpent),
          completed,
          timestamp: new Date(Date.now() - (lessons.length - j) * 86400000)
        }
      });
    }
  }

  console.log("Seeding complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());