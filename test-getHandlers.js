(async () => {
  try {
    const handlersMod = await import("./src/
    if (typeof handlersMod.getHandlers === "function") {
      const handlers = await handlersMod.getHandlers();
      logger.info("handlers.length =", handlers.length);
      handlers.forEach((h, i) =>
        logger.info(i, typeof h, h && h.constructor && h.constructor.name),
      );
    } else {
      logger.info(
        "handlers export not function; keys:",
        Object.keys(handlersMod),
      );
    }
  } catch (e) {
    logger.error("err", e);
  }
})();
