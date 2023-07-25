/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'reflect-metadata'

import { Test, ExitFaker } from '@athenna/test'
import type { Context } from '@athenna/test/types'
import { CommanderHandler, ConsoleKernel } from '#src'
import { BaseCommandTest } from '#tests/helpers/BaseCommandTest'
import { ThrowCommand } from '#tests/stubs/commands/ThrowCommand'

export default class ConsoleKernelTest extends BaseCommandTest {
  @Test()
  public async shouldBeAbleToRegisterCommandsUsingConsoleKernel({ assert }: Context) {
    CommanderHandler.getCommander<any>().commands = []

    await new ConsoleKernel().registerCommands()

    assert.isDefined(CommanderHandler.getCommands()['make:command <name>'])
  }

  @Test()
  public async shouldBeAbleToRegisterCommandsByArgvUsingConsoleKernel({ assert }: Context) {
    CommanderHandler.getCommander<any>().commands = []

    await new ConsoleKernel().registerCommands(['node', 'artisan', 'make:command'])

    assert.isDefined(CommanderHandler.getCommands()['make:command <name>'])
  }

  @Test()
  public async shouldBeAbleToRegisterRouteFilesUsingConsoleKernel({ assert }: Context) {
    CommanderHandler.getCommander<any>().commands = []

    await new ConsoleKernel().registerRouteCommands('./bin/console.ts')

    assert.deepEqual(Config.get('rc.commands.hello'), {
      loadApp: false,
      stayAlive: false,
      environments: ['hello'],
    })
    assert.isDefined(CommanderHandler.getCommands()['hello <hello>'])
  }

  @Test()
  public async shouldBeAbleToRegisterRouteFilesWithImportAliasUsingConsoleKernel({ assert }: Context) {
    CommanderHandler.getCommander<any>().commands = []

    await new ConsoleKernel().registerRouteCommands('#tests/stubs/routes/console')

    assert.isDefined(CommanderHandler.getCommands()['importalias'])
  }

  @Test()
  public async shouldBeAbleToSetCustomExceptionHandlerUsingConsoleKernel({ assert }: Context) {
    CommanderHandler.setExceptionHandler(null)

    await new ConsoleKernel().registerExceptionHandler('#tests/stubs/handlers/Handler')

    const exec = CommanderHandler.bindHandler(new ThrowCommand())

    await exec()

    assert.isTrue(ExitFaker.faker.calledWith(1))
  }
}