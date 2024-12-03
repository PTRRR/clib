import { createClock } from "../lib";

createClock((clock) => {
  clock.addCustomShape({
    count: 24,
    handler: async (index, instance) => {
      return instance.createTextElement({
        text: "hello",
      });
    },
  });
});
