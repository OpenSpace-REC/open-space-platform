export const isValidPostImageUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname === 'i.postimg.cc' && /\.(jpg|jpeg|png|gif)$/i.test(parsedUrl.pathname);
  } catch {
    return false;
  }
};

export const verifyGithubUsername = async (username: string): Promise<boolean> => {
  try {
    const tokenResponse = await fetch('/api/github/token')
    if (!tokenResponse.ok) return false
    const { token } = await tokenResponse.json()

    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.status === 200
  } catch {
    return false
  }
} 