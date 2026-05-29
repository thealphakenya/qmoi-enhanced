(async () => {
  try {
    const nodeMsw = await import("msw/node");
    logger.info("nodeMsw keys:", Object.keys(nodeMsw));
    logger.info("nodeMsw.rest?", !!(nodeMsw && nodeMsw.rest));
    const core = await import("msw");
    logger.info("core keys:", Object.keys(core));
    logger.info("core.rest?", !!(core && core.rest));
  } catch (e) {
    logger.error("err", e);
  }
})();
