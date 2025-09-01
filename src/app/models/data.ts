export interface registerData extends LogInData,EmailData{
  "name": string,
  "rePassword":string,
  "phone":string
}
export interface LogInData extends EmailData{
  "password":string,
}
export interface EmailData{
  "email":string
}
export interface code{
  "resetCode":string
}
export interface newPassword extends EmailData{
  "newPassword":string
}
export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}
