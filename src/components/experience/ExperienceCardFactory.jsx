import InternshipCard from './cards/InternshipCard';
import HackathonCard from './cards/HackathonCard';
import CompetitionCard from './cards/CompetitionCard';
import WorkCard from './cards/WorkCard';

export default function ExperienceCardFactory({ item }) {
  switch (item.type) {
    case 'internship':
      return <InternshipCard {...item} />;
    case 'hackathon':
      return <HackathonCard {...item} />;
    case 'competition':
      return <CompetitionCard {...item} />;
    case 'work':
      return <WorkCard {...item} />;
    default:
      return <InternshipCard {...item} />;
  }
}
