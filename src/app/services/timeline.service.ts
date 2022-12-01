export class TimelineService {
  tweets = [
    {
      name: 'Certified Sh*tposter',
      tag: 'spicymemes69',
      ts: '12h',
      text: 'This is the first real tweet!',
    },
    {
      name: 'Memelord Supreme',
      tag: 'r3dditl4d',
      ts: '15m',
      text: 'Boy I sure hope Mr. Musk doesnt buy this too! ;)',
    },
    {
      name: 'Hispanick Jonas',
      tag: 'sailingburrito',
      ts: '58m',
      text: 'ARGENTINA WHAT ARE YOU DOING??? brb burning my messi shirt',
    },
    {
      name: 'I Ran Out of Names',
      tag: 'notcreative',
      ts: '4h',
      text:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ' +
        'eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut' +
        'enim ad minim veniam',
    },
    {
      name: 'Test1',
      tag: 'tst123',
      ts: '10s',
      text: "Pls don't blow up...",
    },
    {
      name: 'Test2',
      tag: 'tst123',
      ts: '5s',
      text: "Pls don't blow up...",
    },
    {
      name: 'Test3',
      tag: 'tst123',
      ts: '17s',
      text: "Pls don't blow up...",
    },
    {
      name: 'Test4',
      tag: 'tst123',
      ts: '2s',
      text: "Pls don't blow up...",
    },
    {
      name: 'Test5',
      tag: 'tst123',
      ts: '9s',
      text: "Pls don't blow up...",
    },
    {
      name: 'Test6',
      tag: 'tst123',
      ts: '12s',
      text: "Pls don't blow up...",
    },
  ];

  fetchTweets() {
    return this.tweets;
  }
}
