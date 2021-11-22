// This package doesn't have types
import snarkdown from "snarkdown";

export function htmlToElement(html){
  return new DOMParser().parseFromString(html, 'text/html').documentElement;
}

export function markdownToHtml(markdown){
  if (snarkdown) {
    return snarkdown(markdown);
  }

  return snarkdown(markdown);
}

export function decodeHtml(html){
  return html.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}
