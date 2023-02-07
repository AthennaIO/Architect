/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Config } from '@athenna/config'
import { ViewProvider } from '@athenna/view'
import { File, Folder } from '@athenna/common'
import { LoggerProvider } from '@athenna/logger'
import { ExitFaker } from '#tests/Helpers/ExitFaker'
import { Artisan, ConsoleKernel, ArtisanProvider } from '#src'

test.group('MakeCommandTest', group => {
  group.each.setup(async () => {
    ExitFaker.fake()

    process.env.IS_TS = 'true'

    await Config.loadAll(Path.stubs('config'))

    new ViewProvider().register()
    new LoggerProvider().register()
    new ArtisanProvider().register()

    const kernel = new ConsoleKernel()

    await kernel.registerExceptionHandler()
    await kernel.registerCommands()
  })

  group.each.teardown(async () => {
    ExitFaker.release()

    await Folder.safeRemove(Path.app())
  })

  test('should be able to create a command file', async ({ assert }) => {
    await Artisan.call('make:command TestCommand')

    const path = Path.console('Commands/TestCommand.ts')

    assert.isTrue(await File.exists(path))
    assert.isTrue(ExitFaker.faker.calledOnceWith(0))
  })

  test('should throw an exception when the file already exists', async ({ assert }) => {
    await Artisan.call('make:command TestCommand')
    await Artisan.call('make:command TestCommand')

    assert.isTrue(ExitFaker.faker.calledWith(1))
  })
})