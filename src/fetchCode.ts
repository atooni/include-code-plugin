import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

export const fetchCodeFromUrl = async (url: string) => {
  const response = await fetch(url);
  const content: string = await response.text();
  return content;
};

export const fetchCodeFromFile = (fileName: string) => {
  let name = fileName
  if (!fileName.startsWith("/")) name = process.cwd() + "/" + name
  return fs.readFileSync(name, "utf-8")
}