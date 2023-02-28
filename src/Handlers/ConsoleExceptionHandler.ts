/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Log } from '@athenna/logger'
import { Config } from '@athenna/config'
import { String } from '@athenna/common'

export class ConsoleExceptionHandler {
  /**
   * The exception handler of all Artisan commands.
   */
  public async handle(error: any): Promise<void> {
    error.code = String.toSnakeCase(error.code || error.name).toUpperCase()

    const isInternalServerError = this.isInternalServerError(error)
    const isDebugMode = Config.get('app.debug', true)

    if (!error.prettify) {
      error = error.toAthennaException()
    }

    if (isInternalServerError && !isDebugMode) {
      error.name = 'Internal server error'
      error.message = 'An internal server exception has occurred.'

      delete error.stack
    }

    if (error.code === 'E_SIMPLE_CLI') {
      Log.channelOrVanilla('console').error(error.message)

      return process.exit(1)
    }

    Log.channelOrVanilla('exception').error(
      (await error.prettify()).concat('\n'),
    )

    return process.exit(1)
  }

  /**
   * Returns a boolean indicating if the error is an internal server error.
   */
  private isInternalServerError(error: any): boolean {
    return [
      'Error',
      'URIError',
      'TypeError',
      'EvalError',
      'RangeError',
      'SyntaxError',
      'InternalError',
      'ReferenceError',
    ].includes(error.name)
  }
}
