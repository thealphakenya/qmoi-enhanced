(async () => {
  try {
    const handlersMod = await import("./src/mocks/handlers");
    if (typeof handlersMod.getHandlers === "function") {
      const handlers = await handlersMod.getHandlers();
      console.log("handlers.length =", handlers.length);
      handlers.forEach((h, i) =>
        console.log(i, typeof h, h && h.constructor && h.constructor.name)
      );
    } else {
      console.log(
        "handlers export not function; keys:",
        Object.keys(handlersMod)
      );
    }
  } catch (e) {
    console.error("err", e);
  }
})();
