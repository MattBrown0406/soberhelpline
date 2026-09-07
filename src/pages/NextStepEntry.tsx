import { useEffect } from "react";

// Fallback for a future React Router Link or programmatic navigation.
// Never render choices in a document that has loaded the normal site's SDKs.
export default function NextStepEntry() {
  useEffect(() => { window.location.replace("/next-step"); }, []);
  return <p role="status">Opening the private guide… <a href="/next-step">Continue to guide</a></p>;
}
