// /api/clients.js
export default async function handler(req, res) {
  try {
    const url = `${process.env.EVENTS_API_URL}?key=${process.env.EVENTS_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch events" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Clients API error:", error);
    return res.status(500).json({
      error: "Server error while fetching events",
    });
  }
}

