import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'

const GoogleAuthProviderWrapper = ({children}) => {
  return (
    <GoogleOAuthProvider clientId="724923337567-rmahvb1gr5pre6u7o11sj9ntm57qo70s.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  )
}

export default GoogleAuthProviderWrapper
