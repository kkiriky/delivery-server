export interface SocialLoginParams {
  email: string;
  nickname: string;
}

/* Kakao */
export interface KakaoUserInfo {
  id: number;
  connected_at: Date;
  properties: KakaoProperty;
  kakao_account: KakaoAccount;
}

interface KakaoAccount {
  profile_nickname_needs_agreement: boolean;
  profile: KakaoProperty;
  has_email: boolean;
  email_needs_agreement: boolean;
  is_email_valid: boolean;
  is_email_verified: boolean;
  email: string;
}

interface KakaoProperty {
  nickname: string;
}
/* Naver */
export interface NaverLoginResponse {
  resultcode: string;
  message: string;
  response: NaverUserInfo;
}

interface NaverUserInfo {
  id: string;
  nickname: string;
  email: string;
}
