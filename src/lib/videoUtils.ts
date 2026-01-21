export function isMedalVideo(url: string): boolean {
  return url.includes("medal.tv");
}

export function getMedalEmbedUrl(url: string): string | null {
  // If it's already an embed URL, return it
  if (url.includes("medal.tv/games/") && url.includes("/clip/")) {
    return url;
  }

  // If it's a regular Medal URL like https://medal.tv/games/valorant/clips/lQOVpixlyqACeVcBv
  // Convert to embed format
  const clipIdMatch = url.match(/clips\/([a-zA-Z0-9]+)/);
  if (clipIdMatch) {
    return `https://medal.tv/games/valorant/clip/${clipIdMatch[1]}?invite=cr-MSw2akUsNDg4MjU5MDk5`;
  }

  return null;
}
