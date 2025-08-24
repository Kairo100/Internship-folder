export default {
  storageTokenKeyName: 'accessToken',

  meEndpoint: '/auth/me',
  loginEndpoint: '/jwt/login',
  registerEndpoint: '/jwt/register',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
