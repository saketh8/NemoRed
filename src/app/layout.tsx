import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NEMO-RED — Autonomous Multi-Agent AI Red-Teaming Studio',
  description: 'Test AI agent boundaries with NVIDIA Nemotron on Nebius Token Factory. Inspect adversarial evidence, generate a defense patch, and replay the exploit.',
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
