const TARGET_ORIGIN = "https://home.leorza.net";

export default {
  fetch(request) {
    const incoming = new URL(request.url);
    const target = new URL(TARGET_ORIGIN);

    target.pathname = incoming.pathname;
    target.search = incoming.search;

    return Response.redirect(target.toString(), 301);
  },
};
