// "@/styles/globals.css" le global CSS file import garcha
// yo file ma sabai component haru ma apply hune CSS styling huncha
import "@/styles/globals.css";

// App ek main wrapper function ho jun har ek page render garna use huncha
// yo function le React component lai pageProps sanga combine garcha
export default function App({ Component, pageProps }) {
  // yo line le dynamic page render garcha jasma Component ho page ko main content ra pageProps additional data ho
  return <Component {...pageProps} />;
}
