import { Component, For } from "solid-js";
import "./styles.scss";

export const AemeathBackground: Component = () => {
  // Create a fixed number of stars and meteors with random properties
  const stars = Array.from({ length: 50 }, (_, i) => ({
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      "animation-delay": `${Math.random() * 5}s`,
      "animation-duration": `${Math.random() * 3 + 2}s`,
    },
  }));

  const meteors = Array.from({ length: 6 }, (_, i) => ({
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 50}%`, // Top half
      "animation-delay": `${Math.random() * 10}s`, // Staggered start
      "animation-duration": `${Math.random() * 2 + 2}s`,
    },
  }));

  return (
    <div class="aemeath-background">
      <div class="nebula-layer layer-1"></div>
      <div class="nebula-layer layer-2"></div>
      <div class="nebula-layer layer-3"></div>
      
      {/* CSS-only stars using box-shadow would be better for performance than many divs, 
          but for 50 twinkling stars, divs are fine and easier to animate individually. */}
      <div class="stars-container">
        <For each={stars}>
          {(star) => <div class="star" style={star.style}></div>}
        </For>
      </div>

      <div class="meteors-container">
        <For each={meteors}>
          {(meteor) => <div class="meteor" style={meteor.style}></div>}
        </For>
      </div>
    </div>
  );
};
