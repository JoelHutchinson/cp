<template>
  <UiHeading class="mb-6">About ChessPecker</UiHeading>

  <section class="space-y-10">
    <UCard>
      <UiParagraph class="mb-4">
        <strong>ChessPecker</strong> is a training tool inspired by the
        <em>Woodpecker Method</em>, designed to sharpen your tactical vision
        through deliberate repetition and focused practice. Create custom puzzle
        sets, track your progress, and repeat cycles to build lasting
        improvement.
      </UiParagraph>

      <UiParagraph class="mb-4">
        Whether you're a club player or a serious improver, ChessPecker provides
        a structured way to train like a Grandmaster.
      </UiParagraph>

      <div class="flex flex-wrap gap-2">
        <a href="#woodpecker-method">
          <UButton variant="ghost" color="primary"> Learn the Method </UButton>
        </a>
        <a href="#getting-started">
          <UButton variant="ghost" color="primary">
            How to Use the App
          </UButton>
        </a>
        <a href="#puzzle-sets">
          <UButton variant="ghost" color="primary"> Puzzle Sets </UButton>
        </a>
        <a href="#progress-tracking">
          <UButton variant="ghost" color="primary"> Progress Tracking </UButton>
        </a>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <UiSubheading id="getting-started" class="flex items-center">
          <UIcon name="i-lucide-info" class="mr-2" /> How to Use the
          App</UiSubheading
        >
      </template>

      <UiParagraph class="mb-2">
        Getting started with ChessPecker is simple. Just follow these steps:
      </UiParagraph>

      <UiTypography>
        <ul class="list-disc list-inside space-y-1 mb-3">
          <li>
            Go to the <strong>Puzzle Sets</strong> page and click
            <em>Create Puzzle Set</em>.
          </li>
          <li>
            Select how many puzzles you want in the set, and choose an average
            difficulty rating that suits your current skill level.
          </li>
          <li>
            Optionally, filter by <strong>themes</strong> such as mating
            patterns, endgame types, or tactical motifs to focus your training.
          </li>
          <li>
            Once your set is created, start solving! The app records your
            results as you go.
          </li>
          <li>
            Each time you complete all the puzzles in a set, it counts as one
            <strong>cycle</strong>. The app tracks your progress through each
            cycle and calculates your accuracy.
          </li>
        </ul>
      </UiTypography>

      <UAlert icon="i-heroicons-information-circle" title="Tip">
        <template #description>
          Revisit your puzzle sets repeatedly to follow the Woodpecker Method
          approach. Over time, you’ll notice improved speed, accuracy, and
          tactical intuition.
        </template>
      </UAlert>
    </UCard>

    <UCard>
      <template #header>
        <UiSubheading id="woodpecker-method" class="flex items-center">
          <UIcon name="i-lucide-book-open-check" class="mr-2" />The Woodpecker
          Method</UiSubheading
        >
      </template>

      <div class="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6">
        <div class="flex gap-4 justify-center md:justify-start">
          <NuxtImg
            src="woodpecker-method-cover.png"
            alt="The Woodpecker Method"
            class="h-48 rounded-lg shadow-md"
            :width="136"
            :height="192"
          />
          <NuxtImg
            src="woodpecker-method-2-cover.png"
            alt="The Woodpecker Method 2"
            class="h-48 rounded-lg shadow-md"
            :width="136"
            :height="192"
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
        <UiSubheading id="puzzle-sets" class="flex items-center"
          ><UIcon name="i-lucide-grid" class="mr-2" /> Puzzle Sets</UiSubheading
        >
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
        <UiSubheading id="progress-tracking" class="flex items-center"
          ><UIcon name="i-lucide-bar-chart-3" class="mr-2" />Progress
          Tracking</UiSubheading
        >
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
