"use client";

import Typewriter from "typewriter-effect";

type TypewriterClientProps = {
  words: string[];
};

export default function TypewriterClient({ words }: TypewriterClientProps) {
  return (
    <span className="block text-base font-bold text-zinc-500 dark:text-zinc-400 md:text-2xl">
      <Typewriter
        options={{
          loop: true,
          delay: 80,
          deleteSpeed: 40,
          cursor: "_",
          cursorClassName: "animate-blink",
        }}
        onInit={(typewriter) => {
          words.forEach((word) => {
            typewriter.typeString(word).pauseFor(1200).deleteAll().pauseFor(350);
          });
          typewriter.start();
        }}
      />
    </span>
  );
}
