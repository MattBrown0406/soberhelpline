export const SITE_URL = 'https://soberhelpline.com';

export const prerenderPages = [
  {
    route: '/',
    title: 'Family Addiction Support & Education | Sober Helpline',
    description: 'Free education, support, and ethical resources for families affected by addiction. Recovery Roadmap, coaching, and practical next steps for families under strain.',
    noscriptHtml: '<main><h1>Family Addiction Support and Education</h1><p>Sober Helpline offers family support, coaching, Monday Zoom meetings, and practical next steps for families facing addiction.</p><p><a href="https://soberhelpline.com/monday-zoom-registration">Join the free Monday Zoom</a> · <a href="https://soberhelpline.com/family-membership">Explore family membership</a> · <a href="https://soberhelpline.com/book-consultation">Book a consultation</a></p></main>'
  },
  {
    route: '/monday-zoom-registration',
    title: 'Monday Family Support Zoom | Sober Helpline',
    description: 'Register for Sober Helpline\'s free Monday Zoom for families affected by addiction. Get support, education, and practical next steps in a confidential setting.',
    noscriptHtml: '<main><h1>Register for the Monday Family Support Zoom</h1><p>Join Sober Helpline\'s free Monday Zoom for families navigating addiction, recovery, boundaries, and treatment decisions.</p><p><a href="https://soberhelpline.com/book-consultation">Need private guidance instead?</a></p></main>'
  },
  {
    route: '/family-membership',
    title: 'Family Membership for Addiction Support | Sober Helpline',
    description: 'Get structured family addiction support with education, coaching guidance, and practical tools through Sober Helpline\'s family membership.',
    noscriptHtml: '<main><h1>Family Membership for Addiction Support</h1><p>Get ongoing support, education, and guidance for families trying to respond to addiction with more clarity and less chaos.</p><p><a href="https://soberhelpline.com/book-consultation">Book a consultation</a> or <a href="https://soberhelpline.com/family-support">view free family support resources</a>.</p></main>'
  },
  {
    route: '/family-support',
    title: 'Family Support for Addiction | Sober Helpline',
    description: 'Free family addiction support resources, education, and next-step guidance for families dealing with a loved one\'s substance use.',
    noscriptHtml: '<main><h1>Family Support for Addiction</h1><p>Free support, education, and guidance for families dealing with a loved one\'s substance use, denial, relapse, or treatment resistance.</p><p><a href="https://soberhelpline.com/monday-zoom-registration">Join the free Monday Zoom</a> · <a href="https://soberhelpline.com/family-coaching">Explore family coaching</a></p></main>'
  },
  {
    route: '/family-coaching',
    title: 'Family Coaching for Addiction | Sober Helpline',
    description: 'Private family coaching for addiction-related crisis, boundaries, communication, treatment decisions, and next-step planning.',
    noscriptHtml: '<main><h1>Family Coaching for Addiction</h1><p>Private support for families who need clarity around boundaries, treatment planning, communication, and what to do next.</p><p><a href="https://soberhelpline.com/book-consultation">Book a consultation</a></p></main>'
  },
  {
    route: '/family-consultation',
    title: 'Family Consultation for Addiction Support | Sober Helpline',
    description: 'Talk with Sober Helpline about your family\'s situation, treatment questions, and the next right step when addiction has thrown life off balance.',
    noscriptHtml: '<main><h1>Family Consultation for Addiction Support</h1><p>Get direct guidance on treatment options, family strategy, and the next right step for your situation.</p><p><a href="https://soberhelpline.com/book-consultation">Book your consultation</a></p></main>'
  },
  {
    route: '/book-consultation',
    title: 'Book an Addiction Family Consultation | Sober Helpline',
    description: 'Book a consultation with Sober Helpline for addiction-related family guidance, treatment direction, and practical next steps.',
    noscriptHtml: '<main><h1>Book an Addiction Family Consultation</h1><p>Schedule a consultation for guidance on addiction, treatment options, family strategy, and immediate next steps.</p><p>If the booking widget does not load, call Sober Helpline directly for help.</p></main>'
  },
];

export const sitemapPriority = new Map([
  ['/', '1.0'],
  ['/monday-zoom-registration', '0.95'],
  ['/family-membership', '0.95'],
  ['/family-support', '0.9'],
  ['/family-coaching', '0.9'],
  ['/family-consultation', '0.85'],
  ['/book-consultation', '0.85'],
  ['/family-education', '0.85'],
  ['/roadmap', '0.9'],
  ['/blog', '0.9'],
]);

export const sitemapChangefreq = new Map([
  ['/', 'weekly'],
  ['/blog', 'daily'],
  ['/monday-zoom-registration', 'weekly'],
  ['/family-membership', 'weekly'],
  ['/family-support', 'weekly'],
  ['/family-coaching', 'weekly'],
  ['/family-consultation', 'weekly'],
  ['/book-consultation', 'weekly'],
]);

export const excludedSitemapRoutes = new Set([
  '/auth',
  '/admin',
  '/provider-application',
  '/provider-info',
  '/consultation-provider-dashboard',
  '/join-meeting',
  '/subscription/success',
  '/subscription/cancel',
  '/survey',
]);
