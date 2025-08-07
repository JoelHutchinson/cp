<template>
  <div
    class="relative overflow-hidden py-12 px-4 sm:px-8 mb-12 rounded-xl shadow-lg flex flex-col items-center text-center bg-gradient-to-br from-orange-100 via-white to-orange-50 border border-orange-200 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:border-gray-700"
  >
    <NuxtImg
      src="logo-light.png"
      alt="Logo"
      class="mx-auto mb-4 dark:hidden"
      width="80"
      height="80"
    />
    <NuxtImg
      src="logo-dark.png"
      alt="Logo"
      class="hidden mx-auto mb-4 dark:block"
      width="80"
      height="80"
    />

    <h1
      class="text-4xl md:text-5xl font-extrabold mb-4 text-orange-600 drop-shadow-lg dark:text-orange-300"
    >
      About ChessPecker
    </h1>
    <div class="flex flex-wrap gap-3 justify-center mt-4 z-10">
      <a href="#getting-started"
        ><UButton variant="solid" color="primary" icon="i-lucide-circle-help"
          >How to Use</UButton
        ></a
      >
      <a href="#woodpecker-method"
        ><UButton variant="solid" color="amber" icon="i-lucide-book-open-check"
          >The Method</UButton
        ></a
      >
      <a href="#puzzle-sets"
        ><UButton variant="solid" color="emerald" icon="i-lucide-grid"
          >Puzzle Sets</UButton
        ></a
      >
      <a href="#progress-tracking"
        ><UButton variant="solid" color="sky" icon="i-lucide-bar-chart-3"
          >Progress</UButton
        ></a
      >
    </div>
  </div>

  <section class="space-y-12">
    <UCard
      class="shadow-md rounded-xl border-l-4 border-orange-400 bg-orange-50/80 px-8 py-4 dark:bg-gray-800/80 dark:border-orange-600"
    >
      <UiParagraph class="mb-4 dark:text-gray-300">
        <UIcon
          name="i-lucide-info"
          class="inline-block mr-2 text-orange-500 dark:text-orange-300"
        />
        <strong>ChessPecker</strong> is a training tool inspired by the
        <AmazonWoodpeckerAffiliateLink
          ><em>Woodpecker Method</em></AmazonWoodpeckerAffiliateLink
        >, designed to sharpen your tactical vision through deliberate
        repetition and focused practice. Create custom puzzle sets, track your
        progress, and repeat cycles to build lasting improvement.
      </UiParagraph>
      <UiParagraph class="mb-4 dark:text-gray-300">
        Whether you're a club player or a serious improver, ChessPecker provides
        a structured way to train like a Grandmaster.
      </UiParagraph>
    </UCard>

    <UCard
      class="shadow-md rounded-xl border-l-4 border-sky-400 bg-sky-50/80 px-8 py-4 dark:bg-gray-800/80 dark:border-sky-500"
    >
      <template #header>
        <UiSubheading
          id="getting-started"
          class="flex items-center scroll-mt-11 text-sky-700 text-2xl dark:text-sky-300"
        >
          <UIcon
            name="i-lucide-circle-help"
            class="mr-2 text-sky-500 dark:text-sky-300"
          />
          How to Use the App
        </UiSubheading>
      </template>
      <UiParagraph class="mb-2 dark:text-gray-300">
        Getting started with ChessPecker is simple. Just follow these steps:
      </UiParagraph>
      <UiTypography>
        <ul class="list-disc list-inside space-y-2 mb-3">
          <li>
            <UIcon
              name="i-lucide-plus-circle"
              class="inline-block align-middle mb-0.5 mr-1 text-sky-400 w-5 h-5 dark:text-sky-300"
            />Go to the <strong>Puzzle Sets</strong> page and click
            <em>Create Puzzle Set</em>.
          </li>
          <li>
            <UIcon
              name="i-lucide-sliders-horizontal"
              class="inline-block align-middle mb-0.5 mr-1 text-sky-400 w-5 h-5 dark:text-sky-300"
            />Select how many puzzles you want in the set, and choose an average
            difficulty rating that suits your current skill level.
          </li>
          <li>
            <UIcon
              name="i-lucide-filter"
              class="inline-block align-middle mb-0.5 mr-1 text-sky-400 w-5 h-5 dark:text-sky-300"
            />Optionally, filter by <strong>themes</strong> such as mating
            patterns, endgame types, or tactical motifs to focus your training.
          </li>
          <li>
            <UIcon
              name="i-lucide-play-circle"
              class="inline-block align-middle mb-0.5 mr-1 text-sky-400 w-5 h-5 dark:text-sky-300"
            />Once your set is created, start solving! The app records your
            results as you go.
          </li>
          <li>
            <UIcon
              name="i-lucide-repeat"
              class="inline-block align-middle mb-0.5 mr-1 text-sky-400 w-5 h-5 dark:text-sky-300"
            />Each time you complete all the puzzles in a set, it counts as one
            <strong>cycle</strong>. The app tracks your progress through each
            cycle and calculates your accuracy.
          </li>
        </ul>
      </UiTypography>
      <UAlert
        icon="i-heroicons-information-circle"
        title="Tip"
        class="mt-4 bg-sky-100/60 border-sky-300 dark:bg-sky-900/60 dark:border-sky-700"
      >
        <template #description>
          Revisit your puzzle sets repeatedly to follow the Woodpecker Method
          approach. Over time, you’ll notice improved speed, accuracy, and
          tactical intuition.
        </template>
      </UAlert>
    </UCard>

    <UCard
      class="shadow-md rounded-xl border-l-4 border-amber-400 bg-amber-50/80 px-8 py-4 dark:bg-gray-800/80 dark:border-amber-500"
    >
      <template #header>
        <UiSubheading
          id="woodpecker-method"
          class="flex items-center scroll-mt-11 text-amber-700 dark:text-amber-300"
        >
          <UIcon
            name="i-lucide-book-open-check"
            class="mr-2 text-amber-500 dark:text-amber-300"
          />The Woodpecker Method
        </UiSubheading>
      </template>
      <div class="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 items-center">
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
          <UiParagraph class="dark:text-gray-300">
            <UIcon
              name="i-lucide-lightbulb"
              class="inline-block mr-2 text-amber-400 dark:text-amber-200"
            />
            <AmazonWoodpeckerAffiliateLink />
            is a structured chess training system developed by Grandmasters Axel
            Smith and Hans Tikkanen, first introduced in their book The
            Woodpecker Method (Quality Chess, 2018). The method focuses on
            systematic repetition of tactical exercises to dramatically enhance
            a player's tactical awareness, calculation speed, and pattern
            recognition — foundational skills for competitive success. The
            approach was inspired by Tikkanen’s personal training regimen, which
            helped him achieve three GM norms in a short span. The method works
            on the principle that repetition solidifies learning, especially
            when spaced repetition is combined with focused effort. More
            recently, Smith and Tikkanen released a follow-up book,
            <AmazonWoodpecker2AffiliateLink /> (Quality Chess, 2023), which
            implements the original method with positional puzzles. The focus is
            on acquiring pattern recognition for typical pawn structures,
            material imbalances, and strategic plans. I highly recommend both of
            these books!
          </UiParagraph>
        </div>
      </div>
    </UCard>

    <UCard
      class="shadow-md rounded-xl border-l-4 border-emerald-400 bg-emerald-50/80 px-8 py-4 dark:bg-gray-800/80 dark:border-emerald-500"
    >
      <template #header>
        <UiSubheading
          id="puzzle-sets"
          class="flex items-center scroll-mt-11 text-emerald-700 dark:text-emerald-300"
        >
          <UIcon
            name="i-lucide-grid"
            class="mr-2 text-emerald-500 dark:text-emerald-300"
          />
          Puzzle Sets
        </UiSubheading>
      </template>
      <UiParagraph class="mb-1 dark:text-gray-300">
        With our <strong>Puzzle Set</strong> feature, users can generate
        customized training sets based on:
      </UiParagraph>
      <UiTypography>
        <ul class="list-disc list-inside space-y-2 mb-3">
          <li>
            <UIcon
              name="i-lucide-list"
              class="inline-block align-middle mb-0.5 mr-1 text-emerald-400 w-5 h-5 dark:text-emerald-300"
            /><strong>Number of puzzles</strong> – choose how long or short you
            want your set to be.
          </li>
          <li>
            <UIcon
              name="i-lucide-bar-chart"
              class="inline-block align-middle mb-0.5 mr-1 text-emerald-400 w-5 h-5 dark:text-emerald-300"
            /><strong>Average difficulty rating</strong> – target puzzles within
            your skill level.
          </li>
          <li>
            <UIcon
              name="i-lucide-shapes"
              class="inline-block align-middle mb-0.5 mr-1 text-emerald-400 w-5 h-5 dark:text-emerald-300"
            /><strong>Themes</strong> – focus on specific motifs like endgames,
            mating patterns, pins, forks, and more.
          </li>
        </ul>
      </UiTypography>
      <UiParagraph class="dark:text-gray-300">
        This tailored approach ensures that you’re always training with puzzles
        that matter most to your improvement.
      </UiParagraph>
    </UCard>

    <UCard
      class="shadow-md rounded-xl border-l-4 border-sky-400 bg-sky-50/80 px-8 py-4 dark:bg-gray-800/80 dark:border-sky-500"
    >
      <template #header>
        <UiSubheading
          id="progress-tracking"
          class="flex items-center scroll-mt-11 text-sky-700 dark:text-sky-300"
        >
          <UIcon
            name="i-lucide-bar-chart-3"
            class="mr-2 text-sky-500 dark:text-sky-300"
          />Progress Tracking
        </UiSubheading>
      </template>
      <UiParagraph class="mb-1 dark:text-gray-300">
        Your profile tracks every puzzle set you create and attempt. You’ll be
        able to monitor:
      </UiParagraph>
      <UiTypography>
        <ul class="list-disc list-inside space-y-2 mb-3">
          <li>
            <UIcon
              name="i-lucide-check-circle"
              class="inline-block align-middle mb-0.5 mr-1 text-sky-400 w-5 h-5 dark:text-sky-300"
            /><strong>Accuracy</strong> – see how often you solve puzzles
            correctly on the first try.
          </li>
          <li>
            <UIcon
              name="i-lucide-list"
              class="inline-block align-middle mb-0.5 mr-1 text-sky-400 w-5 h-5 dark:text-sky-300"
            /><strong>Number of puzzles solved</strong> – track your overall
            workload.
          </li>
          <li>
            <UIcon
              name="i-lucide-repeat"
              class="inline-block align-middle mb-0.5 mr-1 text-sky-400 w-5 h-5 dark:text-sky-300"
            /><strong>Cycles completed</strong> – visualize your repetitions to
            stay in line with the Woodpecker Method.
          </li>
        </ul>
      </UiTypography>
      <UiParagraph class="dark:text-gray-300">
        This data-driven feedback helps you stay accountable and optimize your
        training over time.
      </UiParagraph>
    </UCard>

    <div
      class="w-full my-10 h-0.5 bg-gray-200 rounded-full dark:bg-gray-700"
    ></div>

    <UCard
      class="shadow-md rounded-xl border-l-4 border-fuchsia-400 bg-fuchsia-50/80 text-center py-10 dark:bg-gray-800/80 dark:border-fuchsia-500"
    >
      <h2
        class="text-2xl md:text-3xl font-bold mb-2 text-fuchsia-700 flex items-center justify-center dark:text-fuchsia-300"
      >
        <UIcon
          name="i-lucide-rocket"
          class="mr-2 text-fuchsia-500 dark:text-fuchsia-300"
        />Ready to Train?
      </h2>
      <p class="mb-4 text-lg text-fuchsia-600 dark:text-fuchsia-200">
        Start your journey to tactical mastery. Register now or jump right in
        and try a puzzle set!
      </p>
      <div class="flex flex-wrap gap-4 justify-center mt-4">
        <NuxtLink to="/register"
          ><UButton color="fuchsia" size="lg" icon="i-lucide-user-plus"
            >Register</UButton
          ></NuxtLink
        >
        <NuxtLink to="/puzzle-set"
          ><UButton color="primary" size="lg" icon="i-lucide-swords"
            >Try a Puzzle Set</UButton
          ></NuxtLink
        >
      </div>
    </UCard>
  </section>
</template>
