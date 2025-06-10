import { ApiProperty } from '@nestjs/swagger'

class RegisterRequest {
  @ApiProperty()
  private firstName: string

  @ApiProperty()
  private lastName: string

  @ApiProperty()
  private country: string

  @ApiProperty()
  private city: string

  @ApiProperty()
  private username: string

  @ApiProperty()
  private email: string

  @ApiProperty()
  private password: string

  public getFirstName(): string {
    return this.firstName
  }

  public setFirstName(firstName: string): void {
    this.firstName = firstName
  }

  public getLastName(): string {
    return this.lastName
  }

  public setLastName(lastName: string): void {
    this.lastName = lastName
  }

  public getCountry(): string {
    return this.country
  }

  public setCountry(country: string): void {
    this.country = country
  }

  public getCity(): string {
    return this.city
  }

  public setCity(city: string): void {
    this.city = city
  }

  public getUsername(): string {
    return this.username
  }

  public setUsername(username: string): void {
    this.username = username
  }

  public getEmail(): string {
    return this.email
  }

  public setEmail(email: string): void {
    this.email = email
  }

  public getPassword(): string {
    return this.password
  }

  public setPassword(password: string): void {
    this.password = password
  }

  public validate(): boolean {
    if (!this.firstName) return false
    if (!this.lastName) return false
    if (!this.country) return false
    if (!this.city) return false
    if (!this.username) return false
    if (!this.email) return false
    if (!this.password) return false
    return true
  }
}

export default RegisterRequest
