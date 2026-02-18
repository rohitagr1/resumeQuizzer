import "./globals.css";
import React from "react";

export const metadata = {
  title: "Resume MCQ Generator",
  description: "Generate personalized MCQs from your resume",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}




