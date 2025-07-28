"use client"

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  useEffect(() => {
    const handleOAuthCallback = async () => {
      console.log('OAuth callback started, returnUrl:', returnUrl);
      const supabase = createClient();
      
      try {
        // First, try to get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('Initial session check:', { session: !!session, error: sessionError });
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          router.replace(`/auth/signin?redirect=${encodeURIComponent(returnUrl)}`);
          return;
        }

        if (session?.user) {
          // Update user metadata to include platform
          await supabase.auth.updateUser({
            data: { 
              platform: 'buildunia',
              last_login: new Date().toISOString()
            }
          });

          // User is authenticated, redirect to return URL
          console.log('User authenticated, redirecting to:', returnUrl);
          router.replace(returnUrl);
          return;
        }

        // If no session, check if we're in an OAuth callback
        const hash = window.location.hash;
        const urlParams = new URLSearchParams(window.location.search);
        
        console.log('OAuth parameters check:', { 
          hasHash: !!hash, 
          hasCode: urlParams.has('code'), 
          hasError: urlParams.has('error'),
          hash: hash.substring(0, 50) + '...',
          search: window.location.search
        });
        
        if (hash || urlParams.has('code') || urlParams.has('error')) {
          // This is an OAuth callback, wait a moment for the session to be established
          console.log('OAuth callback detected, waiting for session...');
          setTimeout(async () => {
            const { data: { session: retrySession }, error: retryError } = await supabase.auth.getSession();
            
            console.log('Retry session check:', { session: !!retrySession, error: retryError });
            
            if (retryError) {
              console.error('Retry session error:', retryError);
              router.replace(`/auth/signin?redirect=${encodeURIComponent(returnUrl)}`);
              return;
            }

            if (retrySession?.user) {
              // Update user metadata to include platform
              await supabase.auth.updateUser({
                data: { 
                  platform: 'buildunia',
                  last_login: new Date().toISOString()
                }
              });

              console.log('User authenticated on retry, redirecting to:', returnUrl);
              router.replace(returnUrl);
            } else {
              // Try one more time after a longer delay
              console.log('No session on retry, trying again...');
              setTimeout(async () => {
                const { data: { session: finalSession } } = await supabase.auth.getSession();
                console.log('Final session check:', { session: !!finalSession });
                if (finalSession?.user) {
                  // Update user metadata to include platform
                  await supabase.auth.updateUser({
                    data: { 
                      platform: 'buildunia',
                      last_login: new Date().toISOString()
                    }
                  });

                  console.log('User authenticated on final try, redirecting to:', returnUrl);
                  router.replace(returnUrl);
                } else {
                  console.log('No session found, redirecting to signin');
                  router.replace(`/auth/signin?redirect=${encodeURIComponent(returnUrl)}`);
                }
              }, 2000);
            }
          }, 1000);
        } else {
          // No OAuth parameters and no session, redirect to signin
          console.log('No OAuth parameters found, redirecting to signin');
          router.replace(`/auth/signin?redirect=${encodeURIComponent(returnUrl)}`);
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        router.replace(`/auth/signin?redirect=${encodeURIComponent(returnUrl)}`);
      }
    };

    handleOAuthCallback();
  }, [router, returnUrl]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <span className="ml-4 text-lg text-gray-400">Signing you in...</span>
      </div>
    </div>
  );
}

export default function OAuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <span className="ml-4 text-lg text-gray-400">Loading...</span>
        </div>
      </div>
    }>
      <OAuthCallbackContent />
    </Suspense>
  );
}
