import { onBeforeUnmount, unref, watchEffect } from "vue";

const resolveTarget = (target) => {
  if (typeof target === "function") return target();
  const unrefTarget = unref(target);
  return unrefTarget || target;
};

export const useEventListener = (target, event, handler, options) => {
  const stop = watchEffect((onCleanup) => {
    const el = resolveTarget(target);
    if (!el || !el.addEventListener) return;
    el.addEventListener(event, handler, options);
    onCleanup(() => {
      el.removeEventListener(event, handler, options);
    });
  });

  onBeforeUnmount(() => {
    stop();
  });

  return stop;
};
