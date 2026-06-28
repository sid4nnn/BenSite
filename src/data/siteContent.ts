import fluxBanner from '../../assets/fluxbanner.png';
import kbetIcon from '../../assets/kbeticon.png';
import sentinalIcon from '../../assets/sentinalbanner.png';

export type ViewId = 'about' | 'projects' | 'contact';

export type Project = {
  title: string;
  description: string;
  assetPath: string | null;
  link: string | null;
  status?: string;
};

export type SocialLink = {
  label: string;
  href: string | null;
};

export const views: ViewId[] = ['about', 'projects', 'contact'];

export const siteContent = {
  ownerName: 'Ben Damti',
  topLabel: '',
  hero: {
    prefix: 'I’m',
    name: 'Ben',
    suffix: ',',
    subtitle: 'a software engineer based in Tel Aviv.',
  },
  about: {
    kicker: 'About',
    headline: 'I build thoughtful software across product surfaces, infrastructure, and intelligent systems.',
    intro:
      'I like taking ambiguous ideas and shaping them into reliable, usable products. My work moves between mobile experiences, backend systems, product engineering, systems-level thinking, and computer vision.',
    skills: ['Product engineering', 'System design', 'API design', 'Prototyping', 'Performance'],
    languages: ['TypeScript', 'JavaScript', 'Python', 'Swift', 'SQL','C'],
    technologies: ['React', 'Node.js', 'Vite', 'REST APIs', 'Git','Expo'],
    areas: ['Mobile development', 'Product engineering', 'Backend systems', 'Systems programming', 'Computer vision'],
  },
  projects: [
    {
      title: 'Flux',
      description:
        'A modern iOS IPTV player for organizing and streaming live TV, movies, and series from personal sources.',
      assetPath: fluxBanner,
      link: 'https://getflux.tv',
    },
    {
      title: 'KBet',
      description:
        'A full-stack betting platform combining live sports scores, user wallets, and casino-style gameplay.',
      assetPath: kbetIcon,
      link: 'https://github.com/sid4nnn/kbet',
    },
    {
      title: 'Sentinal Eye',
      description:
        'An AI-powered body-camera concept designed to detect risks, identify events, and deliver real-time alerts.',
      // TODO: Add the Sentinal project link when it is ready.
      assetPath: sentinalIcon,
      link: null,
      status: 'WIP',
    },
  ] satisfies Project[],
  contact: {
    heading: 'Let’s talk.',
    intro: 'Reach out through whichever channel is easiest.',
    // Update these URLs if your real social/profile URLs are different.
    socialLinks: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ben-damti-3a2b12207' },
      { label: 'GitHub', href: 'https://github.com/sid4nnn' },
      { label: 'Email', href: 'mailto:hello@bendamti.dev' },
    ] satisfies SocialLink[],
  },
};
