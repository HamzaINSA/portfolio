// Contact form without backend (decision D9): the visitor's own mail client sends the message.

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

/** A mailto: URL with a prefilled subject and body. Nothing leaves the browser until the visitor sends it. */
export function buildMailto(
  to: string,
  { name, email, message }: ContactMessage,
  subjectFor: (name: string) => string,
): string {
  const who = name.trim();
  const from = email.trim();
  const signature = [who, from && `<${from}>`].filter(Boolean).join(' ');
  const body = [message.trim(), signature && `-- ${signature}`]
    .filter(Boolean)
    .join('\n\n');
  const params = [
    `subject=${encodeURIComponent(subjectFor(who))}`,
    `body=${encodeURIComponent(body)}`,
  ].join('&');
  return `mailto:${to}?${params}`;
}
