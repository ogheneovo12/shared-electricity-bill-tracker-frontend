export const socketAuth = (token?: string | null) => {
  const authParam: Record<string, string> = {};

  if (token) {
    authParam["access_token"] = `Bearer ${token}`;
  }

  return authParam;
};
