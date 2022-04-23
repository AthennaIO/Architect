/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ConsoleKernel } from 'src/Kernels/ConsoleKernel'

export class Kernel extends ConsoleKernel {
  /**
   * Register the commands for the application.
   *
   * @return void
   */
  protected commands = [
    import('src/Commands/Route/List'),
    import('src/Commands/Eslint/Fix'),
    import('src/Commands/List/Make'),
    import('src/Commands/List/Route'),
    import('src/Commands/List/Eslint'),
    import('src/Commands/Make/Facade'),
    import('src/Commands/Make/Command'),
    import('src/Commands/Make/Service'),
    import('src/Commands/Make/Provider'),
    import('src/Commands/Make/Exception'),
    import('src/Commands/Make/Middleware'),
    import('src/Commands/Make/Controller'),
  ]
}
