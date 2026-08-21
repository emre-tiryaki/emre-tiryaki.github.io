/**
 * TweetCardDemo — görseldeki örneği birebir yeniden üretiyor
 *
 * Kullanım:
 *   import TweetCardDemo from '@/components/ui/TweetCardDemo';
 *   <TweetCardDemo />
 *
 * Kendi tweet verinle kullanmak için doğrudan TweetCard'ı import et:
 *   import TweetCard from '@/components/ui/TweetCard';
 */

import TweetCard from './TweetCard';

const DEMO_TWEET = {
  id: '1441032681968212480',
  user: {
    name: 'Dillion',
    handle: 'dillionverma',
    avatarUrl: 'https://pbs.twimg.com/profile_images/1668085867445669888/r8CIBpnX_400x400.jpg',
    verified: true,
    profileUrl: 'https://twitter.com/dillionverma',
  },
  text: 'today is my first day of @_buildspace school 🎒 a place where you turn your ideas into reality and make friends along the way 😊\nbuildspace.so',
  entities: {
    mentions: [
      { text: '@_buildspace', url: 'https://twitter.com/_buildspace' },
    ],
    urls: [
      { text: 'buildspace.so', url: 'https://buildspace.so', displayUrl: 'buildspace.so' },
    ],
  },
  images: [
    'https://pbs.twimg.com/media/FAexzNrVcAIB_Qm?format=jpg&name=large',
    'https://pbs.twimg.com/media/FAexzNrVIAQvRqr?format=jpg&name=large',
    'https://pbs.twimg.com/media/FAexzNpVUAMSHWm?format=jpg&name=large',
  ],
  createdAt: 'Oct 1, 2021',
};

export default function TweetCardDemo() {
  return (
    <div className="flex items-center justify-center p-8 bg-neutral-100 dark:bg-neutral-950 min-h-[400px]">
      <TweetCard tweet={DEMO_TWEET} />
    </div>
  );
}
