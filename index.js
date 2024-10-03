const headers = {
  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZjNjJjNWJlOGQ4NTdmNDA3ODMzYjQ5IiwiaWF0IjoxNzI3OTU2Mzg4LCJleHAiOjE3MjgwNDI3ODgsInR5cGUiOiJhY2Nlc3MifQ.UdjsX8fwHoEQDgUSz7ByDeWi943PyDdU1N99xOFS6yg", // توکن معتبر خود را اینجا قرار دهید
  "Content-Type": "application/json", // اضافه کردن هدر Content-Type
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms)); // استفاده از setTimeout برای تاخیر
}

async function getMissions() {
  const res = await fetch("https://api-mission.goatsbot.xyz/missions/user", {
    headers: headers,
  });

  if (res.status === 401) {
    console.log("Authorization failed: 401 Unauthorized");
    return [];
  }

  const data = await res.json();
  return Object.values(data).flat(1);
}

async function completeAllOfMissions(missions) {
  for (let i = 0; i < missions.length; i++) {
    const res = await fetch(`https://dev-api.goatsbot.xyz/missions/action/${missions[i]._id}`, {
      method: "POST",
      headers: headers,
    });

    console.log(`${i}: ${res.status}`);

    if (res.status === 401) {
      console.log(`Authorization failed on mission ${missions[i]._id}`);
      continue;
    }

    await delay(500); // Delay between requests
  }
}

async function viewAdv() {
  const res = await fetch("https://dev-api.goatsbot.xyz/missions/action/66db47e2ff88e4527783327e", {
    method: "POST",
    headers: headers,
  });

  const data = await res.json();
  console.log(`adv - ${data.status ?? data.message}`);
}

async function makeMoney() {
  const missions = await getMissions();

  if (missions.length === 0) {
    console.log("No missions available or authorization failed.");
    return;
  }

  await completeAllOfMissions(missions);
  await viewAdv();

  // اجرای viewAdv هر دقیقه
  setInterval(viewAdv, 60000); // هر یک دقیقه اجرای viewAdv
}

makeMoney();
