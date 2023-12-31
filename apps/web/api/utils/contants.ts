//@TODO: fix TSConfig files in common, server and web workspace
const BE_ENDPOINT = process.env.NEXT_PUBLIC_BE_ENDPOINT;
export const SERVER_ENDPOINT = BE_ENDPOINT || "";
