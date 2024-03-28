export type User = {
     id?: number,
     username: string,
     password?: string,
     role: "admin" | "user",
     theme?: "dark" | "light"
};
export type DbActionResult<T> = {
     success: boolean,
     result: T | null,
     message?: string
};
export type State = {
     errors?: {
          username?: string[];
          password?: string[];
          password_rep?: string[];
          role?: string[];
          theme?: string[];
          general?: string[];
     };
     message?: string | null;
};



export const publicRoutes = [
     "/",
];

export const authRoutes = [
     "/login",
];

export const adminRoute = "/usermanager";

export const defaultLoginRedirect = "/home";