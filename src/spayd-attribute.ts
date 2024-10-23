export class SpaydAttribute<T extends string> {
  constructor(public name: string, public value: T, public validator?: RegExp | ((value: T) => boolean)) {
    if (this.validator && !this.isValid())
      throw new Error(`Invalid value for attribute ${this.name}: ${this.value}`)
  }

  isValid(): boolean {
    return this.validator == null || (typeof this.validator === 'function' ? this.validator(this.value) : this.validator.test(this.value))
  }

  toString(): string {
    return `${this.name}:${this.value}`
  }
}
