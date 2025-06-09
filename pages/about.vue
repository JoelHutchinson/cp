<template>
  <UiHeading class="mb-6">About ChessPecker</UiHeading>

  <section class="space-y-10">
    <UCard>
      <template #header>
        <UiSubheading>The Woodpecker Method</UiSubheading>
      </template>

      <div class="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6">
        <div class="flex gap-4 justify-center md:justify-start">
          <NuxtImg
            src="woodpecker-method-cover.png"
            alt="The Woodpecker Method"
            class="h-48 rounded-lg shadow-md"
          />
          <NuxtImg
            src="woodpecker-method-2-cover.png"
            alt="The Woodpecker Method 2"
            class="h-48 rounded-lg shadow-md"
          />
        </div>

        <div>
          <UiParagraph>
            The <strong>Woodpecker Method</strong> is a structured chess
            training system developed by Grandmasters Axel Smith and Hans
            Tikkanen, first introduced in their book The Woodpecker Method
            (Quality Chess, 2018). The method focuses on systematic repetition
            of tactical exercises to dramatically enhance a player's tactical
            awareness, calculation speed, and pattern recognition — foundational
            skills for competitive success. The approach was inspired by
            Tikkanen’s personal training regimen, which helped him achieve three
            GM norms in a short span. The method works on the principle that
            repetition solidifies learning, especially when spaced repetition is
            combined with focused effort.
          </UiParagraph>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <UiSubheading>Puzzle Sets</UiSubheading>
      </template>

      <UiParagraph class="mb-1">
        With our <strong>Puzzle Set</strong> feature, users can generate
        customized training sets based on:
      </UiParagraph>

      <UiTypography>
        <ul class="list-disc list-inside space-y-1 mb-3">
          <li>
            <strong>Number of puzzles</strong> – choose how long or short you
            want your set to be.
          </li>
          <li>
            <strong>Average difficulty rating</strong> – target puzzles within
            your skill level.
          </li>
          <li>
            <strong>Themes</strong> – focus on specific motifs like endgames,
            mating patterns, pins, forks, and more.
          </li>
        </ul>
      </UiTypography>

      <UiParagraph>
        This tailored approach ensures that you’re always training with puzzles
        that matter most to your improvement.
      </UiParagraph>
    </UCard>

    <UCard>
      <template #header>
        <UiSubheading>Progress Tracking</UiSubheading>
      </template>

      <UiParagraph class="mb-1">
        Your profile tracks every puzzle set you create and attempt. You’ll be
        able to monitor:
      </UiParagraph>

      <UiTypography>
        <ul class="list-disc list-inside space-y-1 mb-3">
          <li>
            <strong>Accuracy</strong> – see how often you solve puzzles
            correctly on the first try.
          </li>
          <li>
            <strong>Number of puzzles solved</strong> – track your overall
            workload.
          </li>
          <li>
            <strong>Cycles completed</strong> – visualize your repetitions to
            stay in line with the Woodpecker Method.
          </li>
        </ul>
      </UiTypography>

      <UiParagraph>
        This data-driven feedback helps you stay accountable and optimize your
        training over time.
      </UiParagraph>
    </UCard>
  </section>
</template>
