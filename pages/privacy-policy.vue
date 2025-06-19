<template>
  <UiHeading class="mb-6">Privacy Policy</UiHeading>

  <!-- Termly -->
  <UCard class="w-full">
    <template #header>
      <div class="flex justify-between items-center gap-2">
        <span class="font-bold">Last updated June 08, 2025</span>
        <AppPrivacyPolicyLogo />
      </div>
    </template>

    <div
      class="prose dark:prose-invert min-h-[100vh] !max-w-none prose-a:text-primary-500 dark:prose-a-primary-400"
    >
      <div v-if="loading" class="space-y-6">
        <div v-for="(section, index) in 8" :key="index" class="space-y-2">
          <!-- Simulated heading -->
          <USkeleton
            :class="[
              'rounded',
              'h-5',
              headingWidths[index % headingWidths.length],
            ]"
          />

          <!-- Simulated paragraph lines -->
          <USkeleton
            v-for="n in 3"
            :key="n"
            :class="[
              'rounded',
              'h-4',
              paragraphWidths[(index + n) % paragraphWidths.length],
            ]"
          />
        </div>
      </div>

      <div v-else v-html="htmlContent"></div>
    </div>
  </UCard>

  <!-- Ezoic -->
  <UCard class="mt-10">
    <div>
      <section>
        <UiHeading class="text-xl font-semibold mb-6">Ezoic Services</UiHeading>
        <p class="mb-4">
          This website uses the services of
          <strong>Ezoic Inc.</strong> (“Ezoic”), including to manage third-party
          interest-based advertising. Ezoic may employ a variety of technologies
          on this website, including tools to serve content, display
          advertisements, and enable advertising to visitors of this website,
          which may utilize first and third-party cookies.
        </p>
        <p class="mb-4">
          A cookie is a small text file sent to your device by a web server that
          enables the website to remember information about your browsing
          activity. First-party cookies are created by the site you are
          visiting, while third-party cookies are set by domains other than the
          one you're visiting. Ezoic and our partners may place third-party
          cookies, tags, beacons, pixels, and similar technologies to monitor
          interactions with advertisements and optimize ad targeting.
        </p>
        <p class="mb-4">
          <strong>Note:</strong> Disabling cookies may limit access to certain
          content and features on the website. Rejecting cookies does not
          eliminate advertisements but will result in non-personalized
          advertising. You can find more information about cookies and how to
          manage them
          <a
            href="https://www.allaboutcookies.org/"
            target="_blank"
            rel="noopener"
            class="text-primary-500 underline"
            >here</a
          >.
        </p>
        <div class="mb-4">
          <p class="font-medium mb-1">
            The following information may be collected, used, and stored in a
            cookie when serving personalized ads:
          </p>
          <ul class="list-disc list-inside ml-4">
            <li>IP address</li>
            <li>Operating system type and version</li>
            <li>Device type</li>
            <li>Language preferences</li>
            <li>Web browser type</li>
            <li>Email (in a hashed or encrypted form)</li>
          </ul>
        </div>
        <p class="mb-4">
          Ezoic and its partners may use this data in combination with
          information that has been independently collected to deliver targeted
          advertisements across various platforms and websites. Ezoic’s partners
          may also gather additional data, such as unique IDs, advertising IDs,
          geolocation data, usage data, device information, traffic data,
          referral sources, and interactions between users and websites or
          advertisements, to create audience segments for targeted advertising
          across different devices, browsers, and apps. You can find more
          information about interest-based advertising and how to manage them
          <a
            href="https://www.youronlinechoices.com/"
            target="_blank"
            rel="noopener"
            class="text-primary-500 underline"
            >here</a
          >.
        </p>
        <p class="mb-2">
          You can view Ezoic’s privacy policy
          <a
            href="https://www.ezoic.com/privacy-policy/"
            target="_blank"
            rel="noopener"
            class="text-primary-500 underline"
            >here</a
          >, or for additional information about Ezoic’s advertising and other
          partners, you can view Ezoic’s advertising partners
          <a
            href="https://www.ezoic.com/ad-partners/"
            target="_blank"
            rel="noopener"
            class="text-primary-500 underline"
            >here</a
          >.
        </p>

        <span id="ezoic-privacy-policy-embed"></span>
      </section>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const htmlContent = ref("");
const loading = ref(true);

const headingWidths = ["w-1/2", "w-1/3", "w-1/4"];
const paragraphWidths = ["w-full", "w-5/6", "w-3/4", "w-2/3"];

onMounted(async () => {
  const res = await fetch("/privacy-policy.html");
  htmlContent.value = await res.text();
  loading.value = false;
});
</script>
