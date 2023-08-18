// Without a defined matcher, this one line applies next-auth 
// to the entire project
// export { default } from "next-auth/middleware"
// we no longer need code above

// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage

import { withAuth, NextRequestWithAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    //  withAuth auguments your "Request" with the user's token.
    function middleware(request: NextRequestWithAuth){
        console.log(request.nextUrl.pathname)
        console.log(request.nextauth.token)

        if (request.nextUrl.pathname.startsWith("/extra")
        && request.nextauth.token?.role !== "admin"){
          return NextResponse.rewrite(
            new URL("/denied", request.url)
          )  
     }

    //  the above if statement takes the user to the Denied page if the role is not an admin

    if (request.nextUrl.pathname.startsWith("/client")
        && request.nextauth.token?.role !== "admin"
        && request.nextauth.token?.role !== "manager"){
            return NextResponse.rewrite(
                new URL("/denied", request.url)
              ) 
        }
    }, 
    {
        callbacks: {
            authorized: ({ token }) => !!token //just to verify that there's a token
        },
    }
)

// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = { matcher: ["/extra", "/client", "/dashboard" ] }