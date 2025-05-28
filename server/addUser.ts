// This script adds a dummy user for testing
import db from "./src/db";
const user = {
  email: "your@email.com",
};

async function addUser() {
  try {
    const [id] = await db("users").insert(user);
    console.log("User added with id:", id);
  } catch (error) {
    console.error("Error adding user:", error);
  } finally {
    await db.destroy();
  }
}

addUser();
