import { ValueObject, ValueObjectProps } from "./../../common";
import {
  InvalidArgumentFormatError,
  handleError,
} from "./../../../exceptions";
import { Result } from "./../../../core";
export class Email extends ValueObject<string> {
  private static isValidEmailFormat(value: string): boolean {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(value);
  }

  protected validate(props: ValueObjectProps<string>): void {
    if (!Email.isValidEmailFormat(props._value)) {
      throw new InvalidArgumentFormatError(
        "Le format de l'adresse email est invalide."
      );
    }
  }

  static create(value: string): Result<Email> {
    try {
      const email = new Email({ _value: value });
      return Result.ok<Email>(email);
    } catch (e: any) {
    return handleError(e)  }
  }

  toString(): string {
    return this.props._value;
  }
}
