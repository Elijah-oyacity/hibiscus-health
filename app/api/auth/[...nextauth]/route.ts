import NextAuth from "next-auth";
import authOptions from "@/lib/auth.config";

// Add diagnostic logs to track auth initialization
console.log("NextAuth route handler initializing with env:", process.env.NODE_ENV);

// Next.js 13+ route handlers must export from the top level
let handler;

// Simple try-catch wrapper to handle initialization errors
try {
  handler = NextAuth(authOptions);
  console.log("NextAuth handler created successfully");
} catch (error) {
  console.error("CRITICAL ERROR in NextAuth initialization:", error);
  
  // Create a fallback handler
  handler = () => new Response(
    JSON.stringify({ 
      error: "Authentication service unavailable",
      message: "The authentication service is temporarily unavailable"
    }),
    { status: 500, headers: { "Content-Type": "application/json" } }
  );
}

// Export handlers for API routes
export { handler as GET, handler as POST };
