/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { existsSync } from 'fs'
import { File, Path } from '@secjs/utils'
import { Artisan } from 'src/Facades/Artisan'
import { Command } from 'src/Commands/Command'
import { Commander } from 'src/Contracts/Commander'
import { TemplateHelper } from 'src/Utils/TemplateHelper'
import { AlreadyExistFileException } from 'src/Exceptions/AlreadyExistFileException'
import { TemplateNotFoundException } from 'src/Exceptions/TemplateNotFoundException'

export class Service extends Command {
  /**
   * The name and signature of the console command.
   */
  protected signature = 'make:service <name>'

  /**
   * The console command description.
   */
  protected description = 'Make a new service file.'

  /**
   * Set additional flags in the commander instance.
   * This method is executed when registering your command.
   *
   * @return {void}
   */
  public addFlags(commander: Commander): Commander {
    return commander
      .option(
        '-e, --extension <extension>',
        'Current extension available: ts',
        'ts',
      )
      .option(
        '--no-register',
        'Do not register the service inside Providers/Container interface',
        true,
      )
      .option('--no-lint', 'Do not run eslint in the service', true)
  }

  /**
   * Execute the console command.
   *
   * @return {Promise<void>}
   */
  async handle(name: string, options: any): Promise<void> {
    this.simpleLog('[ MAKING SERVICE ]', 'rmNewLineStart', 'bold', 'green')

    name = TemplateHelper.normalizeName(name, 'Service')
    const template = TemplateHelper.getTemplate('__name__Service', options)

    if (!template) {
      throw new TemplateNotFoundException(options.extension)
    }

    const replacedName = TemplateHelper.replaceTemplateName(name, template.base)
    const path = Path.app(`Services/${replacedName}`)
    const content = TemplateHelper.replaceTemplateValues(
      name,
      template.getContentSync(),
    )

    if (existsSync(path)) {
      throw new AlreadyExistFileException('service', path)
    }

    const service = await new File(path, content).create()

    this.success(`Service ({yellow} "${service.name}") successfully created.`)

    if (options.lint) {
      await Artisan.call(`eslint:fix ${service.path} --resource Service`)
    }

    if (options.register && options.extension === 'ts') {
      await TemplateHelper.replaceInterfaceProperty(
        Path.providers('Container.ts'),
        'ContainerContract',
        service.name,
        `import { ${service.name} } from 'App/Services/${service.name}'`,
      )
    }
  }
}
