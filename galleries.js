export default async function handler(req, res) {
  try {
    const url = `${process.env.GALLERIES_API_URL}?key=${process.env.GALLERIES_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch galleries" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Server error while fetching galleries",g
    });
  }
}
