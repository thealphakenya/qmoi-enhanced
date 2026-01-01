(async () => {
  try {
    const m = await import("msw");
    console.log("msw keys:", Object.keys(m));
    console.log("rest in m?", !!(m && m.rest));
    const n = await import("msw/node");
    console.log("msw/node keys:", Object.keys(n));
  } catch (e) {
    console.error("err", e);
  }
})();
