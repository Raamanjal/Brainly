declare global{
    namespace Express{
        export interface Request{
            userid?:string;
    }
}}

export {}