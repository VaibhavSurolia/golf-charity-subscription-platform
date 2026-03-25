export const getURL = () => {
  // If we are in the browser, always use the current window origin.
  // This is the most reliable for handling multiple Vercel deployment URLs.
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/`;
  }

  // Fallback for server-side usage (e.g. metadata or redirect in server context)
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your Vercel URL in environment variables
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Manual Vercel URL
    process?.env?.VERCEL_URL ?? // Automatically set by Vercel on server-side
    'http://localhost:3000/'

  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
  return url
}
