declare namespace Express {
  interface Request {
    username: string;
    user: {
      id: string;
      avatar: string;
      username: string;
      email: string;
      isOnline: boolean;
    };
  }
}
