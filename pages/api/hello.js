// Next.js ko API route ko documentation ko link: https://nextjs.org/docs/api-routes/introduction
// API route le server-side logic handle garna Next.js ma endpoint banaucha

// handler function default export gareko cha, jun yo API route ko main logic ho
export default function handler(req, res) {
  // res.status(200) le HTTP status code 200 (OK) send garcha
  // .json() le response body JSON format ma client lai send garcha
  res.status(200).json({ name: "John Doe" }); // yo line le { name: "John Doe" } JSON response return garcha
}
