export type User = {
     id?: number,
     username: string,
     password?: string,
     role: "admin"|"user",
     theme?: "dark"|"light"
};
export type DbActionResult<T> = {
     success:boolean,
     result:T|null,
     message?:string
};