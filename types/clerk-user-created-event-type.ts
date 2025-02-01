interface EmailVerification {
    status: string;
    strategy: string;
  }
  
  interface EmailAddress {
    email_address: string;
    id: string;
    linked_to: any[];
    object: string;
    verification: EmailVerification;
  }
  
  interface HttpRequest {
    client_ip: string;
    user_agent: string;
  }
  
  interface EventAttributes {
    http_request: HttpRequest;
  }
  
  interface UserData {
    birthday: string;
    created_at: number;
    email_addresses: EmailAddress[];
    external_accounts: any[];
    external_id: string;
    first_name: string;
    gender: string;
    id: string;
    image_url: string;
    last_name: string;
    last_sign_in_at: number;
    object: string;
    password_enabled: boolean;
    phone_numbers: any[];
    primary_email_address_id: string;
    primary_phone_number_id: string | null;
    primary_web3_wallet_id: string | null;
    private_metadata: Record<string, unknown>;
    profile_image_url: string;
    public_metadata: Record<string, unknown>;
    two_factor_enabled: boolean;
    unsafe_metadata: Record<string, unknown>;
    updated_at: number;
    username: string | null;
    web3_wallets: any[];
  }
  
  export interface ClerkUserCreatedEvent {
    data: UserData;
    event_attributes: EventAttributes;
    object: string;
    timestamp: number;
    type: string;
  }
  