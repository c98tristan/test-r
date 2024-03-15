import { split, combine } from 'shamirs-secret-sharing-ts'
export class Keys {
  seedPhase: string

  constructor(seedPhase: string) {
    this.seedPhase = seedPhase
  }

  generateKeys(shares: number, threshold: number): Array<Buffer> {
    try {
      const shareKeys = split(this.seedPhase, { shares, threshold })

      return shareKeys
    } catch (error) {
      throw error
    }
  }

  recoverKeys(shareKeys: Array<string | Buffer>): string {
    try {
      const seedPhase = combine(shareKeys)

      return seedPhase.toString('utf-8')
    } catch (error) {
      throw error
    }
  }
}
