const headers = {
  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZjNjJjN2NlOGQ4NTdmNDA3ODM4MDY1IiwiaWF0IjoxNzI3Njc1NjM1LCJleHAiOjE3Mjc3NjIwMzUsInR5cGUiOiJhY2Nlc3MifQ.HMqgVnQ7CiRoNhsfZABHRbwoHFIEHKhLLJDaX66sI4c", // توکن را با توکن معتبر جایگزین کنید
  "Content-Type": "application/json",
};

async function delay(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(true), ms));
}

async function getMissions() {
  const res = await fetch("https://api-mission.goatsbot.xyz/missions/user", {
    headers,
  });

  if (res.status === 401) {
    console.error("Authorization failed: 401 Unauthorized");
    return [];
  }

  const data = await res.json();
  return Object.values(data).flat(1);
}

async function completeAllOfMissions(missions) {
  for (let i = 0; i < missions.length; i++) {
    const res = await fetch(
      `https://dev-api.goatsbot.xyz/missions/action/${missions[i]._id}`,
      {
        method: "POST",
        headers,
      }
    );

    console.log(i, res.status);

    if (res.status === 401) {
      console.error("Authorization failed on mission", missions[i]._id);
      continue;
    }

    await delay(500);
  }
}

async function viewAdv() {
  const res = await fetch(
    "https://dev-api.goatsbot.xyz/missions/action/66db47e2ff88e4527783327e",
    { method: "POST", headers }
  );

  const data = await res.json();
  console.log("adv -", data.status ?? data.message);
}

async function makeMoney() {
  const missions = await getMissions();
  
  if (missions.length === 0) {
    console.log("No missions available or authorization failed.");
    return;
  }

  await completeAllOfMissions(missions);
  await viewAdv();
  setInterval(viewAdv, 60000); // View ad every 60 seconds
}

makeMoney();

console.log("Executed: started...");
