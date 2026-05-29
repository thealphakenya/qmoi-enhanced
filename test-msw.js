(async () => {
  try {
    const m = await import("msw");
    logger.info("msw keys:", Object.keys(m));
    logger.info("rest in m?", !!(m && m.rest));
    const n = await import("msw/node");
    logger.info("msw/node keys:", Object.keys(n));
  } catch (e) {
    logger.error("err", e);
  }
})();
