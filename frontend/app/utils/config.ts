export const ISDEV = typeof window !== 'undefined' && window.location.hostname === 'localhost' ? true : false;
export const API_URL = (ISDEV) ? "http://localhost:8787" : "https://deso.juem-312.workers.dev"
export const CONTRACT_ADDRESS = "0x4b99920EFE4d9DaBB08888A8DDEC9257823E68F8"
export const ALCHEMY_API_URL = "https://polygon-amoy.g.alchemy.com/v2/HgjupZyTSmjoHO4e65MiP0HylJystfB7"