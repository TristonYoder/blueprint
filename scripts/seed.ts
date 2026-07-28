import { db } from "../src/lib/db";
import { goals, redlines, wins, comments } from "../src/lib/db/schema";
import {
  goals as mockGoals,
  redlines as mockRedlines,
  wins as mockWins,
} from "../src/lib/mock-data";

async function main() {
  console.log("Seeding goals, redlines, wins from mock-data.ts...");
  await db.delete(comments);
  await db.delete(redlines);
  await db.delete(wins);
  await db.delete(goals);

  await db.insert(goals).values(mockGoals);
  await db.insert(redlines).values(mockRedlines);
  await db.insert(wins).values(mockWins);

  console.log(
    `Seeded ${mockGoals.length} goals, ${mockRedlines.length} redlines, ${mockWins.length} wins.`,
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
