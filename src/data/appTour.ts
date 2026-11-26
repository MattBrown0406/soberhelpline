// The screens on /sober-helpline-app/tour, in the order the tour plays them.
//
// To add a screen: put a 600x1304 screenshot in public/sober-helpline-app/
// (WebP, like the others) and add an entry here. Describe only what the
// screenshot shows. Captions are one short title and one sentence.

export interface AppTourScreen {
  /** File name in public/sober-helpline-app/, without ".webp". */
  image: string;
  /** Short label for the jump buttons. */
  label: string;
  title: string;
  text: string;
  alt: string;
}

export const APP_TOUR_IMAGE_WIDTH = 600;
export const APP_TOUR_IMAGE_HEIGHT = 1304;

export const appTourScreens: AppTourScreen[] = [
  {
    image: "getting-started",
    label: "Get started",
    title: "Start from where you are",
    text: "The app asks what brings you here today, like \"I'm worried about someone\" or \"They refuse help\", and you can change it later.",
    alt: "The app's welcome screen asking what brings you here today, with choices such as I'm worried about someone, They refuse help and I need help with boundaries",
  },
  {
    image: "save-my-spot",
    label: "Family Squares",
    title: "Save your spot for Monday",
    text: "Today shows this week's Family Squares meeting with a Save my spot button, a Join Zoom link and one small thing to try this week.",
    alt: "The app's Today screen with this week's Family Squares meeting, a Save my spot button, a Join Zoom link and this week's one thing",
  },
  {
    image: "scripts",
    label: "Scripts",
    title: "Words for hard conversations",
    text: "Practice gives you three fresh scripts each day, like what to say when they ask for money, and more to browse by situation.",
    alt: "The app's Practice screen with today's scripts for money, crisis and conversation, and scripts to browse by situation such as crisis and safety",
  },
  {
    image: "tools",
    label: "Tools",
    title: "Tools to plan next steps",
    text: "Practice a conversation, set boundaries, find treatment in a free directory, or talk to someone through Support.",
    alt: "The app's Tools screen with links to practice a conversation, set agreed boundaries, find treatment in a free directory and talk to someone",
  },
];
