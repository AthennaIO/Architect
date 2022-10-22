/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@athenna/common'

export class NotFoundTemplateException extends Exception {
  /**
   * Creates a new instance of NotFoundTemplateException.
   *
   * @param {string} templateName
   */
  constructor(templateName) {
    const content = `The ({yellow} "${templateName}") has not been found. Add it using ({yellow} "Template.addTemplate") method.`

    super(content, 500, 'E_SIMPLE_CLI')
  }
}
