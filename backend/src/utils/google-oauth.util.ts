import { TRPCError } from '@trpc/server'

interface GoogleUserInfo {
  id: string
  email: string
  name: string
  picture?: string
  verified_email: boolean
}

/**
 * Googleのアクセストークンからユーザー情報を取得
 */
export async function getGoogleUserInfo(
  accessToken: string
): Promise<GoogleUserInfo> {
  try {
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Google API error: ${response.statusText}`)
    }

    const userInfo = await response.json()
    return userInfo
  } catch (error) {
    console.error('Failed to fetch Google user info:', error)
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Google認証に失敗しました'
    })
  }
}

/**
 * Googleの認証コードをアクセストークンに交換
 */
export async function exchangeGoogleCode(
  code: string,
  redirectUri: string
): Promise<{ access_token: string; id_token: string }> {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Google OAuth credentials not configured'
    })
  }

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Google token exchange failed:', errorData)
      throw new Error(`Token exchange failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to exchange Google code:', error)
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Google認証コードの検証に失敗しました'
    })
  }
}
