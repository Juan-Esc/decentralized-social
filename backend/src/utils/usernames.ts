export function getUsernameWithoutSuffix(username: string) {
    const ogUsername = username;
    if (username.endsWith(".deso")) {
        username = username.slice(0, -5)
    }
    return { username, ogUsername }
}