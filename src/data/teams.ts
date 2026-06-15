// Team member data with GitHub and LinkedIn links

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  github: string;
  linkedin: string;
  avatar: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'muhammad-suruosh',
    name: 'Muhammad Suruosh',
    role: 'Frontend Developer',
    github: 'https://github.com/Suruosh',
    linkedin: 'https://www.linkedin.com/in/suruosh/',
    avatar: 'https://media.licdn.com/dms/image/v2/D4D03AQEazuYEIqWT8g/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1694026705994?e=1782345600&v=beta&t=wL62PlWKLKrwwlCQkgyHByEcg6XWm1wAXLGcdqAHxk8',
  },
  {
    id: 'noorae-jasmi',
    name: 'Noorae Jasmi',
    role: 'Frontend Developer',
    github: 'https://github.com/jasmi1901',
    linkedin: 'https://www.linkedin.com/in/noorae-jasmi/',
    avatar: 'https://media.licdn.com/dms/image/v2/D4E03AQE-itI9XpJXNg/profile-displayphoto-scale_400_400/B4EZktZRhFKgAg-/0/1757403224910?e=1782345600&v=beta&t=98HDqHWFv0OI2VlmMsI4OP8VVhH0k2bjbVKo5dJR55o',
  },
  {
    id: 'saheena-nazrin',
    name: 'Saheena Nazrin',
    role: 'Frontend Developer',
    github: 'https://github.com/nazrinahamed-source',
    linkedin: 'https://www.linkedin.com/in/saheena-nazrin-k',
    avatar: 'https://media.licdn.com/dms/image/v2/D4D03AQFuHIHCmX0zUw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1716318709327?e=1782345600&v=beta&t=V0jKN2dHaAP2E3od01kdSzHFjU-6Ax11DMN6MenqHSQ',
  },
];
