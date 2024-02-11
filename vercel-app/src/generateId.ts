// the unique id is generated for each repository

const MAX_Len = 5;

export function generateId() {
    let ans = '';
    const subset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < MAX_Len; i++) {
        ans += subset.charAt(Math.floor(Math.random() * subset.length));
    }
    return ans;
}