import { ApiProperty } from '@nestjs/swagger'
import { User } from '@prisma/client'

class RegisterResponse {
  @ApiProperty()
  private uuid: string
  private username: string
  private email: string
  private firstName: string
  private lastName: string
  private city: string
  private country: string
  private createdAt: Date
  private updatedAt: Date

  public constructor(user: User) {
    this.uuid = user.uuid
    this.username = user.username
    this.email = user.email
    this.firstName = user.first_name
    this.lastName = user.last_name
    this.city = user.city
    this.country = user.country
  }

  public getUuid(): string {
    return this.uuid
  }

  public setUuid(uuid: string): void {
    this.uuid = uuid
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

  public getCity(): string {
    return this.city
  }

  public setCity(city: string): void {
    this.city = city
  }

  public getCountry(): string {
    return this.country
  }

  public setCountry(country: string): void {
    this.country = country
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt
  }

  public getUpdatedAt(): Date {
    return this.updatedAt
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt
  }
  x
}

export default RegisterResponse
