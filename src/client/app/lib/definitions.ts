export type User = {
     id?: number,
     username: string,
     password?: string,
     role: "admin"|"user",
     theme?: "dark"|"light"
};