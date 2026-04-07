import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProfileFilter {
    hasPets?: boolean;
    hasElderlyLovedOnes?: boolean;
    firstNameContains?: string;
    companyContains?: string;
}
export interface ProfileRecord {
    timestamp: Time;
    profile: Profile;
}
export type Time = bigint;
export interface Profile {
    bio: string;
    hasPets: boolean;
    hasElderlyLovedOnes: boolean;
    socialLinks: {
        linkedin: string;
        twitter: string;
        instagram: string;
        facebook: string;
    };
    email: string;
    website: string;
    company: string;
    jobTitle: string;
    address: {
        zip: string;
        street: string;
        country: string;
        city: string;
        state: string;
    };
    phone: string;
    lastName: string;
    firstName: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrReplaceProfile(phone: string, profile: Profile): Promise<void>;
    deleteAllProfiles(): Promise<void>;
    deleteProfile(phone: string): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getFilteredProfiles(filter: ProfileFilter): Promise<Array<ProfileRecord>>;
    getProfile(phone: string): Promise<ProfileRecord | null>;
    getProfileCount(): Promise<bigint>;
    getProfileHistory(phone: string): Promise<Array<ProfileRecord>>;
    getProfilesWithElderlyLovedOnes(): Promise<Array<ProfileRecord>>;
    getProfilesWithPets(): Promise<Array<ProfileRecord>>;
    isCallerAdmin(): Promise<boolean>;
    listProfiles(): Promise<Array<ProfileRecord>>;
    searchProfilesByCompany(company: string): Promise<Array<ProfileRecord>>;
    searchProfilesByName(name: string): Promise<Array<ProfileRecord>>;
}
