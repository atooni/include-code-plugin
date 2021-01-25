import fetch from 'node-fetch';

export const fetchCodeFromUrl = async (url: string) => {
  const response = await fetch(url);
  const content: string = await response.text();
  return content;
};