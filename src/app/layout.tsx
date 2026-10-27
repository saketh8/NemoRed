import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NEMO-RED — Autonomous Multi-Agent AI Red-Teaming Studio',
  description: 'Enterprise AI Red-Teaming Swarm powered by NVIDIA Nemotron on Nebius Token Factory. Autonomous prompt injection, zero-day threat intelligence, and auto-immunization defense engineering.',
  keywords: ['NVIDIA Nemotron', 'Nebius Token Factory', 'AI Red-Teaming', 'Prompt Injection', 'OWASP LLM', 'AI Security', 'Autonomous Agents'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
