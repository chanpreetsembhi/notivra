<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Logo from '@/assets/logo.svg'
import { ArrowRight } from 'lucide-vue-next'
</script>

<template>
  <section
    class="relative flex h-svh flex-col overflow-hidden bg-white px-5 text-slate-900 dark:bg-slate-950 dark:text-slate-100"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 dark:opacity-0"
      style="
        background-image:
          linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
        background-size: 60px 60px;
        mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%);
        -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%);
      "
    ></div>

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
      style="
        background-image:
          linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        background-size: 60px 60px;
        mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%);
        -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%);
      "
    ></div>

    <div
      aria-hidden="true"
      class="pointer-events-none absolute -top-24 left-1/2 h-80 w-125 -translate-x-1/2 rounded-full bg-indigo-400/15 blur-3xl dark:bg-indigo-500/10"
    ></div>

    <header
      class="relative z-10 mx-auto flex w-full max-w-3xl shrink-0 items-center justify-between py-4"
    >
      <div class="flex items-center gap-2">
        <img :src="Logo" class="size-7" alt="Logo" />
        <span
          class="text-sm font-semibold tracking-tight text-slate-900 sm:text-base dark:text-slate-100"
        >
          Notivra
        </span>
      </div>

      <span
        class="rounded-full border border-indigo-300/60 bg-indigo-50 px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-widest text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-400"
      >
        Beta
      </span>
    </header>

    <main
      class="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center text-center"
    >
      <div
        class="mb-4 inline-flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.07em] text-slate-400 sm:mb-5 sm:text-[0.75rem] dark:text-slate-500"
      >
        <span
          class="inline-block size-1.5 animate-pulse rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/60 dark:bg-indigo-400 dark:shadow-indigo-400/60"
        ></span>
        Student Notes Platform
      </div>

      <h1
        class="mb-4 text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-slate-100"
      >
        Smarter Solutions.<br />
        <em class="italic text-indigo-600 dark:text-indigo-400">Learn Faster.</em>
      </h1>

      <p
        class="mx-auto mb-7 max-w-md text-sm font-light leading-relaxed text-slate-500 sm:mb-8 sm:text-base dark:text-slate-400"
      >
        A clean, distraction-free space to read student notes — from English Literature to NEP
        concepts. Summaries, key points, and structured content.
      </p>

      <div class="mb-8">
        <RouterLink
          to="/dashboard"
          class="group inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:-translate-y-px hover:bg-indigo-500 dark:bg-indigo-500 dark:shadow-indigo-500/20 dark:hover:bg-indigo-400"
        >
          Browse Notes
          <ArrowRight
            class="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </RouterLink>
      </div>

      <div
        class="flex items-center justify-center gap-5 rounded-xl border border-slate-200 bg-slate-50/80 px-6 py-3.5 backdrop-blur-sm sm:gap-8 sm:px-8 sm:py-4 dark:border-slate-700/50 dark:bg-slate-800/40"
      >
        <div class="flex flex-col items-center gap-0.5">
          <span class="text-sm font-semibold text-slate-900 sm:text-base dark:text-slate-100">
            NEP 2020
          </span>
          <span
            class="text-[0.6rem] uppercase tracking-wider text-slate-400 sm:text-[0.65rem] dark:text-slate-500"
          >
            Aligned
          </span>
        </div>

        <div class="h-7 w-px bg-slate-200 dark:bg-slate-700"></div>

        <div class="flex flex-col items-center gap-0.5">
          <span class="text-sm font-semibold text-slate-900 sm:text-base dark:text-slate-100">
            Simplified
          </span>
          <span
            class="text-[0.6rem] uppercase tracking-wider text-slate-400 sm:text-[0.65rem] dark:text-slate-500"
          >
            Complex Topics
          </span>
        </div>

        <div class="h-7 w-px bg-slate-200 dark:bg-slate-700"></div>

        <div class="flex flex-col items-center gap-0.5">
          <span class="text-sm font-semibold text-slate-900 sm:text-base dark:text-slate-100">
            Free
          </span>
          <span
            class="text-[0.6rem] uppercase tracking-wider text-slate-400 sm:text-[0.65rem] dark:text-slate-500"
          >
            For Students
          </span>
        </div>
      </div>
    </main>

    <footer
      class="relative z-10 mx-auto flex w-full max-w-3xl shrink-0 items-center justify-center gap-1.5 pb-4 pt-3 text-[0.7rem] font-light text-slate-400 dark:text-slate-600"
    >
      <svg class="size-3 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path
          fill-rule="evenodd"
          d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm8-3.5a1 1 0 011 1V8a1 1 0 11-2 0V5.5a1 1 0 011-1zm0 6a1 1 0 100-2 1 1 0 000 2z"
          clip-rule="evenodd"
        />
      </svg>
      Student-made app — not an official NEP or government application.
    </footer>
  </section>
</template>
