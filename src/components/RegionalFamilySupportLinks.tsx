import { Link } from "react-router-dom";

const states = ["Oregon", "Washington", "Idaho", "California", "Nevada", "Arizona", "Utah"];

export default function RegionalFamilySupportLinks() {
  return (
    <nav aria-label="Western state family support resources" className="my-8 rounded-xl border border-primary/20 bg-primary/5 p-5 md:p-6">
      <h2 className="text-xl font-semibold text-logo-blue">Family support resources by state</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Sober Helpline offers remote family support. These guides pair online coaching and education with state-specific resource links; they are not local office listings.
      </p>
      <ul className="mt-4 flex flex-wrap gap-3">
        {states.map((state) => (
          <li key={state}>
            <Link to={`/${state.toLowerCase()}-family-support`} className="inline-block rounded-md px-3 py-2 text-primary underline underline-offset-4 hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
              {state} family support
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
