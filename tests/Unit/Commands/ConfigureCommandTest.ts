/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { fake } from 'sinon'
import { Artisan } from '#src'
import { Config } from '@athenna/config'
import { Exec, File } from '@athenna/common'
import { Test, ExitFaker, TestContext } from '@athenna/test'
import { BaseCommandTest } from '#tests/Helpers/BaseCommandTest'

export default class ConfigureCommandTest extends BaseCommandTest {
  @Test()
  public async shouldBeAbleToConfigurePathsInsideTheApplication({ assert }: TestContext) {
    await Artisan.call('configure ./tests/Stubs/library/build/Configurer/index.js')

    const { athenna } = await new File(Path.pwd('package.json')).getContentAsJson()

    assert.containsSubset(Config.get('rc.commands'), ['./tests/Stubs/library/build/Commands/MakeModelCommand.js'])
    assert.containsSubset(athenna.commands, ['./tests/Stubs/library/build/Commands/MakeModelCommand.js'])

    assert.containsSubset(Config.get('rc.providers'), ['./tests/Stubs/library/build/Providers/DatabaseProvider.js'])
    assert.containsSubset(athenna.providers, ['./tests/Stubs/library/build/Providers/DatabaseProvider.js'])

    assert.containsSubset(athenna.commandsManifest, {
      'make:model': './tests/Stubs/library/build/Commands/MakeModelCommand.js',
    })
    assert.containsSubset(Config.get('rc.commandsManifest'), {
      'make:model': './tests/Stubs/library/build/Commands/MakeModelCommand.js',
    })
  }

  @Test()
  public async shouldBeAbleToConfigureLibrariesInsideTheApplicationAndThrowErrorWhenConfigureDoesNotExist({
    assert,
  }: TestContext) {
    const originalCommand = Exec.command
    const commandFake = fake()

    Exec.command = (...args: any[]) => Promise.resolve(commandFake(...args))

    await Artisan.call('configure some-lib-name')

    Exec.command = originalCommand

    assert.isTrue(commandFake.calledOnceWith('npm install some-lib-name'))
    assert.isTrue(ExitFaker.faker.calledWith(1)) // <- Means that some error happened
  }
}
