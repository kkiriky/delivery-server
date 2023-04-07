export interface KakaoUserInfo {
  id: number;
  connected_at: Date;
  properties: KakaoProperty;
  kakao_account: KakaoAccount;
}

export interface KakaoAccount {
  profile_nickname_needs_agreement: boolean;
  profile: KakaoProperty;
  has_email: boolean;
  email_needs_agreement: boolean;
  is_email_valid: boolean;
  is_email_verified: boolean;
  email: string;
}

export interface KakaoProperty {
  nickname: string;
}
