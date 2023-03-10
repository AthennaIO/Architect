/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { File } from '@athenna/common'

export class Rc {
  public rcFile: File
  public rc: Record<string, any>

  public constructor() {
    this.setRcFile(Path.pwd('.athennarc.json'), true)
  }

  /**
   * Set the RC file that the Rc class should work with.
   */
  public setRcFile(path = Path.pwd('.athennarc.json'), pjson = false): Rc {
    if (Config.is('rc.isInPackageJson', true) && pjson) {
      this.rcFile = new File(Path.pwd('package.json'))
      this.rc = this.rcFile.getContentAsJsonSync({ saveContent: true }).athenna

      return this
    }

    this.rcFile = new File(path)
    this.rc = this.rcFile.getContentAsJsonSync()

    return this
  }

  /**
   * Set or subscribe a KEY:VALUE property in some property of the RC configuration file.
   * You can also pass any value as second parameter to set multiple properties at once.
   *
   * @example
   * ```ts
   * this.rc.setTo('commandsManifest', 'test', '#app/Console/Commands/TestCommand')
   * ```
   * Or:
   * @example
   * ```ts
   * this.rc.setTo('commandsManifest', { test: '#app/Console/Commands/TestCommand' })
   * ```
   */
  public setTo(rcKey: string, key: string | any, value?: any): Rc {
    if (value) {
      value = {
        ...Config.get(`rc.${rcKey}`, {}),
        [key]: value,
      }
    }

    Config.set(`rc.${rcKey}`, value || key)

    this.rc[rcKey] = Config.get(`rc.${rcKey}`)

    return this
  }

  /**
   * Push a new value in some property of the RC configuration file.
   *
   * @example
   * ```ts
   * this.rc.pushTo('commands', '#app/Console/Commands/TestCommand')
   * ```
   */
  public pushTo(rcKey: string, value: any): Rc {
    Config.set(`rc.${rcKey}`, [...Config.get(`rc.${rcKey}`, []), value])

    this.rc[rcKey] = Config.get(`rc.${rcKey}`)

    return this
  }

  /**
   * Save the new content in the Rc file.
   */
  public async save(): Promise<void> {
    const content = Config.is('rc.isInPackageJson', true)
      ? { ...JSON.parse(this.rcFile.content.toString()), athenna: this.rc }
      : this.rc

    await this.rcFile.setContent(JSON.stringify(content, null, 2).concat('\n'))
  }
}
