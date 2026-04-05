const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // 🔥 Clear old data
  await prisma.lessonActivity.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // 📚 Create Course
  const course = await prisma.course.create({
    data: {
      title: "Programming Fundamentals",
      description: "Sample course"
    }
  });

  // 📖 Create Lessons
  const lessons = await Promise.all(
    Array.from({ length: 6 }).map((_, i) =>
      prisma.lesson.create({
        data: {
          title: `Lesson ${i + 1}`,
          contentLength: 10 + i * 5,
          difficultyLevel:
            i < 2 ? "easy" : i < 4 ? "medium" : "hard",
          courseId: course.id
        }
      })
    )
  );

  // 👨‍🎓 Create 20 students
  const users = await Promise.all(
    Array.from({ length: 20 }).map((_, i) =>
      prisma.user.create({
        data: {
          name: `Student ${i + 1}`,
          email: `student${i + 1}@test.com`
        }
      })
    )
  );

  // 🎯 Helper
  const rand = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // 📊 Create varied behavior
  for (const user of users) {
    let behaviorType = user.id % 5;

    for (const lesson of lessons) {
      let timeSpent;
      let completed;

      const expected = lesson.contentLength * 60;

      switch (behaviorType) {
        // 0️⃣ Highly engaged
        case 0:
          timeSpent = rand(expected * 0.8, expected * 1.2);
          completed = true;
          break;

        // 1️⃣ Disengaged
        case 1:
          timeSpent = rand(0, expected * 0.2);
          completed = false;
          break;

        // 2️⃣ Early exit pattern
        case 2:
          timeSpent = rand(expected * 0.1, expected * 0.3);
          completed = false;
          break;

        // 3️⃣ Difficulty avoidance (good on easy, bad on hard)
        case 3:
          if (lesson.difficultyLevel === "hard") {
            timeSpent = rand(0, expected * 0.2);
            completed = false;
          } else {
            timeSpent = rand(expected * 0.7, expected);
            completed = true;
          }
          break;

        // 4️⃣ Mixed / realistic
        case 4:
          timeSpent = rand(expected * 0.3, expected);
          completed = Math.random() > 0.4;
          break;
      }

      await prisma.lessonActivity.create({
        data: {
          userId: user.id,
          lessonId: lesson.id,
          timeSpent,
          completed,
          timestamp: new Date(Date.now() - rand(0, 10) * 86400000)
        }
      });
    }
  }

  console.log("✅ Seed data created");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());