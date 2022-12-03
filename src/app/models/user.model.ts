export class User {
  id?: string;
  name?: string;
  tag?: string;
}

export class Follow {
  followerUserId: string;
  followingUserId: string;
}
