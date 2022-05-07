/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Config, Folder, Path } from '@secjs/utils'

import { Artisan } from '#src/index'
import { Kernel } from '#tests/Stubs/app/Console/Kernel'
import { ArtisanProvider } from '#src/Providers/ArtisanProvider'
import { LoggerProvider } from '@athenna/logger/providers/LoggerProvider'

test.group('ListTest', group => {
  group.each.setup(async () => {
    await new Folder(Path.stubs('app')).copy(Path.app())
    await new Folder(Path.stubs('config')).copy(Path.config())

    await new Config().safeLoad(Path.config('app.js'))
    await new Config().safeLoad(Path.config('logging.js'))

    new LoggerProvider().register()
    new ArtisanProvider().register()

    const kernel = new Kernel()

    await kernel.registerErrorHandler()
    await kernel.registerCommands()
  })

  group.each.teardown(async () => {
    await Folder.safeRemove(Path.app())
    await Folder.safeRemove(Path.config())
  })

  test('should be able to list all commands from eslint alias', async () => {
    await Artisan.call('list eslint')
  }).timeout(60000)

  test('should be able to list all commands from make alias', async () => {
    await Artisan.call('list make')
  }).timeout(60000)

  test('should be able to list all commands from route alias', async () => {
    await Artisan.call('list route')
  }).timeout(60000)

  test('should be able to list all commands from list alias', async () => {
    await Artisan.call('list list')
  }).timeout(60000)

  test('should be able to list all commands from not-existent alias', async () => {
    await Artisan.call('list not-existent')
  }).timeout(60000)
})
