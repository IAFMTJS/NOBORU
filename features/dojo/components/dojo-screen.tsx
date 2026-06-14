"use client";

import Link from "next/link";
import {
  BookOpen,
  Brain,
  Headphones,
  Languages,
  Sparkles,
  Target,
  Type,
} from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { YamaTrainingPresence } from "@/features/yama/components/yama-training-presence";

const TRAINING_GROUNDS = [
  {
    title: "Review Queue",
    description: "Spaced repetition and weakness drills.",
    href: "/review",
    icon: Target,
    location: "vocabulary_hall" as const,
  },
  {
    title: "Kana Dojo",
    description: "Hiragana and katakana recognition and writing.",
    href: "/learn/hiragana",
    icon: Type,
    location: "kana_dojo" as const,
  },
  {
    title: "Vocabulary Hall",
    description: "Word recall, meaning, and production drills.",
    href: "/learn/vocabulary",
    icon: Languages,
    location: "vocabulary_hall" as const,
  },
  {
    title: "Grammar Shrine",
    description: "Pattern recognition and sentence building.",
    href: "/learn/grammar",
    icon: BookOpen,
    location: "grammar_shrine" as const,
  },
  {
    title: "Listening Pavilion",
    description: "Ear training and comprehension practice.",
    href: "/learn/listening",
    icon: Headphones,
    location: "listening_pavilion" as const,
  },
  {
    title: "Kanji Grounds",
    description: "Readings, radicals, and stroke mastery.",
    href: "/learn/kanji",
    icon: Brain,
    location: "grammar_shrine" as const,
  },
  {
    title: "Reading Library",
    description: "Graded passages and comprehension checks.",
    href: "/learn/reading",
    icon: Sparkles,
    location: "grammar_shrine" as const,
  },
] as const;

export function DojoScreen() {
  return (
    <PageContainer>
      <ScreenHeader
        title="Dojo"
        subtitle="Training Grounds — deliberate practice for mastery"
      />

      <Card className="border-success/20 bg-gradient-to-br from-success/10 via-card to-card shadow-elevation-1">
        <CardContent className="p-4">
          <YamaTrainingPresence location="kana_dojo" size="md" />
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {TRAINING_GROUNDS.map((ground) => {
          const Icon = ground.icon;
          return (
            <Card key={ground.href} className="shadow-elevation-1">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-success" aria-hidden />
                  <CardTitle className="text-base">{ground.title}</CardTitle>
                </div>
                <CardDescription>{ground.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" asChild>
                  <Link href={ground.href}>Enter</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageContainer>
  );
}
