/* tslint:disable */
/**
 * This file was automatically generated by Payload CMS.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "participantscontroller".
 */
export interface TeilnehmendenverwalterIn {
  id: string;
  email?: string;
  resetPasswordToken?: string;
  resetPasswordExpiration?: string;
  loginAttempts?: number;
  lockUntil?: string;
  name: string;
  tribe:
    | '131202'
    | '131203'
    | '131204'
    | '131206'
    | '131207'
    | '131208'
    | '131209'
    | '131210'
    | '131212'
    | '131213'
    | '1312';
  level: 'woelflinge' | 'jupfis' | 'pfadis' | 'rover' | 'all' | 'kitchen';
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "participants".
 */
export interface TeilnehmerIn {
  id: string;
  role: 'participant' | 'leader' | 'helper';
  orderId: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'female' | 'male' | 'divers';
  email: string;
  phoneNumber?: string;
  address: {
    street: string;
    zipCode: string;
    city: string;
  };
  tribe:
    | '131202'
    | '131203'
    | '131204'
    | '131206'
    | '131207'
    | '131208'
    | '131209'
    | '131210'
    | '131212'
    | '131213'
    | '1312';
  level: 'woelflinge' | 'jupfis' | 'pfadis' | 'rover' | 'none';
  food: {
    eatingBehaviour: 'vegetarian' | 'vegan' | 'meat';
    intolerances?: string;
  };
  vaccinations: {
    tetanus: boolean;
    fsme: boolean;
    covid: 'na' | 'no' | 'yes' | 'boostered';
  };
  diseases?: string;
  healthInsurance: 'gkv' | 'pkv';
  swimmer: boolean;
  legalGuardian?: {
    name?: string;
    phoneNumber?: string;
  };
  contacts?: {
    name: string;
    phoneNumber: string;
    id?: string;
  }[];
  presence: {
    '4': boolean;
    '5': boolean;
    '6': boolean;
    '7': boolean;
    '8': boolean;
    '9': boolean;
    '10': boolean;
    '11': boolean;
  };
  comments?: string;
  juleica?: {
    number?: string;
    terminates?: string;
  };
  clearance?: {
    idNumber?: string;
    nami?: boolean;
  };
  course?: string;
  receivedRegistration: boolean;
  receivedLeaderInfo: boolean;
  receivedPhotoPermission: 'no' | 'yes' | 'never';
  review: {
    by?: string;
    at?: string;
    course: boolean;
    juleica: boolean;
    clearance: boolean;
  };
  state: 'new' | 'confirmed' | 'cancelled';
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  email?: string;
  resetPasswordToken?: string;
  resetPasswordExpiration?: string;
  loginAttempts?: number;
  lockUntil?: string;
}
